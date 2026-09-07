import type { MetadataRoute } from "next";

/**
 * Preview / pre-cutover: disallow crawling.
 * At domain cutover, allow indexing and point sitemap here — see HANDOFF.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  };
}
