import { NextResponse } from 'next/server';
import webpush from 'web-push';
import connectDB from '@/lib/mongodb';
import Schedule from '@/lib/models/Schedule.js';
import Subscription from '@/lib/models/Subscription.js';
import DailyTask from '@/lib/models/DailyTask.js';

// Initialize web push if keys exist
if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:admin@yourdomain.com', // Push services (like Chrome/Google) use this to contact you if there are issues
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

// Next.js config to allow cron to bypass auth if we had auth, but we use Clerk middleware which we need to bypass for this route
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const isTest = url.searchParams.get('test') === 'true';
    const secretQuery = url.searchParams.get('secret');
    
    // Secure this endpoint via a secret token sent by Vercel Cron
    const authHeader = req.headers.get('Authorization');
    const hasValidSecret = process.env.CRON_SECRET && 
      (authHeader === `Bearer ${process.env.CRON_SECRET}` || secretQuery === process.env.CRON_SECRET);

    // If CRON_SECRET is defined in .env, enforce it
    if (process.env.CRON_SECRET && !hasValidSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Restore 5-minute interval logic
    const intervalParam = url.searchParams.get('interval');
    const cronInterval = intervalParam ? parseInt(intervalParam, 10) : 5;

    // Helper to check if a target time falls within the cron execution window
    const isWithinWindow = (target: number, current: number, interval: number) => {
      const half = Math.floor(interval / 2);
      let diff = Math.abs(target - current);
      if (diff > 720) diff = 1440 - diff; // Handle midnight wraparound
      
      return diff <= half;
    };

    await connectDB();
    const now = new Date();
    // Convert to local time, defaulting to Asia/Kolkata (IST) since Railway runs in UTC
    const tzString = now.toLocaleString('en-US', { timeZone: process.env.TIMEZONE || 'Asia/Kolkata' });
    const localNow = new Date(tzString);
    const currentMinutes = localNow.getHours() * 60 + localNow.getMinutes();

    const schedules = await Schedule.find();
    
    let pushCount = 0;

    let schedulePushSentInTest = false;

    for (const schedule of schedules) {
      let notifyTypes: string[] = [];
      
      if (isTest) {
        if (!schedulePushSentInTest) {
          notifyTypes = ['15_min_before', 'on_time'];
        }
      } else {
        if (isWithinWindow(schedule.startMinutes - 15, currentMinutes, cronInterval)) {
          notifyTypes.push('15_min_before');
        }
        
        if (isWithinWindow(schedule.startMinutes, currentMinutes, cronInterval)) {
          notifyTypes.push('on_time');
        }
      }

      for (const notifyType of notifyTypes) {
        const subscriptions = await Subscription.find({ userId: schedule.userId });
        
        const payload = JSON.stringify({
          title: notifyType === 'on_time' ? "Time to Start!" : "Upcoming in 15 mins",
          body: `${schedule.title} (${schedule.timeRange})`,
          scheduleId: schedule._id,
          type: notifyType,
          tag: `schedule-${schedule._id}-${notifyType}`
        });

        for (const sub of subscriptions) {
          try {
            if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
              await webpush.sendNotification(sub.subscription, payload);
              pushCount++;
              if (isTest) schedulePushSentInTest = true;
            }
          } catch (error: any) {
            console.error("Error sending push notification (may be expired):", error);
            if (error.statusCode === 410 || error.statusCode === 404) {
              await Subscription.deleteOne({ _id: sub._id });
            }
          }
        }
      }
    }

    // Now process Daily Tasks
    let taskPushSentInTest = false;
    const tasks = await DailyTask.find({ completed: false });
    for (const task of tasks) {
      let notify = false;
      if (isTest) {
        if (!taskPushSentInTest) {
          notify = true;
        }
      } else {
        if (isWithinWindow(task.reminderMinutes, currentMinutes, cronInterval)) {
          notify = true;
        }
      }

      if (notify) {
        const subscriptions = await Subscription.find({ userId: task.userId });
        
        const payload = JSON.stringify({
          title: "Daily Task Reminder",
          body: task.title,
          taskId: task._id,
          type: 'daily_task',
          tag: `task-${task._id}`
        });

        for (const sub of subscriptions) {
          try {
            if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
              await webpush.sendNotification(sub.subscription, payload);
              pushCount++;
              if (isTest) taskPushSentInTest = true;
            }
          } catch (error: any) {
            console.error("Error sending push notification (may be expired):", error);
            if (error.statusCode === 410 || error.statusCode === 404) {
              await Subscription.deleteOne({ _id: sub._id });
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true, pushed: pushCount });
  } catch (error: any) {
    console.error("Cron Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
