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

    // FundingApplication model doesn't exist in schema
    // Return empty array for now - feature not implemented
    return NextResponse.json({
      applications: [],
      message: "Funding application tracking not yet implemented",
    });
  } catch (error) {
    console.error("Applications error:", error);
    return NextResponse.json({ error: "Failed to load applications" }, { status: 500 });
  }
}
