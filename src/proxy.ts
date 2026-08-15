import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { applySecurityHeaders } from "@/lib/security/headers";

const BANNED_BOT_PATTERNS = [
  "semrushbot",
  "ahrefsbot",
  "dotbot",
  "mj12bot",
  "yandexbot",
  "coccocbot",
  "sogou",
  "exabot",
  "headlesschrome",
  "phantomjs",
  "scrapy",
  "python-requests",
  "masscan",
  "nikto",
  "sqlmap",
  "nessus",
  "zgrab",
  "libwww-perl",
];

const PROTECTED_USER_ROUTES = [
  "/dashboard",
  "/profile",
  "/networking",
  "/studypod",
  "/checkout",
  "/payment",
  "/mzgh",
];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  let response = NextResponse.next();

  // 1. Apply baseline Security Headers
  response = applySecurityHeaders(response);

  // 2. Block Known Malicious Web Scrapers & Automated Attack Bots
  const userAgent = (req.headers.get("user-agent") || "").toLowerCase();
  const isBot = BANNED_BOT_PATTERNS.some((pattern) =>
    userAgent.includes(pattern)
  );

  if (isBot) {
    return applySecurityHeaders(
      new NextResponse(
        JSON.stringify({
          error: "Access denied",
          message: "Automated access to Studentforge Platform is not permitted.",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      )
    );
  }

  // 3. Local Rate Limiter for Authentication & Sensitive API Endpoints (Removed)
  // DELEGATED TO CLOUDFLARE WAF: Rate limiting is now handled globally at the edge
  // via Cloudflare WAF Rules to properly support serverless horizontal scaling without memory leaks.

  // 4. Session Cookie Route Protection & Authorization Verification
  const sessionCookie = req.cookies.get("session")?.value;

  // Protect Admin Portal - Complete Block as requested
  if (pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Protect SF Admin Portal
  if (pathname.startsWith("/sfadmin/dashboard")) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/sfadmin", req.url));
    }
  }

  // Prevent logged-in users from accessing auth pages
  const AUTH_ROUTES = ["/login", "/signup"];
  if (sessionCookie && AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"))) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Protect User Dashboard & App Pages
  if (PROTECTED_USER_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/|public/).*)"],
};
