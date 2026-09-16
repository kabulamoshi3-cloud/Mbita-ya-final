import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all appointments (with filters)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const studentId = searchParams.get('studentId');

    const where: any = {};
    if (status) where.status = status;
    if (studentId) where.studentId = studentId;

    const appointments = await prisma.appointment.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(appointments);
  } catch (error: any) {
    console.error('[Appointments GET]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST create appointment booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      studentId,
      guestName,
      guestEmail,
      date,
      startTime,
      endTime,
      purpose,
    } = body;

    if (!date || !startTime || !endTime || !purpose) {
      return NextResponse.json(
        { error: 'Date, start time, end time, and purpose required' },
        { status: 400 }
      );
    }

    if (!studentId && (!guestName || !guestEmail)) {
      return NextResponse.json(
        { error: 'Either student ID or guest name/email required' },
        { status: 400 }
      );
    }

    // Check for conflicts
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        date: new Date(date),
        startTime,
        status: { in: ['pending', 'confirmed'] },
      },
    });

    if (existingAppointment) {
      return NextResponse.json(
        { error: 'Time slot already booked' },
        { status: 409 }
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        studentId,
        guestName,
        guestEmail,
        date: new Date(date),
        startTime,
        endTime,
        purpose,
        status: 'pending',
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Appointment request submitted successfully',
        appointment,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[Book Appointment]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update appointment status or details
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, zoomUrl, notes } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Appointment ID required' },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        status,
        zoomUrl,
        notes,
      },
    });

    return NextResponse.json(appointment);
  } catch (error: any) {
    console.error('[Update Appointment]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE cancel appointment
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Appointment ID required' },
        { status: 400 }
      );
    }

    await prisma.appointment.update({
      where: { id },
      data: { status: 'cancelled' },
    });

    return NextResponse.json({ success: true, message: 'Appointment cancelled' });
  } catch (error: any) {
    console.error('[Cancel Appointment]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
