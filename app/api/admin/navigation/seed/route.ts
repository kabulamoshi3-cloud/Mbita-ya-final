import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    // Clear existing menu items
    await prisma.navigationMenu.deleteMany({});

    // Define the default navigation structure
    const defaultMenu = [
      // Home - standalone
      {
        label: "Home",
        href: "/",
        icon: "🏠",
        description: null,
        order: 0,
        isVisible: true,
        openInNewTab: false,
        requiresAuth: false,
        badge: null,
        badgeColor: null,
        isMegaMenu: false,
        columns: 1,
      },
      // About - standalone
      {
        label: "About",
        href: "/about",
        icon: "👤",
        description: null,
        order: 1,
        isVisible: true,
        openInNewTab: false,
        requiresAuth: false,
        badge: null,
        badgeColor: null,
        isMegaMenu: false,
        columns: 1,
      },
    ];

    // Academic group with children
    const academicItems = [
      { label: "Research & Projects", href: "/research", icon: "🔬", desc: "Current and past research", order: 0 },
      { label: "Publications", href: "/publications", icon: "📄", desc: "Papers, books & articles", order: 1 },
      { label: "Research Repository", href: "/research/repository", icon: "📚", desc: "Browse research archive", order: 2 },
      { label: "Datasets", href: "/research/datasets", icon: "💾", desc: "Open research data", order: 3 },
      { label: "Presentations", href: "/research/presentations", icon: "🎤", desc: "Conference talks & slides", order: 4 },
      { label: "CV & Achievements", href: "/cv", icon: "🏆", desc: "Awards, grants & honours", order: 5 },
      { label: "Collaborations", href: "/collaborations", icon: "🤝", desc: "Partners & resources", order: 6 },
    ];

    // Teaching group
    const teachingItems = [
      { label: "Teaching & Courses", href: "/teaching", icon: "🎓", desc: "Active & archived courses", order: 0 },
      { label: "Students & Supervision", href: "/students", icon: "👩‍🎓", desc: "Current students & alumni", order: 1 },
      { label: "Student Portal", href: "/student-portal", icon: "🎒", desc: "Login & registration", order: 2 },
      { label: "Certificates", href: "/certificates", icon: "🏅", desc: "Digital certificates", order: 3 },
    ];

    // Resources group
    const resourcesItems = [
      { label: "Resources Library", href: "/resources", icon: "📦", desc: "Academic resources & tools", order: 0 },
      { label: "Video Library", href: "/video-library", icon: "🎥", desc: "Educational videos", order: 1 },
      { label: "Virtual Lab", href: "/virtual-lab", icon: "🧪", desc: "Online experiments", order: 2 },
      { label: "AI Assistant", href: "/ai-assistant", icon: "🤖", desc: "Get instant help", order: 3 },
    ];

    // Community group
    const communityItems = [
      { label: "Community Hub", href: "/community", icon: "👥", desc: "Discussions & testimonials", order: 0 },
      { label: "Alumni Network", href: "/alumni", icon: "🎓", desc: "Connect with alumni", order: 1 },
      { label: "Newsletter", href: "/newsletter", icon: "📧", desc: "Subscribe to updates", order: 2 },
    ];

    // Media group
    const mediaItems = [
      { label: "Blog", href: "/blog", icon: "✍️", desc: "Latest posts", order: 0 },
      { label: "Events", href: "/events", icon: "📅", desc: "Upcoming & past events", order: 1 },
      { label: "Gallery", href: "/gallery", icon: "🖼️", desc: "Photos & media", order: 2 },
    ];

    // More group
    const moreItems = [
      { label: "More Features", href: "/more", icon: "✨", desc: "Explore all features", order: 0 },
      { label: "Analytics", href: "/analytics", icon: "📊", desc: "Research impact metrics", order: 1 },
      { label: "Accessibility", href: "/accessibility", icon: "♿", desc: "Accessibility tools", order: 2 },
    ];

    // Contact - standalone
    defaultMenu.push({
      label: "Contact",
      href: "/contact",
      icon: "📞",
      description: null,
      order: 10,
      isVisible: true,
      openInNewTab: false,
      requiresAuth: false,
      badge: null,
      badgeColor: null,
      isMegaMenu: false,
      columns: 1,
    });

    // Create all menu items
    const createdItems = await Promise.all(
      defaultMenu.map((item) =>
        prisma.navigationMenu.create({
          data: {
            ...item,
            parentId: null,
          },
        })
      )
    );

    // Helper function to create children
    async function createChildren(
      parentId: string,
      items: Array<{ label: string; href: string; icon: string; desc: string; order: number }>
    ) {
      return Promise.all(
        items.map((item) =>
          prisma.navigationMenu.create({
            data: {
              label: item.label,
              href: item.href,
              icon: item.icon,
              description: item.desc,
              order: item.order,
              parentId,
              isVisible: true,
              openInNewTab: false,
              requiresAuth: false,
              badge: null,
              badgeColor: null,
              isMegaMenu: false,
              columns: 1,
            },
          })
        )
      );
    }

    // Create Academic parent and children
    const academicParent = await prisma.navigationMenu.create({
      data: {
        label: "Academic",
        href: null,
        icon: "🎓",
        description: null,
        order: 2,
        parentId: null,
        isVisible: true,
        openInNewTab: false,
        requiresAuth: false,
        badge: null,
        badgeColor: null,
        isMegaMenu: false,
        columns: 1,
      },
    });
    await createChildren(academicParent.id, academicItems);

    // Create Teaching parent and children
    const teachingParent = await prisma.navigationMenu.create({
      data: {
        label: "Teaching",
        href: null,
        icon: "📚",
        description: null,
        order: 3,
        parentId: null,
        isVisible: true,
        openInNewTab: false,
        requiresAuth: false,
        badge: null,
        badgeColor: null,
        isMegaMenu: false,
        columns: 1,
      },
    });
    await createChildren(teachingParent.id, teachingItems);

    // Create Resources parent and children
    const resourcesParent = await prisma.navigationMenu.create({
      data: {
        label: "Resources",
        href: null,
        icon: "🛠️",
        description: null,
        order: 4,
        parentId: null,
        isVisible: true,
        openInNewTab: false,
        requiresAuth: false,
        badge: null,
        badgeColor: null,
        isMegaMenu: false,
        columns: 1,
      },
    });
    await createChildren(resourcesParent.id, resourcesItems);

    // Create Community parent and children
    const communityParent = await prisma.navigationMenu.create({
      data: {
        label: "Community",
        href: null,
        icon: "👥",
        description: null,
        order: 5,
        parentId: null,
        isVisible: true,
        openInNewTab: false,
        requiresAuth: false,
        badge: null,
        badgeColor: null,
        isMegaMenu: false,
        columns: 1,
      },
    });
    await createChildren(communityParent.id, communityItems);

    // Create Media parent and children
    const mediaParent = await prisma.navigationMenu.create({
      data: {
        label: "Media",
        href: null,
        icon: "📸",
        description: null,
        order: 6,
        parentId: null,
        isVisible: true,
        openInNewTab: false,
        requiresAuth: false,
        badge: null,
        badgeColor: null,
        isMegaMenu: false,
        columns: 1,
      },
    });
    await createChildren(mediaParent.id, mediaItems);

    // Create More parent and children
    const moreParent = await prisma.navigationMenu.create({
      data: {
        label: "More",
        href: null,
        icon: "⚙️",
        description: null,
        order: 7,
        parentId: null,
        isVisible: true,
        openInNewTab: false,
        requiresAuth: false,
        badge: null,
        badgeColor: null,
        isMegaMenu: false,
        columns: 1,
      },
    });
    await createChildren(moreParent.id, moreItems);

    return NextResponse.json({
      success: true,
      message: "Navigation menu seeded successfully!",
    });
  } catch (error) {
    console.error("Error seeding navigation:", error);
    return NextResponse.json(
      { error: "Failed to seed navigation menu", details: error },
      { status: 500 }
    );
  }
}
