import type { Metadata } from "next";
import { HomeAboutMethods } from "@/components/sections/home-about-methods";
import { HomeFeaturedAndReading } from "@/components/sections/home-featured-and-reading";
import { HomeNews } from "@/components/sections/home-news";
import { Hero } from "@/components/sections/hero";
import { DotBand } from "@/components/visual/dot-band";
import { PaletteRow } from "@/components/visual/palette-row";
import { cmsText } from "@/lib/cms-text";
import {
  publicPathForPageSlug,
  publicPathForProjectSlug,
} from "@/lib/routes";
import { getHomepageNews, getProjects } from "@/lib/sanity/fetch";
import { hasHeroImage } from "@/lib/sanity/image";
import { getResolvedSite, homepageBlockHasContent } from "@/lib/site";

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
  const [projects, news, site] = await Promise.all([
    getProjects(),
    getHomepageNews(),
    getResolvedSite(),
  ]);
  const featured = projects.find((project) => project.featured) ?? projects[0];
  const { homepage } = site;
  const featuredHref = featured?.slug
    ? publicPathForProjectSlug(featured.slug)
    : null;
  const featuredHeading = cmsText(featured?.title);
  const featuredLead =
    homepage.featured.lead || cmsText(featured?.summary);
  const showFeatured = Boolean(
    homepage.featured.heading ||
      featuredHeading ||
      featuredLead ||
      (homepage.featured.ctaLabel && homepage.featured.ctaHref),
  );
  const showCzytelnia = homepageBlockHasContent(homepage.czytelnia);
  const showAboutMethods =
    homepageBlockHasContent(homepage.about) ||
    homepageBlockHasContent(homepage.methods) ||
    hasHeroImage(homepage.about.image);

  const newsItems = news.map((item) => ({
    _id: item._id,
    title: newsTitle(item.title),
    href: publicPathForPageSlug(item.slug),
    excerpt: item.excerpt?.trim() || null,
    publishedAt: item.publishedAt?.trim() || null,
  }));

  return (
    <div data-home="">
      <Hero hero={site.hero} />

      <DotBand />

      <HomeNews items={newsItems} />

      <DotBand />

      {showAboutMethods ? (
        <>
          <HomeAboutMethods
            about={homepage.about}
            methods={homepage.methods}
            image={homepage.about.image}
            imageAlt={homepage.about.imageAlt}
          />
          <DotBand mirror />
        </>
      ) : null}

      <div className="page py-section">
        <PaletteRow />
      </div>

      {showFeatured || showCzytelnia ? (
        <HomeFeaturedAndReading
          featured={
            showFeatured && featuredHref
              ? {
                  label: homepage.featured.heading,
                  heading: featuredHeading,
                  lead: featuredLead,
                  href: featuredHref,
                  ctaLabel: homepage.featured.ctaLabel,
                  ctaHref: homepage.featured.ctaHref,
                }
              : null
          }
          czytelnia={
            showCzytelnia
              ? {
                  heading: homepage.czytelnia.heading,
                  lead: homepage.czytelnia.lead,
                  ctaLabel: homepage.czytelnia.ctaLabel,
                  ctaHref: homepage.czytelnia.ctaHref,
                }
              : null
          }
        />
      ) : null}

      <div className="page pb-section">
        <PaletteRow />
      </div>
    </div>
  );
}
