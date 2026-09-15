import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET endpoint to enable auto-sync (can be called via browser URL)
export async function GET() {
  try {
    // Update Profile to enable auto-sync
    const profile = await prisma.profile.update({
      where: { id: 1 },
      data: { autoSyncEnabled: true },
      select: {
        id: true,
        fullName: true,
        autoSyncEnabled: true,
        lastSyncAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Auto-sync has been ENABLED successfully! ✅",
      profile: {
        name: profile.fullName,
        autoSyncEnabled: profile.autoSyncEnabled,
        lastSync: profile.lastSyncAt,
      },
      nextSteps: [
        "1. Connect external accounts at /integrations/connect",
        "2. Go to /admin/auto-sync to manage sync",
        "3. Click 'Full Sync + Import' to start syncing",
      ],
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error enabling auto-sync:', error);
    return NextResponse.json({
      success: false,
      error: "Failed to enable auto-sync",
      details: error.message,
    }, { status: 500 });
  }
}

// POST endpoint for API calls
export async function POST() {
  return GET();
}
