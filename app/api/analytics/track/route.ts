import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST track analytics event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventType, userId, sessionId, properties, path } = body;

    if (!eventType) {
      return NextResponse.json({ error: 'Event type required' }, { status: 400 });
    }

    // Get request metadata
    const userAgent = request.headers.get('user-agent') || undefined;
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                      request.headers.get('x-real-ip') || 
                      undefined;

    const event = await prisma.analyticsEvent.create({
      data: {
        eventType,
        userId,
        sessionId,
        properties: properties || {},
        userAgent,
        ipAddress,
      },
    });

    // Also track page views separately
    if (eventType === 'page_view' && path) {
      await prisma.pageView.create({
        data: {
          path,
          userAgent,
        },
      });
    }

    return NextResponse.json({ success: true, event }, { status: 201 });
  } catch (error: any) {
    console.error('[Analytics Track]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
