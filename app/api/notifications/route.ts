import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/notifications
 * Get all admin notifications
 * Query params:
 * - unreadOnly: boolean (default: false)
 * - limit: number (default: 50)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');

    const notifications = await prisma.adminNotification.findMany({
      where: unreadOnly ? { read: false } : undefined,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    const unreadCount = await prisma.adminNotification.count({
      where: { read: false },
    });

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error: any) {
    console.error('❌ Failed to fetch notifications:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * POST /api/notifications
 * Create a new notification (for testing or manual creation)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, message, type, link } = body;

    if (!title || !message) {
      return NextResponse.json(
        { success: false, error: 'Title and message are required' },
        { status: 400 }
      );
    }

    const notification = await prisma.adminNotification.create({
      data: {
        title,
        message,
        type: type || 'info',
        link: link || null,
        read: false,
      },
    });

    return NextResponse.json({
      success: true,
      notification,
    });
  } catch (error: any) {
    console.error('❌ Failed to create notification:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * PATCH /api/notifications
 * Mark notification(s) as read
 * Body: { id: string } or { markAllRead: true }
 */
export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    if (body.markAllRead) {
      // Mark all as read
      await prisma.adminNotification.updateMany({
        where: { read: false },
        data: { read: true },
      });

      return NextResponse.json({
        success: true,
        message: 'All notifications marked as read',
      });
    } else if (body.id) {
      // Mark specific notification as read
      await prisma.adminNotification.update({
        where: { id: body.id },
        data: { read: true },
      });

      return NextResponse.json({
        success: true,
        message: 'Notification marked as read',
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Either id or markAllRead is required' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('❌ Failed to update notification:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * DELETE /api/notifications
 * Delete notification(s)
 * Query params: id=<notificationId> or deleteAll=true
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const deleteAll = searchParams.get('deleteAll') === 'true';

    if (deleteAll) {
      await prisma.adminNotification.deleteMany({
        where: { read: true }, // Only delete read notifications
      });

      return NextResponse.json({
        success: true,
        message: 'All read notifications deleted',
      });
    } else if (id) {
      await prisma.adminNotification.delete({
        where: { id },
      });

      return NextResponse.json({
        success: true,
        message: 'Notification deleted',
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Either id or deleteAll is required' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('❌ Failed to delete notification:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
