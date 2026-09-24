import { ContentModules } from "@/components/sections/content-modules";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/layout/section";
import { PortableBody } from "@/components/portable-body";
import type { PageDetail } from "@/lib/sanity/types";

type Crumb = { href: string; label: string };

export function PageArticle({
  page,
  parent,
}: {
  page: PageDetail;
  parent?: Crumb;
}) {
  return (
    <>
      <PageHero
        title={page.title}
        lead={page.heroLead}
        ctaLabel={page.heroCtaLabel}
        ctaHref={page.heroCtaHref}
        image={page.cover}
        parent={parent}
      />
      <ContentModules sections={page.sections} variant="page" />
      <Section>
        <div className="measure">
          <PortableBody value={page.body} />
        </div>
      </Section>
    </>
  );
}
