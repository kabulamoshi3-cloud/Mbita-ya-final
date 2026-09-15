import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { prisma } from "@/lib/prisma";
import { sessionOptions, SessionData } from "@/lib/session";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getIronSession<SessionData>(request, NextResponse.next(), sessionOptions);

    if (!session.studentId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const courseId = params.id;

    // Check if student is enrolled
    const enrollment = await prisma.studentEnrollment.findFirst({
      where: {
        studentId: session.studentId,
        courseId,
      },
    });

    if (!enrollment) {
      return NextResponse.json({ error: "Not enrolled in this course" }, { status: 403 });
    }

    // Get course details
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        name: true,
        code: true,
        description: true,
        term: true,
        status: true,
        syllabusUrl: true,
        externalUrl: true,
        published: true,
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Get assignments
    const assignments = await prisma.assignment.findMany({
      where: { courseId },
      select: {
        id: true,
        title: true,
        description: true,
        dueDate: true,
        maxScore: true,
        published: true,
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
      },
    });
    const submissionMap = new Map(submissions.map(s => [s.assignmentId, s]));

    // Get course materials
    const materials = await prisma.courseMaterial.findMany({
      where: { courseId },
      orderBy: { createdAt: "desc" },
    });

    // Get announcements (using Announcement model, not CourseAnnouncement)
    const announcements = await prisma.announcement.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json({
      course,
      enrollment,
      assignments: assignments.map(a => ({
        ...a,
        submission: submissionMap.get(a.id) || null,
      })),
      materials,
      announcements,
    });

  } catch (error) {
    console.error("Course details error:", error);
    return NextResponse.json(
      { error: "Failed to load course details" },
      { status: 500 }
    );
  }
}
