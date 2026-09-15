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

    const video = await prisma.videoLecture.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        courseId: true,
        title: true,
        description: true,
        videoUrl: true,
        duration: true,
        transcript: true,
        thumbnailUrl: true,
        chapters: true,
        views: true,
        published: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!video || !video.published) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Increment view count
    await prisma.videoLecture.update({
      where: { id: params.id },
      data: { views: { increment: 1 } },
    });

    // Get user progress if authenticated
    let userProgress = null;
    if (session.studentId) {
      userProgress = await prisma.videoProgress.findFirst({
        where: {
          videoId: params.id,
          studentId: session.studentId,
        },
        select: {
          progress: true,
          lastPosition: true,
          completed: true,
        },
      });
    }

    // Get comments
    const comments = await prisma.videoComment.findMany({
      where: { videoId: params.id },
      select: {
        id: true,
        studentId: true,
        content: true,
        timestamp: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({
      video: {
        ...video,
        userProgress,
      },
      comments,
    });
  } catch (error) {
    console.error("Video error:", error);
    return NextResponse.json({ error: "Failed to load video" }, { status: 500 });
  }
}
