import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import DailyProgress from '@/lib/models/DailyProgress.js';

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    await connectDB();
    const progress = await DailyProgress.findOne({ userId, date });
    
    // If no progress found for the day, return empty completedBlocks array
    return NextResponse.json(progress || { completedBlocks: [] });
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

    const { date, completedBlocks } = await req.json();

    if (!date || !Array.isArray(completedBlocks)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    await connectDB();

    const progress = await DailyProgress.findOneAndUpdate(
      { userId, date },
      { completedBlocks },
      { new: true, upsert: true }
    );

    return NextResponse.json(progress);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
