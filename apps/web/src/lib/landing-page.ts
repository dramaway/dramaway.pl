import { cache } from "react";
import { cmsCta, cmsText } from "./cms-text";
import { czytelniaPath } from "./routes";
import { getLandingPage } from "./sanity/fetch";
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

export type ResolvedCzytelniaTeaser = {
  title: string | null;
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

function resolveCzytelniaTeaser(
  cms: LandingPage | null,
): ResolvedCzytelniaTeaser | null {
  const title = cmsText(cms?.czytelniaTeaser?.title);
  const lead = cmsText(cms?.czytelniaTeaser?.lead);
  const ctaLabel = cmsText(cms?.czytelniaTeaser?.ctaLabel);
  if (!title) return null;
  return {
    title,
    lead,
    href: czytelniaPath(),
    ctaLabel,
  };
}

export type ResolvedProjectsLanding = ResolvedLandingHero & {
  czytelnia: ResolvedCzytelniaTeaser | null;
};

export const getProjectsLanding = cache(
  async function getProjectsLanding(): Promise<ResolvedProjectsLanding> {
    const cms = await getLandingPage(LANDING_DOCUMENT_IDS.projekty);
    return {
      ...resolveHero(cms),
      czytelnia: resolveCzytelniaTeaser(cms),
    };
  },
);

export const getKnowledgeLanding = cache(
  async function getKnowledgeLanding(): Promise<ResolvedLandingHero> {
    const cms = await getLandingPage(LANDING_DOCUMENT_IDS.knowledge);
    return resolveHero(cms);
  },
);

export const getCzytelniaLanding = cache(
  async function getCzytelniaLanding(): Promise<ResolvedLandingHero> {
    const cms = await getLandingPage(LANDING_DOCUMENT_IDS.czytelnia);
    return resolveHero(cms);
  },
);

export const getTeamLanding = cache(
  async function getTeamLanding(): Promise<ResolvedLandingHero> {
    const cms = await getLandingPage(LANDING_DOCUMENT_IDS.team);
    return resolveHero(cms);
  },
);
