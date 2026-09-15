import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { prisma } from "@/lib/prisma";
import { sessionOptions, SessionData } from "@/lib/session";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(request, NextResponse.next(), sessionOptions);
    if (!session.studentId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const studentId = session.studentId;

    // Get completed courses with grades
    const completedCourses = await prisma.studentEnrollment.findMany({
      where: {
        studentId,
        status: "completed",
        grade: { not: null },
      },
      select: { grade: true },
    });

    const avgGrade = completedCourses.length > 0
      ? completedCourses.reduce((sum, c) => sum + (parseFloat(c.grade || '0') || 0), 0) / completedCourses.length
      : 0;

    // Assignment completion rate
    const totalAssignments = await prisma.assignmentSubmission.count({
      where: { studentId },
    });

    const completedAssignments = await prisma.assignmentSubmission.count({
      where: { studentId, gradedAt: { not: null } },
    });

    const completionRate = totalAssignments > 0
      ? Math.round((completedAssignments / totalAssignments) * 100)
      : 0;

    // Video completion
    const videosWatched = await prisma.videoProgress.count({
      where: { studentId, completed: true },
    });

    // Points earned
    const pointsTotal = await prisma.studentPoints.aggregate({
      where: { studentId },
      _sum: { points: true },
    });

    // Get recent grades (using score instead of grade)
    const recentGrades = await prisma.assignmentSubmission.findMany({
      where: {
        studentId,
        gradedAt: { not: null },
        score: { not: null },
      },
      select: { score: true, assignmentId: true },
      orderBy: { submittedAt: "desc" },
      take: 6,
    });

    // Calculate trend as percentage scores (using maxScore from Assignment)
    const trend = recentGrades.map(g => ({
      score: g.score || 0,
    }));

    return NextResponse.json({
      averageGrade: Math.round(avgGrade),
      completionRate,
      videosCompleted: videosWatched,
      totalPoints: pointsTotal._sum.points || 0,
      performanceTrend: trend,
    });
  } catch (error) {
    console.error("Performance analytics error:", error);
    return NextResponse.json({ error: "Failed to load performance data" }, { status: 500 });
  }
}
