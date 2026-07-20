import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://fonts.gstatic.com https://ik.imagekit.io https://unpkg.com https://cdn.jsdelivr.net https://lottie.host",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https://ik.imagekit.io https://images.unsplash.com https://lh3.googleusercontent.com https://lottie.host",
              "font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com",
              "connect-src 'self' https://ik.imagekit.io https://lottie.host https://unpkg.com https://cdn.jsdelivr.net",
              "frame-src 'self' https://lottie.host",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "unsafe-none",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "same-site",
          },
        ],
      },
    ];
  },

  poweredByHeader: false,

  compress: true,

  experimental: {
    optimizePackageImports: ["@tabler/icons-react"],
  },
};

export default nextConfig;
