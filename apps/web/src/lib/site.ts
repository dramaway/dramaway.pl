import { cmsCta, cmsText } from "./cms-text";
import { DEFAULT_CENTRUM_URL } from "./routes";
import { getSiteSettings } from "./sanity/fetch";
import type {
  HomepageAbout,
  HomepageBlock,
  HomepageContent,
  ResolvedFooter,
  ResolvedSite,
  SiteSettings,
  SiteSettingsHomepageBlock,
  SiteSettingsHomepageFeatured,
} from "./sanity/types";

export type { HomepageAbout, HomepageBlock, HomepageContent, ResolvedSite };

function resolveBlock(
  cms: SiteSettingsHomepageBlock | null | undefined,
): HomepageBlock {
  const cta = cmsCta(cms?.ctaLabel, cms?.ctaHref);
  return {
    heading: cmsText(cms?.heading),
    lead: cmsText(cms?.lead),
    ctaLabel: cta?.label ?? null,
    ctaHref: cta?.href ?? null,
  };
}

function resolveFeatured(
  cms: SiteSettingsHomepageFeatured | null | undefined,
): HomepageBlock {
  return resolveBlock({
    heading: cms?.label,
    lead: cms?.lead,
    ctaLabel: cms?.ctaLabel,
    ctaHref: cms?.ctaHref,
  });
}

function resolveFooter(
  settings: SiteSettings | null,
  title: string,
): ResolvedFooter {
  const cms = settings?.footer;
  return {
    logo: cms?.logo ?? null,
    logoAlt: cmsText(cms?.logo?.alt) || title,
    address: cmsText(cms?.address) || cmsText(settings?.footerNote),
    quote: cmsText(cms?.quote),
    attribution: cmsText(cms?.attribution),
  };
}

export function homepageBlockHasContent(block: HomepageBlock) {
  return Boolean(block.heading || block.lead || (block.ctaLabel && block.ctaHref));
}

export async function getResolvedSite(): Promise<ResolvedSite> {
  const settings = await getSiteSettings();
  const title = cmsText(settings?.title) || "Fundacja Drama Way";
  const tagline = cmsText(settings?.tagline);
  const heading = cmsText(settings?.heroHeading);
  const cmsHomepage = settings?.homepage;
  const heroCta = cmsCta(settings?.heroCtaLabel, settings?.heroCtaHref);

  const aboutBlock = resolveBlock(cmsHomepage?.about);
  const about: HomepageAbout = {
    ...aboutBlock,
    image: cmsHomepage?.about?.image ?? null,
    imageAlt: cmsText(cmsHomepage?.about?.image?.alt) || aboutBlock.heading || "",
  };

  const homepage: HomepageContent = {
    about,
    methods: resolveBlock(cmsHomepage?.methods),
    featured: resolveFeatured(cmsHomepage?.featured),
    czytelnia: resolveBlock(cmsHomepage?.czytelnia),
  };

  return {
    title,
    tagline,
    centrumUrl: cmsText(settings?.centrumUrl) || DEFAULT_CENTRUM_URL,
    footer: resolveFooter(settings, title),
    hero: {
      heading,
      lead: cmsText(settings?.heroLead),
      ctaLabel: heroCta?.label ?? null,
      ctaHref: heroCta?.href ?? null,
      image: settings?.heroImage ?? null,
      imageAlt: cmsText(settings?.heroImage?.alt) || heading || title,
    },
    homepage,
  };
}
