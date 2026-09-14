import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const graduationYear = searchParams.get("graduationYear");
    const industry = searchParams.get("industry");

    const where: any = { status: "alumni" }; // Student model uses "alumni", not "graduated"

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { researchTopic: { contains: search, mode: "insensitive" } },
        { currentPosition: { contains: search, mode: "insensitive" } },
      ];
    }

    if (graduationYear) {
      where.graduationYear = parseInt(graduationYear);
    }

    // Note: Student model doesn't have 'industry' field
    // Removing industry filter to match actual schema

    // Use actual Student model fields
    const alumni = await prisma.student.findMany({
      where,
      select: {
        id: true,
        name: true, // Student model only has 'name', not firstName/lastName
        degreeLevel: true,
        researchTopic: true,
        status: true,
        thesisTitle: true,
        graduationYear: true,
        currentPosition: true,
        profileUrl: true,
        photoUrl: true,
        achievements: true,
      },
      orderBy: { graduationYear: "desc" },
    });

    return NextResponse.json({ alumni });
  } catch (error) {
    console.error("Alumni directory error:", error);
    return NextResponse.json({ error: "Failed to load alumni" }, { status: 500 });
  }
}
