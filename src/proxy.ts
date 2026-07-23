import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { applySecurityHeaders } from "@/lib/security/headers";
import { checkRateLimit } from "@/lib/security/rateLimiter";

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

  // 3. Local Rate Limiter for Authentication & Sensitive API Endpoints
  if (pathname.startsWith("/api/auth/") || pathname.startsWith("/api/admin/") || pathname.startsWith("/api/sfadmin/")) {
    const rateCheck = checkRateLimit(req, 25, 60 * 1000);
    if (!rateCheck.allowed) {
      return applySecurityHeaders(
        new NextResponse(
          JSON.stringify({
            error: "Too Many Requests",
            message: "Request rate limit exceeded. Please wait a minute and try again.",
          }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "Retry-After": Math.ceil(rateCheck.resetMs / 1000).toString(),
            },
          }
        )
      );
    }
  }

  // 4. Session Cookie Route Protection & Authorization Verification
  const sessionCookie = req.cookies.get("session")?.value;

  // Protect Admin Portal
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login") && !pathname.startsWith("/admin/forgot")) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // Protect SF Admin Portal
  if (pathname.startsWith("/sfadmin/dashboard")) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/sfadmin", req.url));
    }
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
