import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Marketplace webhook not implemented - MarketplaceProduct model doesn't exist
    return NextResponse.json({
      error: "Marketplace webhooks not yet implemented",
    }, { status: 501 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
