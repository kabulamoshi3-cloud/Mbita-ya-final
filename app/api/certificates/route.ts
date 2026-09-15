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

    const certificates = await prisma.certificate.findMany({
      where: { studentId: session.studentId },
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
        createdAt: true,
      },
      orderBy: { issueDate: "desc" },
    });

    // Fetch courses separately
    const courseIds = certificates
      .map(c => c.courseId)
      .filter((id): id is string => id !== null);
    
    const courses = await prisma.course.findMany({
      where: { id: { in: courseIds } },
      select: { id: true, name: true, code: true },
    });
    const courseMap = new Map(courses.map(c => [c.id, c]));

    return NextResponse.json({
      certificates: certificates.map(cert => ({
        ...cert,
        course: cert.courseId ? courseMap.get(cert.courseId) : null,
      })),
    });
  } catch (error) {
    console.error("Certificates error:", error);
    return NextResponse.json({ error: "Failed to load certificates" }, { status: 500 });
  }
}
