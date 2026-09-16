import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST submit vote
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pollId, answer, studentId } = body;

    if (!pollId || !answer) {
      return NextResponse.json(
        { error: 'Poll ID and answer required' },
        { status: 400 }
      );
    }

    // Check if poll is active
    const poll = await prisma.livePoll.findUnique({
      where: { id: pollId },
    });

    if (!poll) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }

    if (!poll.active) {
      return NextResponse.json({ error: 'Poll is not active' }, { status: 400 });
    }

    // Check if already voted (if not anonymous)
    if (studentId && !poll.anonymous) {
      const existingVote = await prisma.pollResponse.findFirst({
        where: { pollId, studentId },
      });

      if (existingVote) {
        return NextResponse.json(
          { error: 'Already voted on this poll' },
          { status: 400 }
        );
      }
    }

    const response = await prisma.pollResponse.create({
      data: {
        pollId,
        studentId: poll.anonymous ? null : studentId,
        answer,
      },
    });

    return NextResponse.json({ success: true, response }, { status: 201 });
  } catch (error: any) {
    console.error('[Poll Vote]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
