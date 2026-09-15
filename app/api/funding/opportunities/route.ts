import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const status = searchParams.get("status") || "open";

    const where: any = { status };

    if (category) where.focus = category; // category maps to focus field
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { organization: { contains: search, mode: "insensitive" } },
        { eligibility: { contains: search, mode: "insensitive" } },
      ];
    }

    const opportunities = await prisma.fundingOpportunity.findMany({
      where,
      select: {
        id: true,
        title: true,
        organization: true,
        amount: true,
        deadline: true,
        status: true,
        eligibility: true,
        focus: true,
        url: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { deadline: "asc" },
    });

    // Add application count as 0 since FundingApplication model doesn't exist
    const opportunitiesWithCount = opportunities.map(opp => ({
      ...opp,
      _count: { applications: 0 },
    }));

    return NextResponse.json({ opportunities: opportunitiesWithCount });

    return NextResponse.json({ opportunities });
  } catch (error) {
    console.error("Funding opportunities error:", error);
    return NextResponse.json({ error: "Failed to load opportunities" }, { status: 500 });
  }
}
