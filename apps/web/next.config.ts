import type { NextConfig } from "next";
import path from "path";

/**
 * Preview / pre-cutover headers. Drop X-Robots-Tag noindex at domain launch
 * (see docs/HANDOFF.md cutover checklist). CSP must keep YouTube nocookie
 * frames and Sanity CDN images; fonts are self-hosted via next/font.
 */
const ContentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io https://i.ytimg.com",
  "media-src 'self' blob: https://cdn.sanity.io",
  "font-src 'self'",
  "connect-src 'self' ws: wss: https://cdn.sanity.io https://*.sanity.io",
  "frame-src https://www.youtube-nocookie.com",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  // HTTPS-only hosts. Skip on localhost http so `pnpm dev` is not upgraded away.
  ...(process.env.NODE_ENV === "production" ? ["upgrade-insecure-requests"] : []),
].join("; ");

const PermissionsPolicy = [
  "camera=()",
  "microphone=()",
  "geolocation=()",
  "payment=()",
  "usb=()",
  "interest-cohort=()",
  'accelerometer=(self "https://www.youtube-nocookie.com")',
  'autoplay=(self "https://www.youtube-nocookie.com")',
  'encrypted-media=(self "https://www.youtube-nocookie.com")',
  'fullscreen=(self "https://www.youtube-nocookie.com")',
  'gyroscope=(self "https://www.youtube-nocookie.com")',
  'picture-in-picture=(self "https://www.youtube-nocookie.com")',
].join(", ");

const securityHeaders = [
  { key: "X-Robots-Tag", value: "noindex, nofollow" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: PermissionsPolicy },
  { key: "Content-Security-Policy", value: ContentSecurityPolicy },
];

const nextConfig: NextConfig = {
  turbopack: {
    // Monorepo: lockfile lives at repo root
    root: path.join(__dirname, "../.."),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  async headers() {
    return [
      { source: "/", headers: securityHeaders },
      { source: "/:path*", headers: securityHeaders },
    ];
  },
};

export default nextConfig;
