import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// User agents of known scraping/spam bots to block
const BANNED_BOTS = [
  "semrushbot",
  "ahrefsbot",
  "dotbot",
  "mj12bot",
  "yandexbot",
  "coccocbot",
  "sogou",
  "exabot",
  "rogue",
  "botland",
  "scraping",
  "headless",
];

export async function middleware(req: NextRequest) {
  const userAgent = (req.headers.get("user-agent") || "").toLowerCase();

  // ── Bot Protection ──
  const isSuspicious = BANNED_BOTS.some((bot) => userAgent.includes(bot));
  if (isSuspicious) {
    return new NextResponse(
      JSON.stringify({ error: "Access denied. Bots are not allowed on Studentforge." }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // ── Optional Upstash REST / Edge Rate Limiter ──
  // If user has UPSTASH_REDIS_REST_URL and token, we can perform HTTP rate limit call
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken && req.nextUrl.pathname.startsWith("/api/")) {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const key = `ratelimit:leaky:${ip}`;
    const now = Date.now() / 1000;
    const capacity = 20;
    const leakRate = 10;

    try {
      // Fetch current level and lastUpdated from Upstash Redis (REST API is safe for Edge runtime)
      const getRes = await fetch(`${upstashUrl}/hmget/${key}/level/lastUpdated`, {
        headers: { Authorization: `Bearer ${upstashToken}` },
      });

      if (getRes.ok) {
        const getJson = await getRes.json();
        const [rawLevel, rawLastUpdated] = getJson.result || [null, null];
        const level = parseFloat(rawLevel || "0");
        const lastUpdated = parseFloat(rawLastUpdated || now.toString());

        // Calculate leaked quantity
        const delta = Math.max(0, (now - lastUpdated) * leakRate);
        const currentLevel = Math.max(0, level - delta);

        if (currentLevel + 1 <= capacity) {
          const nextLevel = currentLevel + 1;
          // Update Upstash Redis
          await fetch(`${upstashUrl}/pipeline`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${upstashToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify([
              ["HMSET", key, "level", nextLevel.toString(), "lastUpdated", now.toString()],
              ["EXPIRE", key, Math.ceil(capacity / leakRate) + 60],
            ]),
          });

          const response = NextResponse.next();
          response.headers.set("X-RateLimit-Limit", capacity.toString());
          response.headers.set("X-RateLimit-Remaining", Math.max(0, capacity - nextLevel).toFixed(0));
          return response;
        } else {
          return new NextResponse(
            JSON.stringify({ error: "Too many requests. Please slow down." }),
            {
              status: 429,
              headers: {
                "Content-Type": "application/json",
                "X-RateLimit-Limit": capacity.toString(),
                "X-RateLimit-Remaining": "0",
              },
            }
          );
        }
      }
    } catch (err) {
      console.warn("Edge rate limiter failed, proceeding: ", err);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
