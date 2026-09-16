import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

// GET all polls (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const polls = await prisma.livePoll.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(polls);
  } catch (error: any) {
    console.error('[Polling GET]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST create new poll
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { courseId, question, options, type, anonymous } = body;

    if (!question || !options || !Array.isArray(options) || options.length < 2) {
      return NextResponse.json(
        { error: 'Question and at least 2 options required' },
        { status: 400 }
      );
    }

    const poll = await prisma.livePoll.create({
      data: {
        courseId,
        question,
        options,
        type: type || 'multiple_choice',
        anonymous: anonymous !== false,
        active: false,
      },
    });

    return NextResponse.json(poll, { status: 201 });
  } catch (error: any) {
    console.error('[Polling POST]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
