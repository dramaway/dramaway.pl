import type { NextConfig } from "next";
import path from "path";
import { contentSecurityPolicy } from "./src/lib/content-security-policy";

/**
 * CSP limits what the *page* may load (scripts, images, iframes).
 * It does not restrict CMS <a href> — those may point at any http(s) host.
 *
 * Own + vendor origins we embed or fetch:
 * Sanity CDN, Netlify, dramaway.pl (legacy files / centrum), YouTube nocookie.
 * Umami, when NEXT_PUBLIC_UMAMI_WEBSITE_ID is set, adds one host taken from
 * NEXT_PUBLIC_UMAMI_SCRIPT_URL to script-src and connect-src.
 */
const ContentSecurityPolicy = contentSecurityPolicy({
  nodeEnv: process.env.NODE_ENV,
  websiteId: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
  scriptUrl: process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL,
});

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
