import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { Pool } from "pg";
import { sessionOptions, SessionData } from "@/lib/session";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  studentId: z.string().min(1, "Student ID is required"),
  enrollmentYear: z.number().int().min(2000).max(2050),
  program: z.string().optional(),
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

  const result = registerSchema.safeParse(body);
  if (!result.success) {
    const fields: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as string;
      if (field) fields[field] = issue.message;
    }
    return NextResponse.json({ error: "Validation failed.", code: "VALIDATION_ERROR", fields }, { status: 400 });
  }

  const { email, password, firstName, lastName, studentId, enrollmentYear, program } = result.data;

  try {
    // Check if email already exists
    const emailCheck = await pool.query(
      'SELECT id FROM "StudentUser" WHERE email = $1',
      [email.toLowerCase()]
    );
    
    if (emailCheck.rows.length > 0) {
      return NextResponse.json({ 
        error: "Email already registered.", 
        code: "EMAIL_EXISTS",
        fields: { email: "This email is already registered" }
      }, { status: 400 });
    }

    // Check if student ID already exists
    const studentIdCheck = await pool.query(
      'SELECT id FROM "StudentUser" WHERE "studentId" = $1',
      [studentId]
    );
    
    if (studentIdCheck.rows.length > 0) {
      return NextResponse.json({ 
        error: "Student ID already registered.", 
        code: "STUDENT_ID_EXISTS",
        fields: { studentId: "This student ID is already registered" }
      }, { status: 400 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create student user
    const createResult = await pool.query(
      `INSERT INTO "StudentUser" 
       (id, email, "passwordHash", "firstName", "lastName", "studentId", "enrollmentYear", program, active, "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, true, NOW(), NOW())
       RETURNING id, email, "firstName", "lastName", "studentId"`,
      [email.toLowerCase(), passwordHash, firstName, lastName, studentId, enrollmentYear, program || null]
    );

    const newUser = createResult.rows[0];

    // Create session (auto-login after registration)
    const response = NextResponse.json({ 
      message: "Registration successful.",
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        studentId: newUser.studentId,
      }
    }, { status: 201 });
    
    const session = await getIronSession<SessionData>(request, response, sessionOptions);
    session.studentId = newUser.id;
    session.role = "student";
    session.createdAt = Date.now();
    await session.save();

    return response;
    
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ 
      error: "Registration failed. Please try again.", 
      code: "DB_ERROR",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
