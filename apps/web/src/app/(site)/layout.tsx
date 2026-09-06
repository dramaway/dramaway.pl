import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PaletteRow } from "@/components/visual/palette-row";
import { getResolvedSite } from "@/lib/site";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const site = await getResolvedSite();

  return (
    <div className="site-shell flex min-h-screen flex-col">
      <SiteHeader title={site.title} />
      <main className="flex-1">{children}</main>
      <div className="subpage-palette page py-section" aria-hidden>
        <PaletteRow />
      </div>
      <SiteFooter
        title={site.title}
        logo={site.footer.logo}
        logoAlt={site.footer.logoAlt}
        address={site.footer.address}
        quote={site.footer.quote}
        attribution={site.footer.attribution}
      />
    </div>
  );
}
