import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Video model doesn't exist in schema
    return NextResponse.json({
      videos: [],
      total: 0,
      message: "Video features not implemented - Video model does not exist",
    });
  } catch (error) {
    console.error("Videos error:", error);
    return NextResponse.json({ error: "Failed to load videos" }, { status: 500 });
  }
}
