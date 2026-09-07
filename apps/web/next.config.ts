import type { NextConfig } from "next";
import path from "path";

/**
 * CSP limits what the *page* may load (scripts, images, iframes).
 * It does not restrict CMS <a href> — those may point at any http(s) host.
 *
 * Own + vendor origins we embed or fetch:
 * Sanity CDN, Netlify, dramaway.pl (legacy files / centrum), YouTube nocookie.
 * Adding analytics later means extending script-src / connect-src.
 */
const ContentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io https://*.sanity.io https://i.ytimg.com https://*.ytimg.com https://*.netlify.app https://*.dramaway.pl https://*.fundacja.dramaway.pl https://dramaway.pl https://fundacja.dramaway.pl https://www.fundacja.dramaway.pl https://centrum.dramaway.pl",
  "media-src 'self' blob: https://cdn.sanity.io https://*.sanity.io https://*.dramaway.pl https://dramaway.pl https://fundacja.dramaway.pl https://www.fundacja.dramaway.pl",
  "font-src 'self'",
  "connect-src 'self' ws: wss: https://cdn.sanity.io https://*.sanity.io https://*.netlify.app https://*.dramaway.pl https://dramaway.pl https://fundacja.dramaway.pl https://centrum.dramaway.pl",
  "frame-src https://www.youtube-nocookie.com",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
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

const indexing = process.env.NEXT_PUBLIC_SITE_INDEX === "true";

const securityHeaders = [
  {
    key: "X-Robots-Tag",
    value: indexing ? "index, follow" : "noindex, nofollow",
  },
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
