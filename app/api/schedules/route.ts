import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import Schedule from '@/lib/models/Schedule.js';

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const schedules = await Schedule.find({ userId }).sort({ startMinutes: 1 });
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

    const { timeRange, title, description, startMinutes, endMinutes } = await req.json();

    await connectDB();
    const newSchedule = new Schedule({
      userId,
      timeRange,
      title,
      description,
      startMinutes,
      endMinutes,
    });

    await newSchedule.save();
    return NextResponse.json(newSchedule, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
