import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import Phase from '@/lib/models/Phase.js';

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const phases = await Phase.find({ userId }).sort({ number: 1 });
    return NextResponse.json(phases);
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

    const { number, title, startDate, endDate, primaryFocus, secondaryFocus, otherFocus, milestoneGoal } = await req.json();

    await connectDB();
    const newPhase = new Phase({
      userId,
      number,
      title,
      startDate,
      endDate,
      primaryFocus: primaryFocus || [],
      secondaryFocus: secondaryFocus || [],
      otherFocus: otherFocus || [],
      milestoneGoal
    });

    await newPhase.save();
    return NextResponse.json(newPhase, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
