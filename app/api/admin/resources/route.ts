import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const resources = await prisma.resource.findMany({
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(resources);
  } catch (error) {
    console.error("Error fetching resources:", error);
    return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const resource = await prisma.resource.create({
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

    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    console.error("Error creating resource:", error);
    return NextResponse.json({ error: "Failed to create resource" }, { status: 500 });
  }
}
