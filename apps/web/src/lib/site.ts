import { cache } from "react";
import { cmsCta, cmsText } from "./cms-text";
import { resolveContentSections } from "./content-sections";
import {
  resolveHeroSlider,
  resolveHeroSlides,
  type HeroSliderSettings,
} from "./hero-slides";
import { resolveMainNav } from "./navigation";
import { resolveFooterLinks } from "./footer-links";
import { DEFAULT_CENTRUM_URL } from "./routes";
import { isNewsletterEnabled } from "./newsletter";
import { getSiteSettings } from "./sanity/fetch";
import type { ResolvedFooter, ResolvedSite, SiteSettings } from "./sanity/types";

export type { HomepageContent, ResolvedSite } from "./sanity/types";

function resolveFooter(
  settings: SiteSettings | null,
  title: string,
): ResolvedFooter {
  const cms = settings?.footer;
  return {
    logo: cms?.logo ?? null,
    logoAlt: cmsText(cms?.logo?.alt) || title,
    address: cmsText(cms?.address) || cmsText(settings?.footerNote),
    links: resolveFooterLinks(cms?.links),
    newsletterEnabled: isNewsletterEnabled(settings?.newsletter?.enabled),
  };
}

export async function getResolvedSite(): Promise<ResolvedSite> {
  const settings = await getSiteSettings();
  const title = cmsText(settings?.title) || "Fundacja Drama Way";
  const tagline = cmsText(settings?.tagline);
  const heading = cmsText(settings?.heroHeading);
  const heroCta = cmsCta(settings?.heroCtaLabel, settings?.heroCtaHref);

  return {
    title,
    tagline,
    centrumUrl: cmsText(settings?.centrumUrl) || DEFAULT_CENTRUM_URL,
    nav: resolveMainNav(settings?.navigation),
    footer: resolveFooter(settings, title),
    hero: {
      heading,
      lead: cmsText(settings?.heroLead),
      ctaLabel: heroCta?.label ?? null,
      ctaHref: heroCta?.href ?? null,
      slides: resolveHeroSlides(settings?.heroImages, heading || title),
    },
    homepage: {
      sections: resolveContentSections(settings?.homepageSections),
    },
  };
}

/** Shared by every hero with two or more stills. One fetch per request. */
export const getHeroSliderSettings = cache(
  async function getHeroSliderSettings(): Promise<HeroSliderSettings> {
    const settings = await getSiteSettings();
    return resolveHeroSlider(settings?.heroSlider);
  },
);
