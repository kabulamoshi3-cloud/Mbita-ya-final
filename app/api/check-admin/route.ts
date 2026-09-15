import { NextResponse } from "next/server";
import { Pool } from "pg";

const databaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
const pool = new Pool({ 
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function GET() {
  try {
    // Check if admin user exists
    const result = await pool.query(
      'SELECT id, username, "createdAt", "totpEnabled" FROM "AdminUser" WHERE username = $1',
      ['Mbita']
    );

    if (result.rows.length === 0) {
      return NextResponse.json({
        status: "no_admin",
        message: "Admin user 'Mbita' does not exist",
        recommendation: "Run init-database.mjs or use auto-creation by logging in with default credentials"
      }, { status: 404 });
    }

    const admin = result.rows[0];
    
    return NextResponse.json({
      status: "ok",
      message: "Admin user exists",
      admin: {
        id: admin.id,
        username: admin.username,
        createdAt: admin.createdAt,
        totpEnabled: admin.totpEnabled
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({
      status: "error",
      message: "Database connection failed",
      error: error.message
    }, { status: 500 });
  }
}
