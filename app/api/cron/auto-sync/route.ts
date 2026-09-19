import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { importSyncedPublications } from '@/lib/deduplication';

const prisma = new PrismaClient();

/**
 * GET /api/cron/auto-sync
 * Automated sync endpoint for cron jobs
 * 
 * This endpoint:
 * 1. Syncs all connected platforms
 * 2. Imports publications with deduplication
 * 3. Creates notifications for new publications
 * 
 * Security: Should be protected by cron secret or IP whitelist in production
 */
export async function GET(request: Request) {
  try {
    // Verify cron secret (optional but recommended)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.log('❌ Unauthorized cron attempt');
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🤖 Starting automated sync...');
    const startTime = Date.now();

    // Check if auto-sync is enabled in profile
    const profile = await prisma.profile.findFirst({
      select: { autoSyncEnabled: true },
    });

    if (!profile?.autoSyncEnabled) {
      console.log('⏸️  Auto-sync is disabled');
      return NextResponse.json({
        success: true,
        message: 'Auto-sync is disabled',
        skipped: true,
      });
    }

    // Get all connected platforms
    const connectedAccounts = await prisma.connectedAccount.findMany({
      where: { isActive: true },
      select: { platform: true, accountId: true },
    });

    console.log(`📊 Found ${connectedAccounts.length} connected platforms`);

    const syncResults: any[] = [];
    let totalSynced = 0;
    let totalErrors = 0;

    // Sync each platform
    for (const account of connectedAccounts) {
      try {
        console.log(`🔄 Syncing ${account.platform}...`);
        
        // Call the platform-specific sync endpoint
        const syncResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/sync/${account.platform}`,
          { method: 'POST' }
        );
        
        const syncResult = await syncResponse.json();
        
        if (syncResult.success) {
          totalSynced += syncResult.count || syncResult.newCount || 0;
          syncResults.push({
            platform: account.platform,
            status: 'success',
            count: syncResult.count || syncResult.newCount || 0,
          });
          console.log(`✅ ${account.platform}: ${syncResult.count || syncResult.newCount || 0} items`);
        } else {
          totalErrors++;
          syncResults.push({
            platform: account.platform,
            status: 'error',
            error: syncResult.error,
          });
          console.log(`❌ ${account.platform}: ${syncResult.error}`);
        }
      } catch (error: any) {
        totalErrors++;
        syncResults.push({
          platform: account.platform,
          status: 'error',
          error: error.message,
        });
        console.log(`❌ ${account.platform}: ${error.message}`);
      }
    }

    // Import publications with deduplication
    console.log('📥 Importing publications with deduplication...');
    const importResult = await importSyncedPublications();

    // Create notification for new publications
    if (importResult.imported > 0) {
      await createNotification({
        title: 'New Publications Synced',
        message: `${importResult.imported} new publications have been automatically synced from your academic profiles.`,
        type: 'success',
        link: '/admin/publications',
      });
      console.log(`📬 Created notification for ${importResult.imported} new publications`);
    }

    // Update last sync time
    await prisma.profile.updateMany({
      data: { lastSyncAt: new Date() },
    });

    const duration = Date.now() - startTime;
    console.log(`✅ Auto-sync completed in ${duration}ms`);

    return NextResponse.json({
      success: true,
      duration,
      sync: {
        platforms: syncResults,
        totalSynced,
        totalErrors,
      },
      import: {
        imported: importResult.imported,
        updated: importResult.updated,
        skipped: importResult.skipped,
        errors: importResult.errors,
      },
      message: `Synced ${totalSynced} items from ${connectedAccounts.length} platforms, imported ${importResult.imported} new publications`,
    });
  } catch (error: any) {
    console.error('❌ Auto-sync failed:', error);
    
    // Create error notification
    try {
      await createNotification({
        title: 'Auto-Sync Failed',
        message: `Automatic sync encountered an error: ${error.message}`,
        type: 'error',
        link: '/admin/integrations',
      });
    } catch (notifError) {
      console.error('Failed to create error notification:', notifError);
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * POST /api/cron/auto-sync
 * Same as GET but for cron services that prefer POST
 */
export async function POST(request: Request) {
  return GET(request);
}

/**
 * Helper function to create admin notifications
 */
async function createNotification(notification: {
  title: string;
  message: string;
  type: string;
  link?: string;
}) {
  try {
    await prisma.adminNotification.create({
      data: {
        title: notification.title,
        message: notification.message,
        type: notification.type,
        link: notification.link,
        read: false,
      },
    });
  } catch (error) {
    console.error('Failed to create notification:', error);
  } finally {
    await prisma.$disconnect();
  }
}
