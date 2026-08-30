import { DEFAULT_CENTRUM_URL } from "./routes";
import { getSiteSettings } from "./sanity/fetch";
import type { HeroContent, SanityImage } from "./sanity/types";

export const FALLBACK_SITE_TITLE = "Fundacja Drama Way";

const DEFAULT_HERO_CTA_HREF = "/projekty";

/** Copy from the Figma homepage — used until Studio fields are filled. */
const FALLBACK_HERO = {
  heading: "Drama i teatr jako narzędzia dialogu między pokoleniami",
  lead: "DramaWay tworzy projekty teatralne i edukacyjne oparte na metodzie dramy oraz Teatrze Zaangażowanym Społecznie — łącząc pokolenia, społeczności i tematy, o których trudno mówić wprost.",
  ctaLabel: "poznaj nasze projekty",
} as const;

export async function getResolvedSite(fallbackImage?: SanityImage | null) {
  const settings = await getSiteSettings();
  const title = settings?.title?.trim() || FALLBACK_SITE_TITLE;
  const tagline = settings?.tagline?.trim() || null;
  const heading =
    settings?.heroHeading?.trim() || FALLBACK_HERO.heading;

  const hero: HeroContent = {
    heading,
    lead: settings?.heroLead?.trim() || FALLBACK_HERO.lead,
    ctaLabel: settings?.heroCtaLabel?.trim() || FALLBACK_HERO.ctaLabel,
    ctaHref: settings?.heroCtaHref?.trim() || DEFAULT_HERO_CTA_HREF,
    image: settings?.heroImage ?? fallbackImage ?? null,
    imageAlt: settings?.heroImage?.alt?.trim() || heading,
  };

  return {
    title,
    tagline,
    centrumUrl: settings?.centrumUrl?.trim() || DEFAULT_CENTRUM_URL,
    footerNote: settings?.footerNote?.trim() || null,
    hero,
  };
}
