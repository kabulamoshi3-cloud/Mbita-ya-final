import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ error: 'Research network not fully implemented' }, { status: 501 });
}

export async function POST() {
  return NextResponse.json({ error: 'Research network not fully implemented' }, { status: 501 });
}
