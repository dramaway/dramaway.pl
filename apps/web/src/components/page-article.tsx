import { ContentModules } from "@/components/sections/content-modules";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/layout/section";
import { PortableBody } from "@/components/portable-body";
import { resolveHeroSlides } from "@/lib/hero-slides";
import type { PageDetail } from "@/lib/sanity/types";

type Crumb = { href: string; label: string };

export function PageArticle({
  page,
  parent,
  className,
}: {
  page: PageDetail;
  parent?: Crumb;
  /** Extra class on the text section, e.g. to tighten the gap before what follows. */
  className?: string;
}) {
  return (
    <>
      <PageHero
        title={page.title}
        lead={page.heroLead}
        ctaLabel={page.heroCtaLabel}
        ctaHref={page.heroCtaHref}
        slides={resolveHeroSlides(page.heroImages, page.title)}
        parent={parent}
      />
      <ContentModules sections={page.sections} variant="page" />
      <Section className={className}>
        <div className="article-body">
          <PortableBody value={page.body} />
        </div>
      </Section>
    </>
  );
}
