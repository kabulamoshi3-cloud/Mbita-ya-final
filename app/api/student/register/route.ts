import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Student model doesn't have email/password fields
    // Registration needs to be implemented with StudentUser model or similar
    return NextResponse.json({
      error: "Student registration not implemented",
      message: "Student model lacks authentication fields. Contact admin for account creation.",
    }, { status: 501 });
  } catch (error) {
    console.error("Student registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
