import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import DailyLog from '@/lib/models/DailyLog.js';

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const logs = await DailyLog.find({ userId }).sort({ timestamp: -1 });
    return NextResponse.json(logs);
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

    const { date, timestamp, primaryTask, secondaryTask, summary, confidenceScore, completedBlocks } = await req.json();

    await connectDB();
    const newLog = new DailyLog({
      userId,
      date,
      timestamp,
      primaryTask,
      secondaryTask,
      summary,
      confidenceScore,
      completedBlocks: completedBlocks || []
    });

    await newLog.save();
    return NextResponse.json(newLog, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
