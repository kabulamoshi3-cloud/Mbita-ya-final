import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { scrapeGoogleScholar } from '@/lib/scrapers/google-scholar';

const prisma = new PrismaClient();

export async function POST() {
  try {
    console.log('🔄 Starting Google Scholar sync...');

    // Get Google Scholar profile URL from database
    const profile = await prisma.profile.findFirst({
      select: { academicProfiles: true },
    });

    const academicProfiles = Array.isArray(profile?.academicProfiles)
      ? (profile.academicProfiles as Array<{ label: string; url: string }>)
      : [];

    const scholarProfile = academicProfiles.find(
      (p) => p.label === 'Google Scholar'
    );

    if (!scholarProfile?.url) {
      return NextResponse.json(
        { success: false, error: 'Google Scholar profile URL not found' },
        { status: 400 }
      );
    }

    // Scrape Google Scholar
    const scholarData = await scrapeGoogleScholar(scholarProfile.url);

    // Save to SyncedContent table
    let savedCount = 0;
    let newCount = 0;

    for (const pub of scholarData.publications) {
      // Check if already exists
      const existing = await prisma.syncedContent.findFirst({
        where: {
          platform: 'google_scholar',
          externalId: pub.externalId,
        },
      });

      if (!existing) {
        // Create new synced content
        await prisma.syncedContent.create({
          data: {
            platform: 'google_scholar',
            externalId: pub.externalId,
            contentType: 'publication',
            title: pub.title,
            content: pub.abstract || '',
            metadata: {
              authors: pub.authors,
              venue: pub.venue,
              year: pub.year,
              citations: pub.citations,
              url: pub.url,
            },
            authors: pub.authors,
            publishedDate: new Date(pub.year, 0, 1),
            citations: pub.citations,
            url: pub.url,
            importedToDb: false, // Will be imported by deduplication process
          },
        });
        newCount++;
      } else {
        // Update existing
        await prisma.syncedContent.update({
          where: { id: existing.id },
          data: {
            citations: pub.citations,
            lastFetchedAt: new Date(),
            metadata: {
              authors: pub.authors,
              venue: pub.venue,
              year: pub.year,
              citations: pub.citations,
              url: pub.url,
            },
          },
        });
      }
      savedCount++;
    }

    // Update or create connected account
    await prisma.connectedAccount.upsert({
      where: {
        platform_accountId: {
          platform: 'google_scholar',
          accountId: scholarProfile.url,
        },
      },
      update: {
        lastSyncedAt: new Date(),
        syncStatus: 'success',
        metadata: {
          hIndex: scholarData.hIndex,
          i10Index: scholarData.i10Index,
          totalCitations: scholarData.totalCitations,
          syncedCount: savedCount,
        },
      },
      create: {
        platform: 'google_scholar',
        accountId: scholarProfile.url,
        isActive: true,
        lastSyncedAt: new Date(),
        syncStatus: 'success',
        metadata: {
          hIndex: scholarData.hIndex,
          i10Index: scholarData.i10Index,
          totalCitations: scholarData.totalCitations,
          syncedCount: savedCount,
        },
      },
    });

    console.log(`✅ Google Scholar sync complete: ${savedCount} publications (${newCount} new)`);

    return NextResponse.json({
      success: true,
      count: savedCount,
      newCount,
      message: `Synced ${savedCount} publications from Google Scholar (${newCount} new)`,
      metrics: {
        hIndex: scholarData.hIndex,
        i10Index: scholarData.i10Index,
        totalCitations: scholarData.totalCitations,
      },
    });
  } catch (error: any) {
    console.error('❌ Google Scholar sync failed:', error);

    // Update connected account with error
    try {
      const profile = await prisma.profile.findFirst({
        select: { academicProfiles: true },
      });

      const academicProfiles = Array.isArray(profile?.academicProfiles)
        ? (profile.academicProfiles as Array<{ label: string; url: string }>)
        : [];

      const scholarProfile = academicProfiles.find(
        (p) => p.label === 'Google Scholar'
      );

      if (scholarProfile?.url) {
        await prisma.connectedAccount.upsert({
          where: {
            platform_accountId: {
              platform: 'google_scholar',
              accountId: scholarProfile.url,
            },
          },
          update: {
            syncStatus: 'error',
            syncError: error.message,
          },
          create: {
            platform: 'google_scholar',
            accountId: scholarProfile.url,
            isActive: true,
            syncStatus: 'error',
            syncError: error.message,
          },
        });
      }
    } catch (updateError) {
      console.error('Failed to update error status:', updateError);
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
