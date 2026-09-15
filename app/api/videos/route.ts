import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { prisma } from "@/lib/prisma";
import { sessionOptions, SessionData } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(request, NextResponse.next(), sessionOptions);
    
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");
    const search = searchParams.get("search");

    const where: any = { published: true };
    if (courseId) where.courseId = courseId;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const videos = await prisma.videoLecture.findMany({
      where,
      select: {
        id: true,
        courseId: true,
        title: true,
        description: true,
        videoUrl: true,
        duration: true,
        thumbnailUrl: true,
        views: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    // Get progress for authenticated users
    let videosWithProgress = videos;
    if (session.studentId) {
      const videoIds = videos.map(v => v.id);
      const progressRecords = await prisma.videoProgress.findMany({
        where: {
          studentId: session.studentId,
          videoId: { in: videoIds },
        },
        select: {
          videoId: true,
          progress: true,
          completed: true,
        },
      });
      const progressMap = new Map(progressRecords.map(p => [p.videoId, p]));

      videosWithProgress = videos.map(v => ({
        ...v,
        userProgress: progressMap.get(v.id) || null,
      }));
    }

    return NextResponse.json({
      videos: videosWithProgress,
      total: videos.length,
    });
  } catch (error) {
    console.error("Videos error:", error);
    return NextResponse.json({ error: "Failed to load videos" }, { status: 500 });
  }
}
