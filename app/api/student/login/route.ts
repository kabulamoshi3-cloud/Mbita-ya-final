import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Student model doesn't have email/password fields
    // Use admin login at /api/auth/login instead
    return NextResponse.json({
      error: "Student login not implemented",
      message: "Student model lacks authentication fields. Use admin login or implement StudentUser model.",
    }, { status: 501 });
  } catch (error) {
    console.error("Student login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
