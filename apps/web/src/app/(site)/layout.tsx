import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PaletteRow } from "@/components/visual/palette-row";
import { getResolvedSite } from "@/lib/site";
import { SUBPAGE } from "@/lib/subpage-copy";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const site = await getResolvedSite();

  return (
    <div className="site-shell flex min-h-screen flex-col">
      <a href="#main-content" className="skip-link">
        {SUBPAGE.a11y.skipToContent}
      </a>
      <SiteHeader title={site.title} />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </main>
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
