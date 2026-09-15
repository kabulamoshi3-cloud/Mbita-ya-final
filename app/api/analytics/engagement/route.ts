import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "week"; // week, month, year

    let dateFilter: Date;
    if (period === "week") {
      dateFilter = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === "month") {
      dateFilter = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    } else {
      dateFilter = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
    }

    // Active students count (StudentUser model, not Student)
    // Note: Student model only has 'current' and 'alumni' status
    // StudentUser is for the student portal with active field
    const activeStudents = await prisma.studentUser.count({
      where: {
        active: true,
        lastLogin: { gte: dateFilter },
      },
    });

    // Assignment submissions
    const assignments = await prisma.assignmentSubmission.count({
      where: { submittedAt: { gte: dateFilter } },
    });

    // Video watch time (count of watch progress records)
    const videoWatches = await prisma.videoProgress.count({
      where: { updatedAt: { gte: dateFilter } },
    });

    // Course enrollments
    const enrollments = await prisma.studentEnrollment.count({
      where: { enrolledAt: { gte: dateFilter } },
    });

    // Forum posts/activity (if you have forum model)
    // Calculate engagement score
    const engagementScore = Math.round(
      (activeStudents * 0.3 + assignments * 0.3 + videoWatches * 0.2 + enrollments * 0.2) / 10
    );

    return NextResponse.json({
      period,
      metrics: {
        activeStudents,
        assignmentSubmissions: assignments,
        videoWatches,
        newEnrollments: enrollments,
        engagementScore: Math.min(engagementScore, 100),
      },
    });
  } catch (error) {
    console.error("Engagement analytics error:", error);
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 });
  }
}
