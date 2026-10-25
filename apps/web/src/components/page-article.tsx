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
  const quoteBeforeBody = page.sections.at(-1)?.kind === "quote";
  const quoteAfterBody = page.sectionsAfterBody[0]?.kind === "quote";

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
      <Section
        className={
          quoteBeforeBody
            ? "article-section-after-quote"
            : quoteAfterBody
              ? "article-section-before-quote"
              : undefined
        }
      >
        <div className="article-body">
          <PortableBody value={page.body} />
        </div>
      </Section>
      <ContentModules sections={page.sectionsAfterBody} variant="page" />
    </>
  );
}
