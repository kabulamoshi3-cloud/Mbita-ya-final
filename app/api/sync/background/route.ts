import { NextResponse } from "next/server";
import { syncAllAccounts, importSyncedContent } from "@/lib/auto-sync";

/**
 * Background sync endpoint
 * Runs the actual sync process asynchronously
 */

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { trigger } = body;

    console.log(`[Background Sync] Started (trigger: ${trigger})`);

    // Run sync
    const result = await syncAllAccounts();

    // Auto-import new content with enhanced details
    const importResult = await importSyncedContent(50);

    console.log(`[Background Sync] Completed - Fetched: ${result.successful}/${result.total}, Imported: ${importResult.imported}, Skipped: ${importResult.skipped}`);

    return NextResponse.json({
      success: true,
      sync: {
        synced: result.successful,
        failed: result.failed,
        total: result.total,
        results: result.results,
      },
      import: importResult,
      summary: {
        accountsSynced: result.successful,
        itemsImported: importResult.imported,
        itemsSkipped: importResult.skipped,
        totalErrors: result.failed + importResult.errors,
      }
    });
  } catch (error: any) {
    console.error('[Background Sync] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
