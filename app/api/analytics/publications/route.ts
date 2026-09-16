import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET publication analytics (public)
export async function GET() {
  try {
    // Total publications by type
    const publicationsByType = await prisma.publication.groupBy({
      by: ['type'],
      where: { published: true },
      _count: true,
    });

    // Publications by year
    const publicationsByYear = await prisma.publication.groupBy({
      by: ['year'],
      where: { published: true },
      _count: true,
      orderBy: { year: 'desc' },
    });

    // Total publications
    const total = await prisma.publication.count({
      where: { published: true },
    });

    // Get citation metrics if available
    const citationMetrics = await prisma.citationMetric.findMany({
      select: {
        publicationId: true,
        citations: true,
        downloads: true,
        views: true,
      },
    });

    const totalCitations = citationMetrics.reduce((sum, m) => sum + m.citations, 0);
    const totalDownloads = citationMetrics.reduce((sum, m) => sum + m.downloads, 0);
    const totalViews = citationMetrics.reduce((sum, m) => sum + m.views, 0);

    // H-index calculation (simplified)
    const citationCounts = citationMetrics
      .map(m => m.citations)
      .sort((a, b) => b - a);
    
    let hIndex = 0;
    for (let i = 0; i < citationCounts.length; i++) {
      if (citationCounts[i] >= i + 1) {
        hIndex = i + 1;
      } else {
        break;
      }
    }

    return NextResponse.json({
      overview: {
        totalPublications: total,
        totalCitations,
        totalDownloads,
        totalViews,
        hIndex,
      },
      byType: publicationsByType.map(p => ({
        type: p.type,
        count: p._count,
      })),
      byYear: publicationsByYear.map(p => ({
        year: p.year,
        count: p._count,
      })),
    });
  } catch (error: any) {
    console.error('[Publication Analytics]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
