import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET poll results
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const poll = await prisma.livePoll.findUnique({
      where: { id },
    });

    if (!poll) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }

    const responses = await prisma.pollResponse.findMany({
      where: { pollId: id },
    });

    // Calculate results
    const options = poll.options as string[];
    const results = options.map(option => ({
      option,
      count: responses.filter(r => r.answer === option).length,
      percentage: responses.length > 0 
        ? ((responses.filter(r => r.answer === option).length / responses.length) * 100).toFixed(1)
        : '0',
    }));

    return NextResponse.json({
      poll,
      totalVotes: responses.length,
      results,
    });
  } catch (error: any) {
    console.error('[Poll Results]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
