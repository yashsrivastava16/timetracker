import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import Subscription from '@/lib/models/Subscription.js';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subscription = await req.json();

    await connectDB();
    let sub = await Subscription.findOne({ userId, 'subscription.endpoint': subscription.endpoint });
    
    if (!sub) {
      sub = new Subscription({
        userId,
        subscription
      });
      await sub.save();
    }

    return NextResponse.json({}, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
