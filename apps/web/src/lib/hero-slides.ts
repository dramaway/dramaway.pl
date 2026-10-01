import { cmsText } from "./cms-text";
import { hasHeroImage } from "./sanity/image";
import type { CmsHeroImage, HeroSlide, SanityImage } from "./sanity/types";

export type { HeroSlide };

export const HERO_SLIDES_MAX = 5;
export const HERO_SLIDER_INTERVAL_DEFAULT = 7;
export const HERO_SLIDER_INTERVAL_MIN = 4;
export const HERO_SLIDER_INTERVAL_MAX = 20;

export type HeroSliderSettings = {
  /** Seconds the active still stays before the next one. */
  interval: number;
  /** When false, only the dots move the still. */
  autoplay: boolean;
};

export type HeroImageInput = CmsHeroImage | SanityImage | null;

function asSlide(image: HeroImageInput | undefined): CmsHeroImage | null {
  if (!hasHeroImage(image as SanityImage | null | undefined)) return null;
  return image as CmsHeroImage;
}

export type HeroSliderInput = {
  interval?: number | null;
  autoplay?: boolean | null;
} | null;

/**
 * Prefer the slide list. A non-empty list replaces the legacy single image.
 * One remaining asset is a still; the slider starts at two.
 */
export function resolveHeroSlides(
  slides: readonly HeroImageInput[] | null | undefined,
  legacy: HeroImageInput | undefined,
  fallbackAlt: string,
): HeroSlide[] {
  const listed = (slides ?? [])
    .flatMap((slide) => {
      const ready = asSlide(slide);
      return ready ? [ready] : [];
    })
    .slice(0, HERO_SLIDES_MAX);
  const legacySlide = asSlide(legacy);
  const chosen = listed.length > 0 ? listed : legacySlide ? [legacySlide] : [];
  const legacyOnly = listed.length === 0;

  return chosen.map((slide, index) => ({
    _key:
      (typeof slide._key === "string" && slide._key.trim()) ||
      (legacyOnly ? "legacy" : `slide-${index}`),
    image: slide,
    alt: cmsText(slide.alt) || fallbackAlt,
  }));
}

/** Global slider timing. Missing CMS values keep the built-in defaults. */
export function resolveHeroSlider(raw: HeroSliderInput | undefined): HeroSliderSettings {
  const interval = raw?.interval;
  const rounded =
    typeof interval === "number" && Number.isFinite(interval)
      ? Math.round(interval)
      : HERO_SLIDER_INTERVAL_DEFAULT;

  return {
    interval: Math.min(
      HERO_SLIDER_INTERVAL_MAX,
      Math.max(HERO_SLIDER_INTERVAL_MIN, rounded),
    ),
    autoplay: raw?.autoplay !== false,
  };
}
