import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { syncFromProfileUrls } from "@/lib/sync-from-profile-urls";
import { importSyncedContent } from "@/lib/auto-sync";

/**
 * Manual Sync Endpoint
 * Syncs content from academic profile URLs (Google Scholar, ORCID, GitHub, etc.)
 * Uses URLs directly from Profile.academicProfiles - no ConnectedAccount needed!
 */

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { serpApiKey, importToDb = true } = body;

    // Step 1: Sync from academic profile URLs
    const syncResult = await syncFromProfileUrls(serpApiKey);
    
    if (!syncResult.success) {
      return NextResponse.json({
        success: false,
        message: "Sync failed",
        results: syncResult.results,
      }, { status: 400 });
    }
    
    let importResult = null;
    
    // Step 2: Import synced content to database tables
    if (importToDb && syncResult.total > 0) {
      importResult = await importSyncedContent();
    }
    
    return NextResponse.json({
      success: true,
      message: `Successfully synced ${syncResult.total} items from academic profiles`,
      sync: {
        total: syncResult.total,
        results: syncResult.results,
      },
      import: importResult ? {
        publications: importResult.publications || 0,
        research: importResult.research || 0,
        code: importResult.code || 0,
        total: importResult.total || 0,
      } : null,
    });
  } catch (error: any) {
    console.error('[Manual Sync] Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || "Sync failed" 
      },
      { status: 500 }
    );
  }
}
