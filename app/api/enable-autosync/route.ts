import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET endpoint to enable auto-sync (can be called via browser URL)
export async function GET() {
  try {
    // First, check if profile exists
    let profile = await prisma.profile.findFirst();

    if (!profile) {
      // Create a default profile if none exists
      profile = await prisma.profile.create({
        data: {
          fullName: "Dr. Deogratius Mbita Emmanuel",
          title: "Senior Lecturer",
          department: "Computer Science",
          institution: "University",
          email: "mbita@example.com",
          officeLocation: "Office Building",
          officeHours: "Mon-Fri 9AM-5PM",
          bio: "Academic Profile",
          academicProfiles: {},
          autoSyncEnabled: true,
        },
      });
    } else {
      // Update existing profile to enable auto-sync
      profile = await prisma.profile.update({
        where: { id: profile.id },
        data: { autoSyncEnabled: true },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Auto-sync has been ENABLED successfully! ✅",
      profile: {
        id: profile.id,
        name: profile.fullName,
        autoSyncEnabled: profile.autoSyncEnabled,
        lastSync: profile.lastSyncAt,
      },
      nextSteps: [
        "1. Visit /api/sync/auto-connect to connect academic profiles",
        "2. Go to /admin/auto-sync to manage sync",
        "3. Click 'Sync Now' to start syncing",
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
