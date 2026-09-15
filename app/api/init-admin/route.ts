import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Pool } from "pg";

const databaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
const pool = new Pool({ 
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false
  }
});

// Allow GET for browser access
export async function GET() {
  return initializeAdmin();
}

export async function POST() {
  return initializeAdmin();
}

async function initializeAdmin() {
  try {
    // Check if admin already exists
    const checkResult = await pool.query(
      'SELECT id, username FROM "AdminUser" WHERE username = $1',
      ['Mbita']
    );

    if (checkResult.rows.length > 0) {
      return NextResponse.json({
        status: "exists",
        message: "Admin user 'Mbita' already exists",
        admin: checkResult.rows[0]
      }, { status: 200 });
    }

    // Create admin user
    const passwordHash = await bcrypt.hash('Mbita@2026', 10);
    
    const createResult = await pool.query(
      `INSERT INTO "AdminUser" (id, username, "passwordHash", "failedAttempts", "totpEnabled", "createdAt", "updatedAt")
       VALUES (1, $1, $2, 0, false, NOW(), NOW())
       ON CONFLICT (id) DO UPDATE 
       SET username = EXCLUDED.username, "passwordHash" = EXCLUDED."passwordHash", "updatedAt" = NOW()
       RETURNING id, username, "createdAt"`,
      ['Mbita', passwordHash]
    );

    const admin = createResult.rows[0];

    return NextResponse.json({
      status: "created",
      message: "Admin user created successfully",
      admin: {
        id: admin.id,
        username: admin.username,
        createdAt: admin.createdAt
      },
      credentials: {
        username: "Mbita",
        password: "Mbita@2026"
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({
      status: "error",
      message: "Failed to create admin user",
      error: error.message,
      code: error.code
    }, { status: 500 });
  }
}
