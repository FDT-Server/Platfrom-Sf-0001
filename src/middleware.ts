import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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
  "go-http-client",
  "masscan",
  "nikto",
  "sqlmap",
  "nessus",
  "zgrab",
  "libwww-perl",
];

const ADMIN_EMAILS_SFADMIN = ["hrstudentforge@gmail.com"];
const ADMIN_EMAILS_ADMIN = ["webstrixx@gmail.com"];
const ALL_ADMIN_EMAILS = [...ADMIN_EMAILS_SFADMIN, ...ADMIN_EMAILS_ADMIN];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const response = NextResponse.next();

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  );
  response.headers.set("X-Robots-Tag", "index, follow");

  const userAgent = (req.headers.get("user-agent") || "").toLowerCase();
  const isBot = BANNED_BOT_PATTERNS.some((pattern) =>
    userAgent.includes(pattern)
  );

  if (isBot) {
    return new NextResponse(
      JSON.stringify({
        error: "Access denied.",
        message:
          "Automated access to Studentforge Platform is not permitted.",
      }),
      {
        status: 403,
        headers: {
          "Content-Type": "application/json",
          "X-Content-Type-Options": "nosniff",
        },
      }
    );
  }

  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken && pathname.startsWith("/api/")) {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    const key = `ratelimit:leaky:${ip}`;
    const now = Date.now() / 1000;
    const capacity = 30;
    const leakRate = 10;

    try {
      const getRes = await fetch(
        `${upstashUrl}/hmget/${key}/level/lastUpdated`,
        {
          headers: { Authorization: `Bearer ${upstashToken}` },
          signal: AbortSignal.timeout(2000),
        }
      );

      if (getRes.ok) {
        const getJson = await getRes.json();
        const [rawLevel, rawLastUpdated] = getJson.result || [null, null];
        const level = parseFloat(rawLevel || "0");
        const lastUpdated = parseFloat(rawLastUpdated || now.toString());
        const delta = Math.max(0, (now - lastUpdated) * leakRate);
        const currentLevel = Math.max(0, level - delta);

        if (currentLevel + 1 <= capacity) {
          const nextLevel = currentLevel + 1;
          await fetch(`${upstashUrl}/pipeline`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${upstashToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify([
              [
                "HMSET",
                key,
                "level",
                nextLevel.toString(),
                "lastUpdated",
                now.toString(),
              ],
              ["EXPIRE", key, Math.ceil(capacity / leakRate) + 60],
            ]),
            signal: AbortSignal.timeout(2000),
          });

          response.headers.set("X-RateLimit-Limit", capacity.toString());
          response.headers.set(
            "X-RateLimit-Remaining",
            Math.max(0, capacity - nextLevel).toFixed(0)
          );
          return response;
        } else {
          return new NextResponse(
            JSON.stringify({
              error: "Too Many Requests",
              message:
                "You have exceeded the request rate limit. Please wait and try again.",
            }),
            {
              status: 429,
              headers: {
                "Content-Type": "application/json",
                "X-RateLimit-Limit": capacity.toString(),
                "X-RateLimit-Remaining": "0",
                "Retry-After": "10",
              },
            }
          );
        }
      }
    } catch {
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
