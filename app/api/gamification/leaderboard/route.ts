import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "all"; // all, week, month
    const limit = parseInt(searchParams.get("limit") || "10");

    let dateFilter: Date | undefined;
    if (period === "week") {
      dateFilter = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === "month") {
      dateFilter = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get student points (StudentPoints has no date tracking, ignore dateFilter)
    const studentPoints = await prisma.studentPoints.findMany({
      select: {
        studentId: true,
        points: true,
        level: true,
      },
      orderBy: { points: 'desc' },
      take: limit,
    });

    // Get student details
    const leaderboard = await Promise.all(
      studentPoints.map(async (sp) => {
        const student = await prisma.student.findUnique({
          where: { id: sp.studentId },
          select: {
            name: true,
            photoUrl: true,
          },
        });

        // StudentBadge model may not exist, set to 0
        let badgesCount = 0;
        try {
          badgesCount = await prisma.studentBadge.count({
            where: { studentId: sp.studentId },
          });
        } catch {
          badgesCount = 0;
        }

        return {
          studentId: sp.studentId,
          name: student?.name || "Unknown",
          profilePicture: student?.photoUrl,
          points: sp.points || 0,
          level: sp.level || 1,
          badgesCount,
        };
      })
    );

    return NextResponse.json({ leaderboard });

  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json(
      { error: "Failed to load leaderboard" },
      { status: 500 }
    );
  }
}
