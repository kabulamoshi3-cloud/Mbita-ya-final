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
    const status = searchParams.get("status"); // pending, submitted, graded
    const courseId = searchParams.get("courseId");

    // Get enrolled courses
    const enrollments = await prisma.studentEnrollment.findMany({
      where: {
        studentId: session.studentId,
        status: "active",
        ...(courseId && { courseId }),
      },
      select: { courseId: true },
    });

    const courseIds = enrollments.map(e => e.courseId);

    // Get assignments
    const assignments = await prisma.assignment.findMany({
      where: {
        courseId: { in: courseIds },
      },
      select: {
        id: true,
        title: true,
        description: true,
        dueDate: true,
        maxScore: true,
        courseId: true,
      },
      orderBy: { dueDate: "asc" },
    });

    // Get submissions separately
    const assignmentIds = assignments.map(a => a.id);
    const submissions = await prisma.assignmentSubmission.findMany({
      where: {
        studentId: session.studentId,
        assignmentId: { in: assignmentIds },
      },
      select: {
        id: true,
        assignmentId: true,
        score: true,
        submittedAt: true,
        gradedAt: true,
        feedback: true,
      },
    });
    const submissionMap = new Map(submissions.map(s => [s.assignmentId, s]));

    // Get courses separately
    const courses = await prisma.course.findMany({
      where: { id: { in: courseIds } },
      select: { id: true, name: true, code: true },
    });
    const courseMap = new Map(courses.map(c => [c.id, c]));

    // Filter by submission status if requested
    let filteredAssignments = assignments;
    if (status) {
      filteredAssignments = assignments.filter(a => {
        const submission = submissionMap.get(a.id);
        if (status === "pending") return !submission;
        if (status === "submitted") return submission && !submission.gradedAt;
        if (status === "graded") return submission && submission.gradedAt;
        return true;
      });
    }

    return NextResponse.json({
      assignments: filteredAssignments.map(a => {
        const course = courseMap.get(a.courseId);
        const submission = submissionMap.get(a.id);
        return {
          id: a.id,
          title: a.title,
          description: a.description,
          dueDate: a.dueDate,
          maxScore: a.maxScore,
          courseId: a.courseId,
          courseName: course?.name || "Unknown",
          courseCode: course?.code || "N/A",
          submission: submission || null,
          isOverdue: a.dueDate < new Date() && !submission,
        };
      }),
    });

  } catch (error) {
    console.error("Assignments error:", error);
    return NextResponse.json(
      { error: "Failed to load assignments" },
      { status: 500 }
    );
  }
}
