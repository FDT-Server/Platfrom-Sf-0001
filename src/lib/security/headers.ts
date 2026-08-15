import { NextResponse } from "next/server";

export function applySecurityHeaders(response: NextResponse): NextResponse {
  // Prevent MIME sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Prevent Clickjacking framing attacks
  response.headers.set("X-Frame-Options", "DENY");

  // Enable Browser Cross-Site Scripting (XSS) Filter
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Control Referrer Information
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // HTTP Strict Transport Security (HSTS) - 2 Years duration
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );

  // Restrict Browser Features & Hardware Permissions
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=*, usb=(), display-capture=()"
  );

  // Content Security Policy (CSP)
  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://ik.imagekit.io https://lottie.host https://cdn.jsdelivr.net https://accounts.google.com https://checkout.razorpay.com https://cdn.razorpay.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com",
    "img-src 'self' data: blob: https: http:",
    "font-src 'self' https://fonts.gstatic.com data:",
    "connect-src 'self' https: wss: http:",
    "frame-src 'self' https://lottie.host https://accounts.google.com https://api.razorpay.com https://checkout.razorpay.com",
    "media-src 'self' https: data:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://accounts.google.com https://api.razorpay.com",
  ].join("; ");

  response.headers.set("Content-Security-Policy", cspHeader);

  return response;
}
