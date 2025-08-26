import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    session.test = 'test';
    await session.save();
    return NextResponse.json({ ok: true, session });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
