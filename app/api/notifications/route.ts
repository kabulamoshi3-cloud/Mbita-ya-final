import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sessionOptions, SessionData } from "@/lib/session";
import { createErrorResponse, AuthenticationError, ValidationError } from "@/lib/error-handler";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(request, NextResponse.next(), sessionOptions);
    if (!session.studentId) {
      throw new AuthenticationError("Not authenticated");
    }

    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get("unread") === "true";

    const where: Prisma.StudentNotificationWhereInput = { 
      studentId: session.studentId,
      ...(unreadOnly && { read: false })
    };

    const notifications = await prisma.studentNotification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const unreadCount = await prisma.studentNotification.count({
      where: { studentId: session.studentId, read: false },
    });

    return NextResponse.json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    return createErrorResponse(error, "Failed to load notifications");
  }
}

const notificationActionSchema = z.object({
  notificationId: z.string().optional(),
  action: z.enum(["mark_read", "mark_all_read"]),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(request, NextResponse.next(), sessionOptions);
    if (!session.studentId) {
      throw new AuthenticationError("Not authenticated");
    }

    const body = await request.json();
    const { notificationId, action } = notificationActionSchema.parse(body);

    if (action === "mark_read") {
      if (!notificationId) {
        throw new ValidationError("Notification ID is required for mark_read action");
      }

      await prisma.studentNotification.update({
        where: { id: notificationId },
        data: { read: true },
      });

      return NextResponse.json({ message: "Marked as read" });
    }

    if (action === "mark_all_read") {
      await prisma.studentNotification.updateMany({
        where: { studentId: session.studentId, read: false },
        data: { read: true },
      });

      return NextResponse.json({ message: "All marked as read" });
    }

    throw new ValidationError("Invalid action");
  } catch (error) {
    return createErrorResponse(error, "Failed to update notification");
  }
}
