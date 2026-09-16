import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch public navigation (visible items only)
export async function GET() {
  try {
    const menuItems = await prisma.navigationMenu.findMany({
      where: { isVisible: true },
      orderBy: [{ order: "asc" }, { label: "asc" }],
      select: {
        id: true,
        label: true,
        href: true,
        icon: true,
        description: true,
        order: true,
        parentId: true,
        openInNewTab: true,
        badge: true,
        badgeColor: true,
        isMegaMenu: true,
        columns: true,
      },
    });

    // Build hierarchical structure
    const topLevelItems = menuItems.filter((item) => item.parentId === null);
    const navigation = topLevelItems.map((item) => ({
      ...item,
      children: menuItems.filter((child) => child.parentId === item.id),
    }));

    return NextResponse.json({ navigation });
  } catch (error: any) {
    console.error("Error fetching navigation:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch navigation" },
      { status: 500 }
    );
  }
}
