import type { Metadata } from "next";
import { HomeAboutMethods } from "@/components/sections/home-about-methods";
import { HomeFeaturedAndReading } from "@/components/sections/home-featured-and-reading";
import { HomeNews } from "@/components/sections/home-news";
import { Hero } from "@/components/sections/hero";
import { DotBand } from "@/components/visual/dot-band";
import { PaletteRow } from "@/components/visual/palette-row";
import { publicPathForPageSlug } from "@/lib/routes";
import { getHomepageNews, getProjects } from "@/lib/sanity/fetch";
import { getResolvedSite } from "@/lib/site";

export const revalidate = 60;

function newsTitle(title: string) {
  return title.replace(/^\[Aktualność\]\s*/i, "").trim();
}

export async function generateMetadata(): Promise<Metadata> {
  const site = await getResolvedSite();
  return {
    title: site.title,
    description: site.tagline ?? undefined,
  };
}

export default async function HomePage() {
  const [projects, news] = await Promise.all([
    getProjects(),
    getHomepageNews(),
  ]);
  const featured = projects.find((project) => project.featured) ?? projects[0];
  const site = await getResolvedSite(featured?.cover);
  const { homepage } = site;

  const newsItems = news.map((item) => ({
    _id: item._id,
    title: newsTitle(item.title),
    href: publicPathForPageSlug(item.slug),
    excerpt: item.excerpt?.trim() || null,
    publishedAt: item.publishedAt?.trim() || null,
  }));

  return (
    <>
      <Hero hero={site.hero} />

      <DotBand />

      <HomeNews items={newsItems} />

      <DotBand />

      <HomeAboutMethods
        about={homepage.about}
        methods={homepage.methods}
        image={homepage.about.image}
        imageAlt={homepage.about.imageAlt}
      />

      <DotBand />

      <div className="page py-section">
        <PaletteRow className="justify-center" />
      </div>

      <HomeFeaturedAndReading
        featured={{
          label: homepage.featured.heading,
          heading: featured?.title?.trim() || "Art Generacje",
          lead: homepage.featured.lead,
          ctaLabel: homepage.featured.ctaLabel,
          ctaHref: homepage.featured.ctaHref,
        }}
        czytelnia={homepage.czytelnia}
      />

      <div className="page pb-section">
        <PaletteRow className="justify-center" />
      </div>
    </>
  );
}
