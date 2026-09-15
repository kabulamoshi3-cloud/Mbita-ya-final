import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ error: 'Peer review not implemented', message: 'PeerReviewSubmission model does not exist' }, { status: 501 });
}

export async function POST() {
  return NextResponse.json({ error: 'Peer review not implemented' }, { status: 501 });
}
