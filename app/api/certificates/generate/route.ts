import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { prisma } from "@/lib/prisma";
import { sessionOptions, SessionData } from "@/lib/session";
import { z } from "zod";
import QRCode from "qrcode";

const generateSchema = z.object({
  courseId: z.string().optional(),
  achievementType: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(request, NextResponse.next(), sessionOptions);
    if (!session.studentId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const result = generateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", fields: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = result.data;

    // Generate unique certificate code
    const code = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Generate QR code
    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/certificates/verify/${code}`;
    const qrCode = await QRCode.toDataURL(verificationUrl);

    // Get student info
    const student = await prisma.student.findUnique({
      where: { id: session.studentId },
      select: {
        name: true,
      },
    });

    // Create certificate
    const certificate = await prisma.certificate.create({
      data: {
        studentId: session.studentId,
        courseId: data.courseId,
        type: data.achievementType || "achievement",
        title: data.title,
        description: data.description,
        certificateUrl: qrCode, // Store QR code as certificate URL for now
        verificationCode: code,
        issueDate: new Date(),
      },
    });

    // Award points - update or create student points record
    const existingPoints = await prisma.studentPoints.findUnique({
      where: { studentId: session.studentId },
    });

    if (existingPoints) {
      await prisma.studentPoints.update({
        where: { studentId: session.studentId },
        data: {
          points: existingPoints.points + 50,
        },
      });
    } else {
      await prisma.studentPoints.create({
        data: {
          studentId: session.studentId,
          points: 50,
        },
      });
    }

    return NextResponse.json({
      message: "Certificate generated",
      certificate,
    }, { status: 201 });
  } catch (error) {
    console.error("Certificate generation error:", error);
    return NextResponse.json({ error: "Failed to generate certificate" }, { status: 500 });
  }
}
