import Script from "next/script";
import { umamiScript } from "@/lib/umami";

/** Site-wide Umami tag. Renders nothing until NEXT_PUBLIC_UMAMI_WEBSITE_ID is set. */
export function UmamiAnalytics() {
  const script = umamiScript({
    websiteId: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
    scriptUrl: process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL,
  });
  if (!script) return null;

  return (
    <Script
      id="umami-analytics"
      src={script.src}
      strategy="afterInteractive"
      data-website-id={script.websiteId}
      data-domains={script.domains}
      data-do-not-track="true"
      data-host-url={script.hostUrl}
    />
  );
}
