import type { MetadataRoute } from "next";
import { siteIndexingEnabled, siteOrigin } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const origin = siteOrigin();
  if (!siteIndexingEnabled()) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${origin}/sitemap.xml`,
  };
}
