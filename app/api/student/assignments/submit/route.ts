import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { prisma } from "@/lib/prisma";
import { sessionOptions, SessionData } from "@/lib/session";
import { z } from "zod";

const submitSchema = z.object({
  assignmentId: z.string(),
  content: z.string().min(1, "Content is required"),
  attachmentUrl: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(request, NextResponse.next(), sessionOptions);

    if (!session.studentId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const result = submitSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", fields: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { assignmentId, content, attachmentUrl } = result.data;

    // Check if assignment exists
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      select: {
        id: true,
        courseId: true,
        dueDate: true,
        published: true,
      },
    });

    if (!assignment || !assignment.published) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    // Check if student is enrolled in the course
    const enrollment = await prisma.studentEnrollment.findFirst({
      where: {
        studentId: session.studentId,
        courseId: assignment.courseId,
        status: "active",
      },
    });

    if (!enrollment) {
      return NextResponse.json({ error: "Not enrolled in this course" }, { status: 403 });
    }

    // Check if already submitted
    const existingSubmission = await prisma.assignmentSubmission.findFirst({
      where: {
        assignmentId,
        studentId: session.studentId,
      },
    });

    if (existingSubmission && existingSubmission.gradedAt) {
      return NextResponse.json(
        { error: "Assignment already submitted and graded" },
        { status: 400 }
      );
    }

    // Create or update submission
    const submission = existingSubmission
      ? await prisma.assignmentSubmission.update({
          where: { id: existingSubmission.id },
          data: {
            content,
            fileUrl: attachmentUrl,
            submittedAt: new Date(),
            late: assignment.dueDate < new Date(),
          },
        })
      : await prisma.assignmentSubmission.create({
          data: {
            assignmentId,
            studentId: session.studentId,
            content,
            fileUrl: attachmentUrl,
            submittedAt: new Date(),
            late: assignment.dueDate < new Date(),
          },
        });

    // Update student points (upsert)
    const studentPoints = await prisma.studentPoints.findUnique({
      where: { studentId: session.studentId },
    });

    if (studentPoints) {
      await prisma.studentPoints.update({
        where: { studentId: session.studentId },
        data: { points: studentPoints.points + 10 },
      });
    } else {
      await prisma.studentPoints.create({
        data: {
          studentId: session.studentId,
          points: 10,
        },
      });
    }

    return NextResponse.json({
      message: "Assignment submitted successfully",
      submission,
    });

  } catch (error) {
    console.error("Assignment submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit assignment" },
      { status: 500 }
    );
  }
}
