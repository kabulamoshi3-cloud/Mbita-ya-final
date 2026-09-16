import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST - Subscribe to newsletter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { message: 'Email already subscribed', alreadySubscribed: true },
        { status: 200 }
      );
    }

    const subscriber = await prisma.newsletterSubscriber.create({
      data: { email },
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Successfully subscribed to newsletter!',
        subscriber 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[Newsletter Subscribe]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET - Get subscriber count (public)
export async function GET() {
  try {
    const count = await prisma.newsletterSubscriber.count();
    return NextResponse.json({ count });
  } catch (error: any) {
    console.error('[Newsletter Subscribe GET]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Unsubscribe
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    await prisma.newsletterSubscriber.delete({ where: { email } });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Successfully unsubscribed' 
    });
  } catch (error: any) {
    console.error('[Newsletter Unsubscribe]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
