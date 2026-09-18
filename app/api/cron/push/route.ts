import { NextResponse } from 'next/server';
import webpush from 'web-push';
import connectDB from '@/lib/mongodb';
import Schedule from '@/lib/models/Schedule.js';
import Subscription from '@/lib/models/Subscription.js';
import DailyTask from '@/lib/models/DailyTask.js';

// Initialize web push if keys exist
if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:test@example.com',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

// Next.js config to allow cron to bypass auth if we had auth, but we use Clerk middleware which we need to bypass for this route
export async function GET(req: Request) {
  // In production, you'd want to secure this endpoint via a secret token sent by Vercel Cron
  // e.g. if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) { ... }
  
  try {
    const url = new URL(req.url);
    const isTest = url.searchParams.get('test') === 'true';
    const intervalParam = url.searchParams.get('interval');
    const cronInterval = intervalParam ? parseInt(intervalParam, 10) : 1;

    await connectDB();
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Helper to check if a target time falls within the cron execution window
    // This perfectly handles intervals like 5 minutes by matching the closest cron tick
    const isWithinWindow = (target: number, current: number, interval: number) => {
      const half = Math.floor(interval / 2);
      let diff = Math.abs(target - current);
      if (diff > 720) diff = 1440 - diff; // Handle midnight wraparound
      // For interval=5, half=2. Matches: current-2, current-1, current, current+1, current+2
      return diff <= half;
    };

    const schedules = await Schedule.find();
    
    let pushCount = 0;

    for (const schedule of schedules) {
      let notifyType = null;
      
      if (isTest) {
        notifyType = 'on_time';
      } else {
        if (isWithinWindow(schedule.startMinutes - 15, currentMinutes, cronInterval)) {
          notifyType = '15_min_before';
        }
        
        if (isWithinWindow(schedule.startMinutes, currentMinutes, cronInterval)) {
          notifyType = 'on_time';
        }
      }

      if (notifyType) {
        const subscriptions = await Subscription.find({ userId: schedule.userId });
        
        const payload = JSON.stringify({
          title: notifyType === 'on_time' ? "Time to Start!" : "Upcoming in 15 mins",
          body: `${schedule.title} (${schedule.timeRange})`,
          scheduleId: schedule._id,
          type: notifyType
        });

        for (const sub of subscriptions) {
          try {
            if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
              await webpush.sendNotification(sub.subscription, payload);
              pushCount++;
            }
          } catch (error: any) {
            console.error("Error sending push notification (may be expired):", error);
            if (error.statusCode === 410 || error.statusCode === 404) {
              await Subscription.deleteOne({ _id: sub._id });
            }
          }
        }
      }
      if (isTest && pushCount > 0) break; // In test mode, just send one round of notifications and break
    }

    // Now process Daily Tasks
    const tasks = await DailyTask.find({ completed: false });
    for (const task of tasks) {
      let notify = false;
      if (isTest) {
        notify = true;
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
          type: 'daily_task'
        });

        for (const sub of subscriptions) {
          try {
            if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
              await webpush.sendNotification(sub.subscription, payload);
              pushCount++;
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
