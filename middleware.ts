import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";

// ── FAST MIDDLEWARE — no database calls ──
// Maintenance mode and hidden sections are handled at the page level
// to avoid slow Edge Runtime database queries on every request.

const SESSION_MAX_AGE_MS = 8 * 60 * 60 * 1000; // 8 hours

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/fonts") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  ) {
    return NextResponse.next();
  }

  // Auth check for admin routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const response = NextResponse.next();
    const session = await getIronSession<SessionData>(request, response, sessionOptions);

    if (!session.username) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (session.createdAt && Date.now() - session.createdAt > SESSION_MAX_AGE_MS) {
      const redirectResponse = NextResponse.redirect(new URL("/login", request.url));
      const clearSession = await getIronSession<SessionData>(request, redirectResponse, sessionOptions);
      clearSession.destroy();
      return redirectResponse;
    }

    return response;
  }

  // Auth check for student portal routes
  if (pathname.startsWith("/student-portal") || 
      (pathname.startsWith("/api/student") && !pathname.startsWith("/api/student/auth"))) {
    const response = NextResponse.next();
    const session = await getIronSession<SessionData>(request, response, sessionOptions);

    if (!session.studentId || session.role !== "student") {
      if (pathname.startsWith("/api/student")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/student-login", request.url));
    }

    if (session.createdAt && Date.now() - session.createdAt > SESSION_MAX_AGE_MS) {
      const redirectResponse = NextResponse.redirect(new URL("/student-login", request.url));
      const clearSession = await getIronSession<SessionData>(request, redirectResponse, sessionOptions);
      clearSession.destroy();
      return redirectResponse;
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/student-portal/:path*",
    "/api/student/:path*",
  ],
};
