import { cache } from "react";
import { getLandingPage } from "./sanity/fetch";
import type { LandingPage, SanityImage } from "./sanity/types";
import { SUBPAGE } from "./subpage-copy";

export const LANDING_DOCUMENT_IDS = {
  projekty: "landing-projekty",
  knowledge: "landing-baza-wiedzy",
  czytelnia: "landing-czytelnia",
  team: "landing-zespol",
} as const;

export type ResolvedLandingHero = {
  title: string;
  lead: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  image: SanityImage | null;
  imageAlt: string;
};

type HeroFallback = {
  title: string;
  lead?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
};

function resolveHero(
  cms: LandingPage | null,
  fallback: HeroFallback,
): ResolvedLandingHero {
  const title = cms?.title?.trim() || fallback.title;
  return {
    title,
    lead: cms?.lead?.trim() || fallback.lead || null,
    ctaLabel: cms?.ctaLabel?.trim() || fallback.ctaLabel || null,
    ctaHref: cms?.ctaHref?.trim() || fallback.ctaHref || null,
    image: cms?.image ?? null,
    imageAlt: cms?.image?.alt?.trim() || title,
  };
}

export type ResolvedProjectsLanding = ResolvedLandingHero & {
  czytelnia: {
    title: string;
    lead: string;
    href: string;
    ctaLabel: string;
  };
};

export const getProjectsLanding = cache(
  async function getProjectsLanding(): Promise<ResolvedProjectsLanding> {
    const cms = await getLandingPage(LANDING_DOCUMENT_IDS.projekty);
    const copy = SUBPAGE.projects;
    return {
      ...resolveHero(cms, {
        title: copy.title,
        lead: copy.lead,
        ctaLabel: copy.ctaLabel,
        ctaHref: copy.ctaHref,
      }),
      czytelnia: {
        title: cms?.czytelniaTeaser?.title?.trim() || copy.czytelnia.title,
        lead: cms?.czytelniaTeaser?.lead?.trim() || copy.czytelnia.lead,
        href: copy.czytelnia.href,
        ctaLabel: cms?.czytelniaTeaser?.ctaLabel?.trim() || copy.czytelnia.ctaLabel,
      },
    };
  },
);

export const getKnowledgeLanding = cache(
  async function getKnowledgeLanding(): Promise<ResolvedLandingHero> {
    const cms = await getLandingPage(LANDING_DOCUMENT_IDS.knowledge);
    return resolveHero(cms, {
      title: SUBPAGE.knowledge.title,
      lead: SUBPAGE.knowledge.lead,
    });
  },
);

export const getCzytelniaLanding = cache(
  async function getCzytelniaLanding(): Promise<ResolvedLandingHero> {
    const cms = await getLandingPage(LANDING_DOCUMENT_IDS.czytelnia);
    return resolveHero(cms, {
      title: SUBPAGE.czytelnia.title,
      lead: SUBPAGE.czytelnia.lead,
    });
  },
);

export const getTeamLanding = cache(
  async function getTeamLanding(): Promise<ResolvedLandingHero> {
    const cms = await getLandingPage(LANDING_DOCUMENT_IDS.team);
    return resolveHero(cms, {
      title: SUBPAGE.team.title,
      lead: SUBPAGE.team.lead,
    });
  },
);
