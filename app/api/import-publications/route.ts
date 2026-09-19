import { NextResponse } from 'next/server';
import { importSyncedPublications, getDeduplicationStats } from '@/lib/deduplication';

/**
 * POST /api/import-publications
 * Import synced publications from SyncedContent to Publication table
 * with automatic deduplication
 * 
 * Query params:
 * - platform: Optional platform filter (e.g., 'google_scholar')
 */
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform') || undefined;

    console.log('🔄 Starting publication import with deduplication...');
    if (platform) {
      console.log(`📌 Filtering by platform: ${platform}`);
    }

    const result = await importSyncedPublications(platform);

    return NextResponse.json({
      success: true,
      ...result,
      summary: `Imported ${result.imported} new publications, updated ${result.updated}, skipped ${result.skipped} duplicates`,
    });
  } catch (error: any) {
    console.error('❌ Import failed:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/import-publications
 * Get deduplication statistics
 */
export async function GET() {
  try {
    const stats = await getDeduplicationStats();
    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error: any) {
    console.error('❌ Failed to get stats:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
