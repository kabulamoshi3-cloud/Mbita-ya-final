import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

// GET active polls (public)
export async function GET(request: NextRequest) {
  try {
    const polls = await prisma.livePoll.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(polls);
  } catch (error: any) {
    console.error('[Active Polls GET]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST toggle poll active status (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, active } = body;

    if (!id) {
      return NextResponse.json({ error: 'Poll ID required' }, { status: 400 });
    }

    const poll = await prisma.livePoll.update({
      where: { id },
      data: { active },
    });

    return NextResponse.json(poll);
  } catch (error: any) {
    console.error('[Toggle Poll Active]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
