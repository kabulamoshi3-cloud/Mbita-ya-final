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

    const body = await request.json();
    const { event, category, metadata } = body;

    // Track event (you can store in a separate analytics table if needed)
    await prisma.activityLog.create({
      data: {
        studentId: session.studentId,
        event,
        category,
        metadata: metadata || {},
      },
    });

    // Update student's last login timestamp (StudentUser model, not Student)
    // Note: Student model doesn't have lastActive field
    // If this is for student portal users, update StudentUser
    await prisma.studentUser.update({
      where: { id: session.studentId },
      data: { lastLogin: new Date() },
    }).catch(() => {
      // Silently fail if student is not in StudentUser table
      // (might be admin or different user type)
    });

    return NextResponse.json({ message: "Event tracked" });
  } catch (error) {
    console.error("Event tracking error:", error);
    return NextResponse.json({ error: "Failed to track event" }, { status: 500 });
  }
}
