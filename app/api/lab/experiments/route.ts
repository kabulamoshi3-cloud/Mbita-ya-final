import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(request, NextResponse.next(), sessionOptions);
    if (!session.studentId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // LabExperiment model doesn't exist
    return NextResponse.json({
      experiments: [],
      message: "Lab experiments not yet implemented",
    });
  } catch (error) {
    console.error("Lab experiments error:", error);
    return NextResponse.json({ error: "Failed to load experiments" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(request, NextResponse.next(), sessionOptions);
    if (!session.studentId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    return NextResponse.json({
      error: "Lab experiments not yet implemented",
    }, { status: 501 });
  } catch (error) {
    console.error("Lab experiment create error:", error);
    return NextResponse.json({ error: "Failed to create experiment" }, { status: 500 });
  }
}
