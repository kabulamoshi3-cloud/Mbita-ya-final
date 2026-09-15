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

    // Get total points (StudentPoints has one record per student with studentId as unique)
    const studentPoints = await prisma.studentPoints.findUnique({
      where: { studentId: session.studentId },
      select: { points: true, level: true, rank: true },
    });

    const totalPoints = studentPoints?.points || 0;
    const level = studentPoints?.level || 1;
    const pointsToNextLevel = (level * 100) - totalPoints;

    // StudentBadge model doesn't exist
    const badgesCount = 0;

    // Get rank from all students
    const allStudentPoints = await prisma.studentPoints.findMany({
      select: { studentId: true, points: true },
      orderBy: { points: 'desc' },
    });

    const rank = allStudentPoints.findIndex(s => s.studentId === session.studentId) + 1;

    return NextResponse.json({
      totalPoints,
      level,
      pointsToNextLevel,
      badgesCount,
      rank: rank || studentPoints?.rank || null,
      achievements: [], // StudentBadge model doesn't exist
    });

  } catch (error) {
    console.error("Gamification stats error:", error);
    return NextResponse.json(
      { error: "Failed to load stats" },
      { status: 500 }
    );
  }
}
