import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const certificate = await prisma.certificate.findUnique({
      where: { verificationCode: params.code },
      select: {
        id: true,
        studentId: true,
        courseId: true,
        type: true,
        title: true,
        description: true,
        issueDate: true,
        certificateUrl: true,
        verificationCode: true,
      },
    });

    if (!certificate) {
      return NextResponse.json({
        valid: false,
        message: "Certificate not found",
      }, { status: 404 });
    }

    // Fetch student and course separately
    const student = certificate.studentId
      ? await prisma.student.findUnique({
          where: { id: certificate.studentId },
          select: { name: true },
        })
      : null;

    const course = certificate.courseId
      ? await prisma.course.findUnique({
          where: { id: certificate.courseId },
          select: { name: true, code: true },
        })
      : null;

    return NextResponse.json({
      valid: true,
      certificate: {
        id: certificate.id,
        title: certificate.title,
        recipientName: student?.name || "Unknown",
        issueDate: certificate.issueDate,
        type: certificate.type,
        course,
      },
    });
  } catch (error) {
    console.error("Certificate verification error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
