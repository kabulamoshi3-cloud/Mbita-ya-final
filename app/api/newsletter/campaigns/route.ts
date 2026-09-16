import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

// GET all campaigns (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const campaigns = await prisma.newsletterCampaign.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(campaigns);
  } catch (error: any) {
    console.error('[Newsletter Campaigns GET]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST create new campaign
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { subject, content, templateId, status, scheduledFor } = body;

    if (!subject || !content) {
      return NextResponse.json(
        { error: 'Subject and content are required' },
        { status: 400 }
      );
    }

    const campaign = await prisma.newsletterCampaign.create({
      data: {
        subject,
        content,
        templateId,
        status: status || 'draft',
        scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
      },
    });

    return NextResponse.json(campaign, { status: 201 });
  } catch (error: any) {
    console.error('[Newsletter Campaign POST]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update campaign
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, subject, content, templateId, status, scheduledFor } = body;

    if (!id) {
      return NextResponse.json({ error: 'Campaign ID required' }, { status: 400 });
    }

    const campaign = await prisma.newsletterCampaign.update({
      where: { id },
      data: {
        subject,
        content,
        templateId,
        status,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
      },
    });

    return NextResponse.json(campaign);
  } catch (error: any) {
    console.error('[Newsletter Campaign PUT]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE campaign
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Campaign ID required' }, { status: 400 });
    }

    await prisma.newsletterCampaign.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Newsletter Campaign DELETE]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
