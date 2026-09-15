import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcrypt";

export const dynamic = "force-dynamic";

// Allow both GET and POST so it can be called from browser
export async function GET(request: NextRequest) {
  return handleInit();
}

export async function POST(request: NextRequest) {
  return handleInit();
}

async function handleInit() {
  try {
    // Check if already initialized
    const existingAdmin = await prisma.adminUser.findUnique({ where: { id: 1 } });
    const existingProfile = await prisma.profile.findUnique({ where: { id: 1 } });

    if (existingAdmin && existingProfile) {
      return NextResponse.json({
        success: false,
        message: "Database already initialized. Admin and profile already exist.",
        adminExists: true,
        profileExists: true,
      });
    }

    const results: any = {
      admin: null,
      profile: null,
      siteSettings: null,
    };

    // 1. Create Admin User
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash("admin123", 10);
      results.admin = await prisma.adminUser.upsert({
        where: { id: 1 },
        update: {},
        create: {
          id: 1,
          username: "admin",
          passwordHash,
          failedAttempts: 0,
          totpEnabled: false,
        },
      });
    }

    // 2. Create Profile
    if (!existingProfile) {
      results.profile = await prisma.profile.upsert({
        where: { id: 1 },
        update: {},
        create: {
          id: 1,
          fullName: "Dr. Deogratis Mbita Emmanuel",
          title: "Senior Lecturer & Researcher",
          department: "Department of Computer Science",
          institution: "University Name",
          email: "deogratis.mbita@example.com",
          officeLocation: "Building A, Room 201",
          officeHours: "Monday-Friday, 2:00 PM - 4:00 PM",
          bio: "Dr. Deogratis Mbita Emmanuel is a distinguished researcher and educator specializing in computer science and technology. With years of experience in academia, he has contributed significantly to research, publications, and student mentorship.",
          photoUrl: "/images/profile-placeholder.jpg",
          cvUrl: "",
          navbarPhotoUrl: "",
          heroPhotoUrl: "",
          aboutPhotoUrl: "",
          contactPhotoUrl: "",
          footerPhotoUrl: "",
          adminPhotoUrl: "",
          academicProfiles: {
            googleScholar: "",
            researchGate: "",
            orcid: "",
            linkedin: "",
          },
          vision: "To advance knowledge and innovation in technology for societal impact.",
          mission: "Empowering students through quality education and cutting-edge research.",
          skills: ["Research", "Teaching", "Programming", "Data Analysis"],
          languages: ["English", "Swahili"],
          education: [
            {
              degree: "PhD in Computer Science",
              institution: "University Name",
              year: "2015",
            },
          ],
          autoSyncEnabled: false,
        },
      });
    }

    // 3. Create Site Settings
    const existingSettings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
    if (!existingSettings) {
      results.siteSettings = await prisma.siteSettings.upsert({
        where: { id: 1 },
        update: {},
        create: {
          id: 1,
          siteTitle: "Dr. Deogratis Mbita Emmanuel",
          tagline: "Academic Portfolio & Research Hub",
          footerText: "© 2026 Dr. Deogratis Mbita Emmanuel. All rights reserved.",
          contactEmail: "deogratis.mbita@example.com",
          maintenanceMode: false,
          socialLinks: {
            twitter: "",
            linkedin: "",
            github: "",
            facebook: "",
          },
          hiddenSections: [],
          showAnnouncements: true,
          showStats: true,
          showNewsSlider: true,
          showUpcomingEvents: true,
          showPublications: true,
          showTestimonials: true,
          showResearchHighlights: true,
          showAchievements: true,
          showQuickLinks: true,
          heroTitle: "Welcome to My Academic Portfolio",
          heroSubtitle: "Advancing Knowledge Through Research and Education",
        },
      });
    }

    // 4. Create Sample Publication
    const publicationCount = await prisma.publication.count();
    if (publicationCount === 0) {
      await prisma.publication.create({
        data: {
          title: "Sample Research Publication",
          authors: ["Dr. Deogratis Mbita Emmanuel"],
          venue: "International Journal of Computer Science",
          year: 2024,
          type: "journal",
          abstract: "This is a sample publication. Replace with your actual research papers.",
          published: true,
        },
      });
    }

    // 5. Create Sample Research Project
    const projectCount = await prisma.researchProject.count();
    if (projectCount === 0) {
      await prisma.researchProject.create({
        data: {
          slug: "sample-research-project",
          title: "Sample Research Project",
          description: "This is a sample research project. Add your actual projects through the admin panel.",
          status: "active",
          startYear: 2024,
          published: true,
        },
      });
    }

    // 6. Create Sample Course
    const courseCount = await prisma.course.count();
    if (courseCount === 0) {
      await prisma.course.create({
        data: {
          name: "Introduction to Computer Science",
          code: "CS101",
          term: "Fall 2024",
          status: "active",
          description: "Sample course. Add your actual courses through the admin panel.",
          published: true,
        },
      });
    }

    // 7. Create Welcome Announcement
    const announcementCount = await prisma.announcement.count();
    if (announcementCount === 0) {
      await prisma.announcement.create({
        data: {
          title: "Welcome to the Academic Portfolio",
          content: "This website has been successfully set up. Login to the admin panel to customize your content.",
          published: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully!",
      credentials: {
        adminUsername: "admin",
        adminPassword: "admin123",
        warning: "⚠️ Please change the admin password immediately after login!",
      },
      loginUrl: "/login",
      adminUrl: "/admin",
      created: {
        admin: results.admin ? true : false,
        profile: results.profile ? true : false,
        siteSettings: results.siteSettings ? true : false,
        sampleData: true,
      },
    });
  } catch (error: any) {
    console.error("Setup error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
