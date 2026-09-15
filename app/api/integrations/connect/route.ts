import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { prisma } from "@/lib/prisma";
import { sessionOptions, SessionData } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(request, NextResponse.next(), sessionOptions);
    if (!session.studentId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Integration model is global (no user-specific integrations)
    // This feature needs a UserIntegration model to be implemented
    return NextResponse.json({
      error: "User-specific integrations not yet implemented",
      message: "Integration model needs per-user tracking (studentId/userId field)",
    }, { status: 501 });
  } catch (error) {
    console.error("Integration connect error:", error);
    return NextResponse.json({ error: "Failed to connect integration" }, { status: 500 });
  }
}
