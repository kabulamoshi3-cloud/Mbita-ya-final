import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

// GET - Fetch all navigation items
export async function GET() {
  try {
    const session = await getSession();
    if (!session?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const menuItems = await prisma.navigationMenu.findMany({
      orderBy: [{ order: "asc" }, { label: "asc" }],
    });

    return NextResponse.json({ menuItems });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch navigation" },
      { status: 500 }
    );
  }
}

// POST - Create new navigation item
export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const menuItem = await prisma.navigationMenu.create({
      data: {
        label: body.label,
        href: body.href || null,
        icon: body.icon || null,
        description: body.description || null,
        order: body.order || 0,
        parentId: body.parentId || null,
        isVisible: body.isVisible ?? true,
        openInNewTab: body.openInNewTab ?? false,
        badge: body.badge || null,
        badgeColor: body.badgeColor || null,
        isMegaMenu: body.isMegaMenu ?? false,
        columns: body.columns || 1,
      },
    });

    return NextResponse.json({ menuItem }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create navigation item" },
      { status: 500 }
    );
  }
}

// PUT - Update navigation item
export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const menuItem = await prisma.navigationMenu.update({
      where: { id: body.id },
      data: {
        label: body.label,
        href: body.href || null,
        icon: body.icon || null,
        description: body.description || null,
        order: body.order || 0,
        parentId: body.parentId || null,
        isVisible: body.isVisible ?? true,
        openInNewTab: body.openInNewTab ?? false,
        badge: body.badge || null,
        badgeColor: body.badgeColor || null,
        isMegaMenu: body.isMegaMenu ?? false,
        columns: body.columns || 1,
      },
    });

    return NextResponse.json({ menuItem });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update navigation item" },
      { status: 500 }
    );
  }
}

// DELETE - Delete navigation item
export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    await prisma.navigationMenu.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete navigation item" },
      { status: 500 }
    );
  }
}
