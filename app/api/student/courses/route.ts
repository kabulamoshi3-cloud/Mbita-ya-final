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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "active";

    const enrollments = await prisma.studentEnrollment.findMany({
      where: {
        studentId: session.studentId,
        status: status as any,
      },
      select: {
        id: true,
        studentId: true,
        courseId: true,
        status: true,
        grade: true,
        enrolledAt: true,
        completedAt: true,
      },
      orderBy: { enrolledAt: "desc" },
    });

    const coursesWithDetails = await Promise.all(
      enrollments.map(async (enrollment) => {
        // Get course details separately
        const course = await prisma.course.findUnique({
          where: { id: enrollment.courseId },
          select: {
            id: true,
            name: true,
            code: true,
            description: true,
            term: true,
            status: true,
            syllabusUrl: true,
            published: true,
          },
        });

        const totalAssignments = await prisma.assignment.count({
          where: { courseId: enrollment.courseId },
        });

        // Get assignment IDs for this course
        const assignments = await prisma.assignment.findMany({
          where: { courseId: enrollment.courseId },
          select: { id: true },
        });
        const assignmentIds = assignments.map(a => a.id);

        const completedAssignments = await prisma.assignmentSubmission.count({
          where: {
            studentId: session.studentId,
            assignmentId: { in: assignmentIds },
            gradedAt: { not: null },
          },
        });

        const progress = totalAssignments > 0
          ? Math.round((completedAssignments / totalAssignments) * 100)
          : 0;

        return {
          enrollmentId: enrollment.id,
          enrolledAt: enrollment.enrolledAt,
          finalGrade: enrollment.grade,
          status: enrollment.status,
          course: course || { id: enrollment.courseId, name: "Unknown Course" },
          progress,
          totalAssignments,
          completedAssignments,
        };
      })
    );

    return NextResponse.json({ courses: coursesWithDetails });

  } catch (error) {
    console.error("Courses error:", error);
    return NextResponse.json(
      { error: "Failed to load courses" },
      { status: 500 }
    );
  }
}
