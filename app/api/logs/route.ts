import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import Log from '@/lib/models/Log.js';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { scheduleId, title, status, eventTime } = await req.json();

    await connectDB();
    const log = new Log({
      userId,
      scheduleId,
      title,
      status,
      eventTime,
    });

    await log.save();
    return NextResponse.json(log, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
