import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

// GET analytics dashboard data (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // days
    const daysAgo = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    // Page views
    const totalPageViews = await prisma.pageView.count({
      where: { viewedAt: { gte: startDate } },
    });

    const pageViewsByPath = await prisma.pageView.groupBy({
      by: ['path'],
      where: { viewedAt: { gte: startDate } },
      _count: true,
      orderBy: { _count: { path: 'desc' } },
      take: 10,
    });

    // Publications stats
    const totalPublications = await prisma.publication.count({
      where: { published: true },
    });

    // Research projects
    const activeProjects = await prisma.researchProject.count({
      where: { status: 'active', published: true },
    });

    // Students
    const currentStudents = await prisma.student.count({
      where: { status: 'current', published: true },
    });

    const alumni = await prisma.student.count({
      where: { status: 'alumni', published: true },
    });

    // Courses
    const activeCourses = await prisma.course.count({
      where: { status: 'active', published: true },
    });

    // Newsletter subscribers
    const newsletterSubscribers = await prisma.newsletterSubscriber.count();

    // Events
    const upcomingEvents = await prisma.event.count({
      where: {
        date: { gte: new Date() },
        published: true,
      },
    });

    // Gallery items
    const galleryItems = await prisma.galleryItem.count({
      where: { published: true },
    });

    // Blog posts
    const blogPosts = await prisma.blogPost.count({
      where: { draft: false },
    });

    // Contact messages (unread)
    const unreadMessages = await prisma.contactMessage.count({
      where: { read: false },
    });

    // Community posts
    const communityPosts = await prisma.communityPost.count({
      where: { published: true },
    });

    // Resources
    const resources = await prisma.resource.count({
      where: { published: true },
    });

    // Analytics events by type
    const eventsByType = await prisma.analyticsEvent.groupBy({
      by: ['eventType'],
      where: { timestamp: { gte: startDate } },
      _count: true,
      orderBy: { _count: { eventType: 'desc' } },
    });

    // Get daily page views for chart
    const dailyViews = await prisma.$queryRaw<Array<{ date: Date; count: number }>>`
      SELECT DATE(viewed_at) as date, COUNT(*) as count
      FROM "PageView"
      WHERE viewed_at >= ${startDate}
      GROUP BY DATE(viewed_at)
      ORDER BY date ASC
    `;

    return NextResponse.json({
      overview: {
        totalPageViews,
        totalPublications,
        activeProjects,
        currentStudents,
        alumni,
        activeCourses,
        newsletterSubscribers,
        upcomingEvents,
        galleryItems,
        blogPosts,
        unreadMessages,
        communityPosts,
        resources,
      },
      topPages: pageViewsByPath.map(p => ({
        path: p.path,
        views: p._count,
      })),
      eventsByType: eventsByType.map(e => ({
        type: e.eventType,
        count: e._count,
      })),
      dailyViews: dailyViews.map(d => ({
        date: d.date.toISOString().split('T')[0],
        views: Number(d.count),
      })),
      period: daysAgo,
    });
  } catch (error: any) {
    console.error('[Analytics Dashboard]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
