import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getResolvedSite } from "@/lib/site";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const site = await getResolvedSite();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader title={site.title} centrumUrl={site.centrumUrl} />
      <main className="flex-1">{children}</main>
      <SiteFooter title={site.title} note={site.footerNote} />
    </div>
  );
}
