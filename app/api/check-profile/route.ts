import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET endpoint to check profile status and auto-enable if needed
export async function GET() {
  try {
    // Check if profile exists
    let profile = await prisma.profile.findFirst();

    if (!profile) {
      // Create profile with auto-sync enabled
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
          academicProfiles: [],
          autoSyncEnabled: true,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Profile created with auto-sync ENABLED",
        profile: {
          id: profile.id,
          name: profile.fullName,
          autoSyncEnabled: profile.autoSyncEnabled,
        },
      });
    }

    // If profile exists but autoSyncEnabled is not set, enable it
    if (profile.autoSyncEnabled === false || profile.autoSyncEnabled === null) {
      profile = await prisma.profile.update({
        where: { id: profile.id },
        data: { autoSyncEnabled: true },
      });

      return NextResponse.json({
        success: true,
        message: "Auto-sync has been ENABLED",
        profile: {
          id: profile.id,
          name: profile.fullName,
          autoSyncEnabled: profile.autoSyncEnabled,
          wasDisabled: true,
        },
      });
    }

    // Profile exists and auto-sync is already enabled
    return NextResponse.json({
      success: true,
      message: "Auto-sync is already ENABLED",
      profile: {
        id: profile.id,
        name: profile.fullName,
        autoSyncEnabled: profile.autoSyncEnabled,
      },
    });

  } catch (error: any) {
    console.error('Error checking/enabling profile:', error);
    return NextResponse.json({
      success: false,
      error: "Failed to check profile",
      details: error.message,
    }, { status: 500 });
  }
}

// POST endpoint
export async function POST() {
  return GET();
}
