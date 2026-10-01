import { Blob } from "@/components/visual/blob";
import { HeroSlider } from "@/components/visual/hero-slider";
import { Media } from "@/components/visual/media";
import type { HeroSlide } from "@/lib/hero-slides";
import { getHeroSliderSettings } from "@/lib/site";

type HeroMediaProps = {
  slides: HeroSlide[];
  /**
   * `slot` keeps the column with no still (inner pages).
   * `sand` draws the empty sand frame (homepage).
   */
  empty?: "slot" | "sand";
};

/**
 * Hero still. One image is the static frame. Two or more crossfade with
 * the shared slider settings. Zero images keep the column without a photo.
 */
export async function HeroMedia({ slides, empty = "slot" }: HeroMediaProps) {
  if (slides.length === 0) {
    if (empty === "sand") {
      return (
        <>
          <Blob />
          <Media
            image={null}
            alt=""
            variant="bleed"
            ratio="none"
            sizes="(min-width: 64rem) 34vw, 70vw"
            className="hero-media"
          />
        </>
      );
    }
    return <div className="hero-media hero-media-empty" aria-hidden />;
  }

  if (slides.length === 1) {
    const slide = slides[0];
    return (
      <>
        <Blob />
        <Media
          image={slide.image}
          alt={slide.alt}
          variant="bleed"
          ratio="none"
          sizes="(min-width: 64rem) 34vw, 70vw"
          priority
          className="hero-media"
        />
      </>
    );
  }

  const settings = await getHeroSliderSettings();

  return (
    <>
      <Blob />
      <HeroSlider slides={slides} settings={settings} />
    </>
  );
}
