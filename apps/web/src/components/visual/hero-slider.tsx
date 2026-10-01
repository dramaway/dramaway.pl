"use client";

import { useEffect, useState, type AnimationEvent, type CSSProperties } from "react";
import { Media } from "@/components/visual/media";
import type { HeroSlide, HeroSliderSettings } from "@/lib/hero-slides";
import { focalThumbRect } from "@/lib/sanity/hotspot";
import { urlFor } from "@/lib/sanity/image";
import type { SanityImage } from "@/lib/sanity/types";
import { SUBPAGE } from "@/lib/subpage-copy";

const copy = SUBPAGE.hero.slider;

type HeroSliderProps = {
  slides: HeroSlide[];
  settings: HeroSliderSettings;
};

function slideLabel(index: number, total: number) {
  return copy.goTo
    .replaceAll("{n}", String(index + 1))
    .replaceAll("{total}", String(total));
}

function wrapIndex(index: number, count: number) {
  return ((index % count) + count) % count;
}

/** Square crop around the hotspot so a 1.75rem dot still reads. */
function thumbSrc(image: SanityImage) {
  const rect = focalThumbRect(image);
  const builder = urlFor(image).width(160).height(160).auto("format");
  if (!rect) return builder.fit("crop").url();
  return builder.rect(rect.left, rect.top, rect.width, rect.height).url();
}

/**
 * Crossfade for two or more hero stills. One still never reaches this
 * component. Autoplay follows site settings and pauses for hover, focus,
 * a hidden tab, and prefers-reduced-motion.
 */
export function HeroSlider({ slides, settings }: HeroSliderProps) {
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const [animate, setAnimate] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    setAnimate(true);
  }, []);

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const autoplay = settings.autoplay && !reduceMotion;
  const playing =
    autoplay && !userPaused && !hovered && !focused && !hidden;

  function goTo(next: number) {
    setIndex((current) => {
      const wrapped = wrapIndex(next, count);
      if (wrapped === current) return current;
      setLeaving(current);
      return wrapped;
    });
  }

  const showPause = autoplay;

  function advanceFromRing(event: AnimationEvent<SVGCircleElement>) {
    if (event.animationName !== "hero-slider-ring") return;
    setIndex((current) => {
      setLeaving(current);
      return wrapIndex(current + 1, count);
    });
  }

  return (
    <div
      className="hero-slider"
      role="region"
      aria-label={copy.region}
      data-animate={animate ? "true" : "false"}
      data-autoplay={autoplay ? "true" : "false"}
      data-playing={playing ? "true" : "false"}
      style={
        { "--hero-slider-interval": `${settings.interval}s` } as CSSProperties
      }
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <div className="hero-slider-frame">
        {slides.map((slide, slideIndex) => {
          const active = slideIndex === index;
          return (
            <div
              key={slide._key}
              className="hero-slider-slide"
              data-active={active ? "true" : "false"}
              data-leaving={leaving === slideIndex && !active ? "true" : "false"}
              aria-hidden={active ? undefined : true}
            >
              <Media
                image={slide.image}
                alt={slide.alt}
                variant="bleed"
                ratio="none"
                sizes="(min-width: 64rem) 34vw, 70vw"
                priority={slideIndex === 0}
                className="hero-media"
              />
            </div>
          );
        })}
      </div>

      <div className="hero-slider-controls">
        {slides.map((slide, slideIndex) => {
          const active = slideIndex === index;
          const tipId = `hero-tip-${slide._key}`;
          return (
            <button
              key={slide._key}
              type="button"
              className="hero-slider-control hero-slider-dot"
              aria-label={slideLabel(slideIndex, count)}
              aria-describedby={slide.caption ? tipId : undefined}
              aria-current={active ? "true" : undefined}
              onClick={() => goTo(slideIndex)}
            >
              {/* Focal crop is already in the URL. The ring is the active marker. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="hero-slider-thumb"
                alt=""
                src={thumbSrc(slide.image)}
              />
              {active ? (
                <svg className="hero-slider-progress" viewBox="0 0 32 32" aria-hidden>
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    pathLength={100}
                    transform="rotate(-90 16 16)"
                    onAnimationEnd={advanceFromRing}
                  />
                </svg>
              ) : null}
              {slide.caption ? (
                <span className="hero-slider-tip" role="tooltip" id={tipId}>
                  {slide.caption}
                </span>
              ) : null}
            </button>
          );
        })}
        {showPause ? (
          <button
            type="button"
            className="hero-slider-control hero-slider-pause"
            aria-pressed={userPaused}
            aria-label={userPaused ? copy.play : copy.pause}
            data-state={userPaused ? "paused" : "playing"}
            onClick={() => setUserPaused((value) => !value)}
          >
            <span className="hero-slider-glyph" aria-hidden />
            <svg className="hero-slider-play" viewBox="0 0 18 20" aria-hidden>
              <path
                fill="currentColor"
                d="M2.5 5.8 L2.5 14.2 Q2.5 17.8 5.6 16 L11.9 12.5 Q16.2 10 11.9 7.5 L5.6 4 Q2.5 2.2 2.5 5.8 Z"
              />
            </svg>
          </button>
        ) : null}
      </div>
    </div>
  );
}
