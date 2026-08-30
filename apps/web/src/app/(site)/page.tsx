import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/layout/section";
import { Hero } from "@/components/sections/hero";
import { CtaLink } from "@/components/visual/cta-link";
import { DotBand } from "@/components/visual/dot-band";
import { Media } from "@/components/visual/media";
import { PaletteRow } from "@/components/visual/palette-row";
import { getNewsPages, getProjects } from "@/lib/sanity/fetch";
import {
  publicPathForPageSlug,
  publicPathForProjectSlug,
} from "@/lib/routes";
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
    getNewsPages(),
  ]);
  const featured = projects.find((project) => project.featured) ?? projects[0];
  const site = await getResolvedSite(featured?.cover);

  return (
    <>
      <Hero hero={site.hero} />

      <DotBand />

      {featured ? (
        <Section bleed>
          <div className="split">
            <div className="split-text py-section">
              <p className="font-display text-small font-semibold uppercase text-magenta">
                Projekt wyróżniony
              </p>
              <h2 className="mt-2 font-display text-h2 font-extrabold">
                <Link href={publicPathForProjectSlug(featured.slug)}>
                  {featured.title}
                </Link>
              </h2>
              {featured.summary ? (
                <p className="measure mt-6">{featured.summary}</p>
              ) : null}
              {featured.editionCount ? (
                <p className="mt-3 text-small">{featured.editionCount} edycji</p>
              ) : null}
              <CtaLink
                href={publicPathForProjectSlug(featured.slug)}
                className="mt-8"
              >
                zobacz projekt
              </CtaLink>
            </div>
            <Media
              image={featured.cover}
              alt={featured.title}
              variant="bleed"
              ratio="landscape"
              sizes="(min-width: 64rem) 34vw, 100vw"
              className="split-media"
            />
          </div>
        </Section>
      ) : null}

      {news.length > 0 ? (
        <Section>
          <h2 className="font-display text-h2 font-extrabold">Aktualności</h2>
          <ul className="cols-3 mt-10">
            {news.map((item) => (
              <li key={item._id}>
                <Link href={publicPathForPageSlug(item.slug)} className="group">
                  <Media
                    image={item.cover ?? null}
                    alt={newsTitle(item.title)}
                    variant="inset"
                    ratio="landscape"
                    sizes="(min-width: 64rem) 28vw, (min-width: 48rem) 45vw, 100vw"
                  />
                  <h3 className="mt-4 font-display text-h3 font-extrabold group-hover:text-magenta">
                    {newsTitle(item.title)}
                  </h3>
                </Link>
                {item.excerpt ? (
                  <p className="mt-3 line-clamp-4 text-small">
                    {item.excerpt}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Section>
        <h2 className="font-display text-h2 font-extrabold">Projekty</h2>
        <ul className="cols-3 mt-10">
          {projects.map((project) => (
            <li key={project._id}>
              <Link
                href={publicPathForProjectSlug(project.slug)}
                className="group"
              >
                <Media
                  image={project.cover}
                  alt={project.title}
                  variant="inset"
                  ratio="album"
                  sizes="(min-width: 64rem) 28vw, (min-width: 48rem) 45vw, 100vw"
                />
                <h3 className="mt-4 font-display text-h3 font-extrabold group-hover:text-magenta">
                  {project.title}
                </h3>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <div className="page pb-section">
        <PaletteRow className="justify-center" />
      </div>
    </>
  );
}
