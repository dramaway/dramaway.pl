import {
  FALLBACK_FOOTER_NOTE,
  FALLBACK_HERO,
  FALLBACK_HOMEPAGE,
} from "./homepage-copy";
import { DEFAULT_CENTRUM_URL } from "./routes";
import { getSiteSettings } from "./sanity/fetch";
import type {
  HomepageAbout,
  HomepageBlock,
  HomepageContent,
  ResolvedSite,
  SanityImage,
  SiteSettingsHomepageBlock,
  SiteSettingsHomepageFeatured,
} from "./sanity/types";

export const FALLBACK_SITE_TITLE = "Fundacja Drama Way";

export type { HomepageAbout, HomepageBlock, HomepageContent, ResolvedSite };

type BlockFallback = {
  heading: string;
  lead: string;
  ctaLabel: string;
  ctaHref: string;
};

function resolveBlock(
  cms: SiteSettingsHomepageBlock | null | undefined,
  fallback: BlockFallback,
): HomepageBlock {
  return {
    heading: cms?.heading?.trim() || fallback.heading,
    lead: cms?.lead?.trim() || fallback.lead,
    ctaLabel: cms?.ctaLabel?.trim() || fallback.ctaLabel,
    ctaHref: cms?.ctaHref?.trim() || fallback.ctaHref,
  };
}

function resolveFeatured(
  cms: SiteSettingsHomepageFeatured | null | undefined,
  fallback: BlockFallback,
): HomepageBlock {
  return resolveBlock(
    {
      heading: cms?.label,
      lead: cms?.lead,
      ctaLabel: cms?.ctaLabel,
      ctaHref: cms?.ctaHref,
    },
    fallback,
  );
}

export async function getResolvedSite(
  fallbackImage?: SanityImage | null,
): Promise<ResolvedSite> {
  const settings = await getSiteSettings();
  const title = settings?.title?.trim() || FALLBACK_SITE_TITLE;
  const tagline = settings?.tagline?.trim() || null;
  const heading = settings?.heroHeading?.trim() || FALLBACK_HERO.heading;
  const cmsHomepage = settings?.homepage;

  const aboutBlock = resolveBlock(cmsHomepage?.about, FALLBACK_HOMEPAGE.about);
  const about: HomepageAbout = {
    ...aboutBlock,
    image: cmsHomepage?.about?.image ?? null,
    imageAlt: cmsHomepage?.about?.image?.alt?.trim() || aboutBlock.heading,
  };

  const homepage: HomepageContent = {
    about,
    methods: resolveBlock(cmsHomepage?.methods, FALLBACK_HOMEPAGE.methods),
    featured: resolveFeatured(cmsHomepage?.featured, FALLBACK_HOMEPAGE.featured),
    czytelnia: resolveBlock(cmsHomepage?.czytelnia, FALLBACK_HOMEPAGE.czytelnia),
  };

  return {
    title,
    tagline,
    centrumUrl: settings?.centrumUrl?.trim() || DEFAULT_CENTRUM_URL,
    footerNote: settings?.footerNote?.trim() || FALLBACK_FOOTER_NOTE,
    hero: {
      heading,
      lead: settings?.heroLead?.trim() || FALLBACK_HERO.lead,
      ctaLabel: settings?.heroCtaLabel?.trim() || FALLBACK_HERO.ctaLabel,
      ctaHref: settings?.heroCtaHref?.trim() || FALLBACK_HERO.ctaHref,
      image: settings?.heroImage ?? fallbackImage ?? null,
      imageAlt: settings?.heroImage?.alt?.trim() || heading,
    },
    homepage,
  };
}
