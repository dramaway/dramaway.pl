import { SiteFrame } from "@/components/site-frame";
import { getResolvedSite } from "@/lib/site";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const site = await getResolvedSite();
  return <SiteFrame site={site}>{children}</SiteFrame>;
}
