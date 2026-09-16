import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

// POST - Initialize default navigation structure
export async function POST() {
  try {
    const session = await getSession();
    if (!session?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if navigation already exists
    const existing = await prisma.navigationMenu.count();
    if (existing > 0) {
      return NextResponse.json(
        { error: "Navigation already initialized" },
        { status: 400 }
      );
    }

    // Create default navigation structure
    const defaultNavigation = [
      // Home
      {
        label: "Home",
        href: "/",
        icon: "🏠",
        order: 0,
        isVisible: true,
      },
      
      // About
      {
        label: "About",
        href: "/about",
        icon: "👤",
        description: "Learn about Dr. Mbita's background and expertise",
        order: 1,
        isVisible: true,
      },
      
      // Research (with sub-menu)
      {
        label: "Research",
        href: "/research",
        icon: "🔬",
        description: "Explore ongoing and completed research projects",
        order: 2,
        isVisible: true,
        isMegaMenu: true,
      },
      
      // Publications
      {
        label: "Publications",
        href: "/publications",
        icon: "📚",
        description: "Academic papers, journals, and conference proceedings",
        order: 3,
        isVisible: true,
      },
      
      // Teaching (with sub-menu)
      {
        label: "Teaching",
        href: "/teaching",
        icon: "🎓",
        description: "Courses, students, and educational activities",
        order: 4,
        isVisible: true,
        isMegaMenu: true,
      },
      
      // Blog
      {
        label: "Blog",
        href: "/blog",
        icon: "✍️",
        description: "Insights, tutorials, and academic discussions",
        order: 5,
        isVisible: true,
      },
      
      // Contact
      {
        label: "Contact",
        href: "/contact",
        icon: "📧",
        description: "Get in touch for collaborations and inquiries",
        order: 6,
        isVisible: true,
      },
    ];

    // Create top-level items
    const createdItems: any = {};
    for (const item of defaultNavigation) {
      const created = await prisma.navigationMenu.create({
        data: item as any,
      });
      createdItems[item.label] = created;
    }

    // Create sub-menu items for Research
    const researchSubItems = [
      {
        label: "Projects",
        href: "/research",
        description: "Current and past research projects",
        parentId: createdItems["Research"].id,
        order: 0,
      },
      {
        label: "Datasets",
        href: "/research/datasets",
        description: "Research datasets and resources",
        parentId: createdItems["Research"].id,
        order: 1,
      },
      {
        label: "Presentations",
        href: "/research/presentations",
        description: "Conference presentations and talks",
        parentId: createdItems["Research"].id,
        order: 2,
      },
      {
        label: "Proposals",
        href: "/research/proposals",
        description: "Research proposals and grants",
        parentId: createdItems["Research"].id,
        order: 3,
      },
      {
        label: "Repository",
        href: "/research/repository",
        description: "Code and resources repository",
        parentId: createdItems["Research"].id,
        order: 4,
      },
    ];

    for (const item of researchSubItems) {
      await prisma.navigationMenu.create({
        data: item as any,
      });
    }

    // Create sub-menu items for Teaching
    const teachingSubItems = [
      {
        label: "Courses",
        href: "/teaching",
        description: "Current and past courses taught",
        parentId: createdItems["Teaching"].id,
        order: 0,
      },
      {
        label: "Students",
        href: "/students",
        description: "Current and former students",
        parentId: createdItems["Teaching"].id,
        order: 1,
      },
      {
        label: "Student Portal",
        href: "/student-portal",
        description: "Portal for enrolled students",
        parentId: createdItems["Teaching"].id,
        order: 2,
        badge: "Students",
        badgeColor: "blue",
      },
    ];

    for (const item of teachingSubItems) {
      await prisma.navigationMenu.create({
        data: item as any,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Default navigation initialized successfully",
    });
  } catch (error: any) {
    console.error("Error initializing navigation:", error);
    return NextResponse.json(
      { error: error.message || "Failed to initialize navigation" },
      { status: 500 }
    );
  }
}
