import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/layout/section";
import { PortableBody } from "@/components/portable-body";
import { resolveHeroSlides } from "@/lib/hero-slides";
import { newsCta } from "@/lib/news-cta";
import type { NewsDetail } from "@/lib/sanity/types";

export function NewsArticle({ news }: { news: NewsDetail }) {
  const cta = newsCta(news);
  return (
    <div className="page-hero-spacing">
      <PageHero
        title={news.title}
        titleLanguage={news.titleLanguage}
        textAlign={news.heroTextAlign}
        slides={resolveHeroSlides(news.heroImages, news.title)}
        ctaLabel={cta.ctaHref ? cta.label : null}
        ctaHref={cta.ctaHref}
        showBand={false}
      />
      <Section>
        <div className="article-body">
          <PortableBody value={news.body} />
        </div>
      </Section>
    </div>
  );
}
