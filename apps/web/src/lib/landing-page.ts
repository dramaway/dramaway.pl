import { cache } from "react";
import { cmsCta, cmsText } from "./cms-text";
import { EXCERPT_FALLBACK_MAX } from "./homepage-copy";
import { czytelniaPath, methodsPath } from "./routes";
import { getLandingPage, getPageBySlug } from "./sanity/fetch";
import type { LandingPage, SanityImage } from "./sanity/types";

export const LANDING_DOCUMENT_IDS = {
  projekty: "landing-projekty",
  knowledge: "landing-baza-wiedzy",
  czytelnia: "landing-czytelnia",
  team: "landing-zespol",
} as const;

export type ResolvedLandingHero = {
  title: string | null;
  lead: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  image: SanityImage | null;
  imageAlt: string;
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
    image: cms?.image ?? null,
    imageAlt: cmsText(cms?.image?.alt) || title || "",
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
    return teaserFromLanding(await getCzytelniaLanding(), czytelniaPath());
  },
);

export const getMethodsTeaser = cache(
  async function getMethodsTeaser(): Promise<ResolvedChannelTeaser | null> {
    const page = await getPageBySlug("metody");
    const title = cmsText(page?.title);
    if (!title) return null;
    return {
      title,
      lead: shortenLead(cmsText(page?.excerpt) || cmsText(page?.heroLead)),
      href: methodsPath(),
      ctaLabel: cmsText(page?.heroCtaLabel),
    };
  },
);

export const getKnowledgeChannels = cache(
  async function getKnowledgeChannels(): Promise<ResolvedChannelTeaser[]> {
    const [methods, czytelnia] = await Promise.all([
      getMethodsTeaser(),
      getCzytelniaTeaser(),
    ]);
    return [methods, czytelnia].filter(
      (item): item is ResolvedChannelTeaser => item !== null,
    );
  },
);

function shouldShowCzytelniaOnProjects(cms: LandingPage | null): boolean {
  if (cms?.showCzytelnia === true) return true;
  if (cms?.showCzytelnia === false) return false;
  return Boolean(cmsText(cms?.legacyCzytelniaTeaserTitle));
}

export type ResolvedProjectsLanding = ResolvedLandingHero & {
  czytelnia: ResolvedChannelTeaser | null;
};

export const getProjectsLanding = cache(
  async function getProjectsLanding(): Promise<ResolvedProjectsLanding> {
    const [cms, czytelnia] = await Promise.all([
      getLandingPage(LANDING_DOCUMENT_IDS.projekty),
      getCzytelniaTeaser(),
    ]);
    return {
      ...resolveHero(cms),
      czytelnia: shouldShowCzytelniaOnProjects(cms) ? czytelnia : null,
    };
  },
);

export const getKnowledgeLanding = cache(
  async function getKnowledgeLanding(): Promise<ResolvedLandingHero> {
    const cms = await getLandingPage(LANDING_DOCUMENT_IDS.knowledge);
    return resolveHero(cms);
  },
);

export const getTeamLanding = cache(
  async function getTeamLanding(): Promise<ResolvedLandingHero> {
    const cms = await getLandingPage(LANDING_DOCUMENT_IDS.team);
    return resolveHero(cms);
  },
);
