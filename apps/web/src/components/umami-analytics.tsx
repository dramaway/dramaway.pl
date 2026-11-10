import Script from "next/script";
import { umamiDataHostUrl, umamiScript } from "@/lib/umami";

/** Site-wide Umami tag. Renders nothing until NEXT_PUBLIC_UMAMI_WEBSITE_ID is set. */
export function UmamiAnalytics() {
  const settings = {
    websiteId: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
    scriptUrl: process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL,
    hostUrl: process.env.NEXT_PUBLIC_UMAMI_HOST_URL,
  };
  const script = umamiScript(settings);
  if (!script) return null;
  const hostUrl = umamiDataHostUrl(settings);

  return (
    <Script
      id="umami-analytics"
      src={script.src}
      strategy="afterInteractive"
      data-website-id={script.websiteId}
      data-domains={script.domains}
      data-do-not-track="true"
      {...(hostUrl ? { "data-host-url": hostUrl } : {})}
    />
  );
}
