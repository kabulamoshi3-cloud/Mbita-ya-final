import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Video model doesn't exist in schema
    return NextResponse.json({
      error: "Video features not implemented",
      message: "Video model does not exist in schema",
    }, { status: 501 });
  } catch (error) {
    console.error("Video error:", error);
    return NextResponse.json({ error: "Failed to load video" }, { status: 500 });
  }
}
