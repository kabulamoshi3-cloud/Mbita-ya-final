import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const resource = await prisma.resource.update({
      where: { id: params.id },
      data: {
        title: body.title,
        description: body.description,
        url: body.url,
        category: body.category,
        type: body.type || null,
        fileUrl: body.fileUrl || null,
        fileSize: body.fileSize || null,
        thumbnailUrl: body.thumbnailUrl || null,
        tags: body.tags || [],
        featured: body.featured || false,
        published: body.published !== false,
      },
    });

    return NextResponse.json(resource);
  } catch (error) {
    console.error("Error updating resource:", error);
    return NextResponse.json({ error: "Failed to update resource" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.resource.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting resource:", error);
    return NextResponse.json({ error: "Failed to delete resource" }, { status: 500 });
  }
}
