import { NextRequest, NextResponse } from "next/server";

/**
 * Test endpoint to log EXACTLY what the frontend sends
 * Use this to debug "validation failed" errors
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log("========== TEST VALIDATION ENDPOINT ==========");
    console.log("Received body:", JSON.stringify(body, null, 2));
    console.log("Body keys:", Object.keys(body));
    console.log("Body type:", typeof body);
    console.log("==============================================");
    
    return NextResponse.json({
      success: true,
      message: "Check server logs for the exact body received",
      receivedKeys: Object.keys(body),
      receivedBody: body,
    });
  } catch (err) {
    console.error("Test endpoint error:", err);
    return NextResponse.json({
      error: "Failed to parse JSON",
      message: err instanceof Error ? err.message : String(err),
    }, { status: 400 });
  }
}
