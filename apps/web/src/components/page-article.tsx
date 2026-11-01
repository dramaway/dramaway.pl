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
}: {
  page: PageDetail;
  parent?: Crumb;
}) {
  const textOnlyHero = /^(sprawozdania|statut)(?:-|$)/i.test(page.slug);
  const content = (
    <>
      <PageHero
        title={page.title}
        lead={page.heroLead}
        ctaLabel={page.heroCtaLabel}
        ctaHref={page.heroCtaHref}
        slides={resolveHeroSlides(page.heroImages, page.title)}
        parent={parent}
        layout={textOnlyHero ? "stack" : "split"}
      />
      <ContentModules sections={page.sections} variant="page" />
      <Section>
        <div className="article-body">
          <PortableBody value={page.body} />
        </div>
      </Section>
      <ContentModules sections={page.sectionsAfterBody} variant="page" />
    </>
  );

  return textOnlyHero ? (
    <div className="page-article-text-only">{content}</div>
  ) : (
    content
  );
}
