import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get campaign statistics
    const campaigns = await prisma.newsletterCampaign.findMany({
      select: {
        id: true,
        subject: true,
        status: true,
        recipients: true,
        opens: true,
        clicks: true,
        sentAt: true,
      },
    });

    const subscribers = await prisma.newsletterSubscriber.count();
    
    // Calculate aggregate stats
    const totalCampaigns = campaigns.length;
    const sentCampaigns = campaigns.filter(c => c.status === 'sent');
    const totalSent = sentCampaigns.reduce((sum, c) => sum + (c.recipients || 0), 0);
    const totalOpens = sentCampaigns.reduce((sum, c) => sum + c.opens, 0);
    const totalClicks = sentCampaigns.reduce((sum, c) => sum + c.clicks, 0);
    
    const openRate = totalSent > 0 ? (totalOpens / totalSent) * 100 : 0;
    const clickRate = totalOpens > 0 ? (totalClicks / totalOpens) * 100 : 0;

    return NextResponse.json({
      analytics: {
        totalSubscribers: subscribers,
        totalCampaigns,
        sentCampaigns: sentCampaigns.length,
        draftCampaigns: campaigns.filter(c => c.status === 'draft').length,
        scheduledCampaigns: campaigns.filter(c => c.status === 'scheduled').length,
        totalSent,
        totalOpens,
        totalClicks,
        openRate: openRate.toFixed(2),
        clickRate: clickRate.toFixed(2),
      },
      recentCampaigns: sentCampaigns.slice(0, 5),
    });
  } catch (error) {
    console.error("Newsletter analytics error:", error);
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 });
  }
}
