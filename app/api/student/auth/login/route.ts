import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { Pool } from "pg";
import { sessionOptions, SessionData } from "@/lib/session";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const databaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
const pool = new Pool({ 
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body.", code: "INVALID_JSON" }, { status: 400 });
  }

  const result = loginSchema.safeParse(body);
  if (!result.success) {
    const fields: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as string;
      if (field) fields[field] = issue.message;
    }
    return NextResponse.json({ error: "Validation failed.", code: "VALIDATION_ERROR", fields }, { status: 400 });
  }

  const { email, password } = result.data;

  let studentUser: any;
  try {
    // Find student user
    const userResult = await pool.query(
      'SELECT * FROM "StudentUser" WHERE email = $1 AND active = true LIMIT 1',
      [email.toLowerCase()]
    );
    studentUser = userResult.rows[0];
    
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ 
      error: "Database connection error.", 
      code: "DB_ERROR",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }

  if (!studentUser) {
    return NextResponse.json({ error: "Invalid credentials.", code: "INVALID_CREDENTIALS" }, { status: 401 });
  }

  // Compare password
  const passwordMatch = await bcrypt.compare(password, studentUser.passwordHash);

  if (!passwordMatch) {
    return NextResponse.json({ error: "Invalid credentials.", code: "INVALID_CREDENTIALS" }, { status: 401 });
  }

  // Update last login
  try {
    await pool.query(
      'UPDATE "StudentUser" SET "lastLogin" = NOW(), "updatedAt" = NOW() WHERE id = $1',
      [studentUser.id]
    );
  } catch { /* non-fatal */ }

  // Create session
  const response = NextResponse.json({ 
    message: "Login successful.",
    user: {
      id: studentUser.id,
      email: studentUser.email,
      firstName: studentUser.firstName,
      lastName: studentUser.lastName,
      studentId: studentUser.studentId,
    }
  }, { status: 200 });
  
  const session = await getIronSession<SessionData>(request, response, sessionOptions);
  session.studentId = studentUser.id;
  session.role = "student";
  session.createdAt = Date.now();
  await session.save();

  return response;
}
