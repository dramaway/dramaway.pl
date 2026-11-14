import { LegacyNotFound } from "@/components/legacy-not-found";
import { SiteFrame } from "@/components/site-frame";
import { notFoundMetadata } from "@/lib/not-found-metadata";
import { getResolvedSite } from "@/lib/site";

export const metadata = notFoundMetadata;

export default async function NotFound() {
  const site = await getResolvedSite();
  return (
    <SiteFrame site={site}>
      <LegacyNotFound />
    </SiteFrame>
  );
}
