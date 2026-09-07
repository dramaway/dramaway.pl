/**
 * Public Sanity connection values for the Next.js app.
 * Dataset `production` is publicly readable — no token required.
 * The web app talks to the API (not the HTTP CDN) so Studio publish
 * can invalidate HTML immediately. Never put SANITY_API_WRITE_TOKEN here.
 */

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";

/** Server-only. Optional; needed only if the dataset is later made private. */
export const readToken = process.env.SANITY_API_READ_TOKEN;

export function assertSanityConfig(): void {
  if (!projectId) {
    throw new Error(
      "Missing NEXT_PUBLIC_SANITY_PROJECT_ID. Copy apps/web/.env.example to apps/web/.env.local.",
    );
  }
}
