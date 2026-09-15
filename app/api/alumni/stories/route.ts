import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured") === "true";

    const where: any = { status: "published" };
    if (featured) where.featured = true;

    const stories = await prisma.alumniStory.findMany({
      where,
      select: {
        id: true,
        alumniId: true,
        title: true,
        story: true,
        imageUrl: true,
        featured: true,
        published: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ stories });
  } catch (error) {
    console.error("Alumni stories error:", error);
    return NextResponse.json({ error: "Failed to load stories" }, { status: 500 });
  }
}
