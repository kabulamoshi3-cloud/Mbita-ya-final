import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { importSyncedContent } from "@/lib/auto-sync";

// GET - List synced content
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const platform = searchParams.get("platform");
    const contentType = searchParams.get("type");
    const imported = searchParams.get("imported");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where: any = {};
    
    if (platform) where.platform = platform;
    if (contentType) where.contentType = contentType;
    if (imported !== null) where.importedToDb = imported === "true";

    const content = await prisma.syncedContent.findMany({
      where,
      orderBy: { publishedDate: "desc" },
      take: limit,
    });

    const stats = await prisma.syncedContent.groupBy({
      by: ["platform", "contentType"],
      _count: true,
    });

    return NextResponse.json({ content, stats });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch content" },
      { status: 500 }
    );
  }
}

// POST - Import synced content to main database
export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.isAdmin && !session?.username) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { limit = 100 } = body;

    const result = await importSyncedContent(limit);

    return NextResponse.json({
      message: `Import complete: ${result.imported} imported, ${result.skipped} skipped, ${result.errors} errors`,
      ...result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Import failed" },
      { status: 500 }
    );
  }
}
