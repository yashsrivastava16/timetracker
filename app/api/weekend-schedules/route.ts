import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import WeekendSchedule from '@/lib/models/WeekendSchedule.js';

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const schedules = await WeekendSchedule.find({ userId });
    return NextResponse.json(schedules);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { timeTitle, title, description, activities, keyRule, iconName } = await req.json();

    await connectDB();
    const newSchedule = new WeekendSchedule({
      userId,
      timeTitle,
      title,
      description,
      activities: activities || [],
      keyRule,
      iconName: iconName || 'Sun'
    });

    await newSchedule.save();
    return NextResponse.json(newSchedule, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
