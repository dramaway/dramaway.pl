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

function slideCaption(slide: CmsHeroImage): string | null {
  if (!("caption" in slide)) return null;
  return cmsText(slide.caption) || null;
}

export type HeroSliderInput = {
  interval?: number | null;
  autoplay?: boolean | null;
} | null;

/**
 * Still list for a hero. Zero assets means no frame. One asset stays a
 * static frame; the slider starts at two. Callers that have a separate
 * fallback (a project cover) pass that image in their own second call.
 */
export function resolveHeroSlides(
  slides: readonly HeroImageInput[] | null | undefined,
  fallbackAlt: string,
): HeroSlide[] {
  const listed = (slides ?? [])
    .flatMap((slide) => {
      const ready = asSlide(slide);
      return ready ? [ready] : [];
    })
    .slice(0, HERO_SLIDES_MAX);

  return listed.map((slide, index) => ({
    _key:
      (typeof slide._key === "string" && slide._key.trim()) || `slide-${index}`,
    image: slide,
    alt: cmsText(slide.alt) || fallbackAlt,
    caption: slideCaption(slide),
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
