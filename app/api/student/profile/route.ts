import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { prisma } from "@/lib/prisma";
import { sessionOptions, SessionData } from "@/lib/session";
import { z } from "zod";

const profileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  profilePicture: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  github: z.string().url().optional(),
  website: z.string().url().optional(),
  interests: z.array(z.string()).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(request, NextResponse.next(), sessionOptions);
    if (!session.studentId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const student = await prisma.student.findUnique({
      where: { id: session.studentId },
      select: {
        id: true,
        name: true,
        degreeLevel: true,
        researchTopic: true,
        status: true,
        thesisTitle: true,
        graduationYear: true,
        currentPosition: true,
        profileUrl: true,
        photoUrl: true,
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Get additional stats
    const enrolledCourses = await prisma.studentEnrollment.count({
      where: { studentId: session.studentId, status: "active" },
    });

    const completedCourses = await prisma.studentEnrollment.count({
      where: { studentId: session.studentId, status: "completed" },
    });

    const studentPoints = await prisma.studentPoints.findUnique({
      where: { studentId: session.studentId },
      select: { points: true },
    });

    // StudentBadge model doesn't exist
    const badgesCount = 0;

    return NextResponse.json({
      profile: student,
      stats: {
        enrolledCourses,
        completedCourses,
        totalPoints: studentPoints?.points || 0,
        badgesCount,
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(request, NextResponse.next(), sessionOptions);
    if (!session.studentId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const result = profileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", fields: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updatedStudent = await prisma.student.update({
      where: { id: session.studentId },
      data: result.data,
    });

    return NextResponse.json({
      message: "Profile updated",
      profile: updatedStudent,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
