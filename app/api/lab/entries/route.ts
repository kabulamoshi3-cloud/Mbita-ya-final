import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(request, NextResponse.next(), sessionOptions);
    if (!session.studentId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // LabEntry and LabExperiment models don't exist in schema
    return NextResponse.json({
      error: "Lab entries not yet implemented",
      message: "LabEntry and LabExperiment models need to be added to schema",
    }, { status: 501 });
  } catch (error) {
    console.error("Lab entry error:", error);
    return NextResponse.json({ error: "Failed to create entry" }, { status: 500 });
  }
}
