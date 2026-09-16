import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

// GET all availability slots (public)
export async function GET() {
  try {
    const slots = await prisma.availabilitySlot.findMany({
      where: { active: true },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });

    // Group by day of week
    const grouped = slots.reduce((acc: any, slot) => {
      const day = slot.dayOfWeek;
      if (!acc[day]) acc[day] = [];
      acc[day].push(slot);
      return acc;
    }, {});

    return NextResponse.json({ slots, grouped });
  } catch (error: any) {
    console.error('[Availability GET]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST create/update availability slot (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, dayOfWeek, startTime, endTime, active } = body;

    if (dayOfWeek === undefined || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Day of week, start time, and end time required' },
        { status: 400 }
      );
    }

    if (id) {
      // Update existing slot
      const slot = await prisma.availabilitySlot.update({
        where: { id },
        data: { dayOfWeek, startTime, endTime, active },
      });
      return NextResponse.json(slot);
    } else {
      // Create new slot
      const slot = await prisma.availabilitySlot.create({
        data: {
          dayOfWeek,
          startTime,
          endTime,
          active: active !== false,
        },
      });
      return NextResponse.json(slot, { status: 201 });
    }
  } catch (error: any) {
    console.error('[Availability POST]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE availability slot (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Slot ID required' }, { status: 400 });
    }

    await prisma.availabilitySlot.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Availability DELETE]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
