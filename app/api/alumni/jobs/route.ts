import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const jobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string(),
  description: z.string(),
  jobType: z.enum(["full_time", "part_time", "contract", "internship"]),
  salary: z.string().optional(),
  applyUrl: z.string().url("Invalid URL"),
});

/**
 * GET /api/alumni/jobs
 * Get all active job postings with optional filtering
 * 
 * Query params:
 * - type: Filter by job type (full-time, part-time, contract, internship)
 * - search: Search in title, company, or location
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobType = searchParams.get("type"); // Changed from jobType to match schema field 'type'
    const search = searchParams.get("search");

    const where: any = { active: true }; // Use 'active' instead of 'status'

    if (jobType) where.type = jobType;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ];
    }

    const jobs = await prisma.jobPosting.findMany({
      where,
      select: {
        id: true,
        postedBy: true,
        title: true,
        company: true,
        location: true,
        type: true,
        description: true,
        requirements: true,
        salary: true,
        applyUrl: true,
        active: true,
        expiresAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" }, // Use 'createdAt' instead of 'postedAt'
    });

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Jobs error:", error);
    return NextResponse.json({ error: "Failed to load jobs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = jobSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", fields: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Note: In production, verify poster is alumni
    const job = await prisma.jobPosting.create({
      data: {
        postedBy: body.postedBy || "system", // Match schema field
        title: result.data.title,
        company: result.data.company,
        location: result.data.location,
        type: result.data.jobType, // Map jobType to 'type' field
        description: result.data.description,
        salary: result.data.salary,
        applyUrl: result.data.applyUrl,
        active: true,
      },
    });

    return NextResponse.json({ message: "Job posted", job }, { status: 201 });
  } catch (error) {
    console.error("Job posting error:", error);
    return NextResponse.json({ error: "Failed to post job" }, { status: 500 });
  }
}
