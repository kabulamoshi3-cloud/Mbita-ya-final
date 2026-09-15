import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const certificate = await prisma.certificate.findUnique({
      where: { id: params.id },
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
        blockchainHash: true,
        createdAt: true,
      },
    });

    if (!certificate) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    // Fetch student and course separately
    let student = null;
    let course = null;

    if (certificate.studentId) {
      student = await prisma.student.findUnique({
        where: { id: certificate.studentId },
        select: {
          name: true,
          photoUrl: true,
          degreeLevel: true,
        },
      });
    }

    if (certificate.courseId) {
      course = await prisma.course.findUnique({
        where: { id: certificate.courseId },
        select: {
          name: true,
          code: true,
        },
      });
    }

    return NextResponse.json({
      certificate: {
        ...certificate,
        student,
        course,
      },
    });
  } catch (error) {
    console.error("Certificate error:", error);
    return NextResponse.json({ error: "Failed to load certificate" }, { status: 500 });
  }
}
