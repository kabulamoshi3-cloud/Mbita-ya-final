import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { prisma } from "@/lib/prisma";
import { sessionOptions, SessionData } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(request, NextResponse.next(), sessionOptions);
    if (!session.studentId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Integration model is global (no user-specific integrations)
    return NextResponse.json({
      integrations: [],
      message: "User-specific integrations not yet implemented",
    });
  } catch (error) {
    console.error("Connected integrations error:", error);
    return NextResponse.json({ error: "Failed to load integrations" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(request, NextResponse.next(), sessionOptions);
    if (!session.studentId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    return NextResponse.json({
      error: "User-specific integrations not yet implemented",
    }, { status: 501 });
  } catch (error) {
    console.error("Integration disconnect error:", error);
    return NextResponse.json({ error: "Failed to disconnect integration" }, { status: 500 });
  }
}
