"use client";

import { useEffect, useState } from "react";
import { Media } from "@/components/visual/media";
import type { HeroSlide, HeroSliderSettings } from "@/lib/hero-slides";
import { objectPositionFromHotspot } from "@/lib/sanity/hotspot";
import { urlFor } from "@/lib/sanity/image";
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

  const playing =
    settings.autoplay &&
    !reduceMotion &&
    !userPaused &&
    !hovered &&
    !focused &&
    !hidden;

  useEffect(() => {
    if (!playing || count < 2) return;
    const id = window.setInterval(() => {
      setIndex((current) => {
        setLeaving(current);
        return wrapIndex(current + 1, count);
      });
    }, settings.interval * 1000);
    return () => window.clearInterval(id);
  }, [playing, count, settings.interval, index]);

  function goTo(next: number) {
    setIndex((current) => {
      const wrapped = wrapIndex(next, count);
      if (wrapped === current) return current;
      setLeaving(current);
      return wrapped;
    });
  }

  const showPause = settings.autoplay && !reduceMotion;

  return (
    <div
      className="hero-slider"
      role="region"
      aria-label={copy.region}
      data-animate={animate ? "true" : "false"}
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
          const objectPosition = objectPositionFromHotspot(slide.image);
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
              {/* Swatch inside the control. Hotspot is CSS object-position, same math as Media. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="hero-slider-thumb"
                alt=""
                src={urlFor(slide.image).width(128).fit("max").auto("format").url()}
                style={objectPosition ? { objectPosition } : undefined}
              />
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
          </button>
        ) : null}
      </div>
    </div>
  );
}
