import { cache } from "react";
import { cmsCta, cmsText } from "./cms-text";
import { resolveContentSections } from "./content-sections";
import { resolveHeroSlides } from "./hero-slides";
import { EXCERPT_FALLBACK_MAX } from "./homepage-copy";
import { knowledgeHubPath, LIBRARY_ANCHOR } from "./routes";
import { getLandingPage } from "./sanity/fetch";
import type { HeroSlide, LandingPage, ResolvedSection } from "./sanity/types";

export const LANDING_DOCUMENT_IDS = {
  projekty: "landing-projekty",
  czytelnia: "landing-czytelnia",
  team: "landing-zespol",
} as const;

export type ResolvedLandingHero = {
  title: string | null;
  lead: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  slides: HeroSlide[];
};

export type ResolvedChannelTeaser = {
  title: string;
  lead: string | null;
  href: string;
  ctaLabel: string | null;
};

function resolveHero(cms: LandingPage | null): ResolvedLandingHero {
  const title = cmsText(cms?.title);
  const cta = cmsCta(cms?.ctaLabel, cms?.ctaHref);
  return {
    title,
    lead: cmsText(cms?.lead),
    ctaLabel: cta?.label ?? null,
    ctaHref: cta?.href ?? null,
    slides: resolveHeroSlides(cms?.heroImages, title || ""),
  };
}

function shortenLead(text: string | null): string | null {
  if (!text) return null;
  if (text.length <= EXCERPT_FALLBACK_MAX) return text;
  return text.slice(0, EXCERPT_FALLBACK_MAX).trimEnd();
}

function teaserFromLanding(
  landing: ResolvedLandingHero,
  href: string,
): ResolvedChannelTeaser | null {
  const title = landing.title;
  if (!title) return null;
  return {
    title,
    lead: shortenLead(landing.lead),
    href,
    ctaLabel: landing.ctaLabel,
  };
}

export const getCzytelniaLanding = cache(
  async function getCzytelniaLanding(): Promise<ResolvedLandingHero> {
    const cms = await getLandingPage(LANDING_DOCUMENT_IDS.czytelnia);
    return resolveHero(cms);
  },
);

export const getCzytelniaTeaser = cache(
  async function getCzytelniaTeaser(): Promise<ResolvedChannelTeaser | null> {
    return teaserFromLanding(await getCzytelniaLanding(), `${knowledgeHubPath()}#${LIBRARY_ANCHOR}`);
  },
);

function shouldShowCzytelniaOnProjects(cms: LandingPage | null): boolean {
  return cms?.showCzytelnia !== false;
}

export type ResolvedProjectsLanding = ResolvedLandingHero & {
  czytelnia: ResolvedChannelTeaser | null;
  /** Same modules as the homepage. Empty = keep the automatic active-project row. */
  sections: ResolvedSection[];
};

export const getProjectsLanding = cache(
  async function getProjectsLanding(): Promise<ResolvedProjectsLanding> {
    const [cms, czytelnia] = await Promise.all([
      getLandingPage(LANDING_DOCUMENT_IDS.projekty),
      getCzytelniaTeaser(),
    ]);
    const sections = resolveContentSections(cms?.sections);
    return {
      ...resolveHero(cms),
      czytelnia:
        sections.length === 0 && shouldShowCzytelniaOnProjects(cms) ? czytelnia : null,
      sections,
    };
  },
);

export const getTeamLanding = cache(
  async function getTeamLanding(): Promise<ResolvedLandingHero> {
    const cms = await getLandingPage(LANDING_DOCUMENT_IDS.team);
    return resolveHero(cms);
  },
);
