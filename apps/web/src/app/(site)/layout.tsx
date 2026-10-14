import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { DotBand } from "@/components/visual/dot-band";
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
      <SiteHeader title={site.title} items={site.nav} />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </main>
      <DotBand className="footer-dots" />
      <SiteFooter
        title={site.title}
        logo={site.footer.logo}
        logoAlt={site.footer.logoAlt}
        address={site.footer.address}
        newsletterEnabled={site.footer.newsletterEnabled}
      />
    </div>
  );
}
