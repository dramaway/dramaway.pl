import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/layout/section";
import { PortableBody } from "@/components/portable-body";
import { newsCta } from "@/lib/news-cta";
import type { NewsDetail } from "@/lib/sanity/types";

export function NewsArticle({ news }: { news: NewsDetail }) {
  const cta = newsCta(news);
  return (
    <>
      <PageHero
        title={news.title}
        ctaLabel={cta.ctaHref ? cta.label : null}
        ctaHref={cta.ctaHref}
      />
      <Section>
        <div className="article-body">
          <PortableBody value={news.body} />
        </div>
      </Section>
    </>
  );
}
