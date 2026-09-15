import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { prisma } from "@/lib/prisma";
import { sessionOptions, SessionData } from "@/lib/session";
import { z } from "zod";

const applySchema = z.object({
  opportunityId: z.string(),
  proposalTitle: z.string().min(1, "Proposal title is required"),
  proposalDescription: z.string().min(50, "Description must be at least 50 characters"),
  budgetAmount: z.number().positive("Budget must be positive"),
  documentUrl: z.string().url("Invalid document URL"),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(request, NextResponse.next(), sessionOptions);
    if (!session.studentId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // FundingApplication model doesn't exist in schema
    // Return not implemented error
    return NextResponse.json({
      error: "Funding application submission not yet implemented",
      message: "This feature requires the FundingApplication model to be added to the database schema",
    }, { status: 501 });
  } catch (error) {
    console.error("Funding application error:", error);
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
  }
}
