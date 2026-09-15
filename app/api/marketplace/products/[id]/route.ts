import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ error: 'Marketplace not implemented', message: 'MarketplaceProduct/MarketplaceOrder models do not exist' }, { status: 501 });
}

export async function POST() {
  return NextResponse.json({ error: 'Marketplace not implemented' }, { status: 501 });
}

export async function PUT() {
  return NextResponse.json({ error: 'Marketplace not implemented' }, { status: 501 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Marketplace not implemented' }, { status: 501 });
}
