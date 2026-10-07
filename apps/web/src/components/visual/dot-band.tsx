"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

type DotBandProps = {
  /**
   * Set when the section above ends with a photo on the **left**. Mirrors the
   * step so the row on the photo's side is the upper one and rides its bottom
   * edge, instead of sitting a full row below the photo.
   */
  mirror?: boolean;
  className?: string;
};

type Side = "left" | "right";

/** Brand tones, scrambled so neighbours do not form a rainbow. */
const BRAND_TONES = [
  "var(--color-brand-1)",
  "var(--color-brand-4)",
  "var(--color-brand-7)",
  "var(--color-brand-3)",
  "var(--color-brand-6)",
  "var(--color-brand-2)",
  "var(--color-brand-5)",
] as const;

const WAVE_MS = 85;
/** Let one wave travel before another hover on the same row restarts it. */
const WAVE_LOCK_MS = 1100;

/**
 * Circles in one row. Matches `round(up, 50%, --dot-size)`: half the band,
 * rounded up to a whole diameter, so each row meets its own page edge.
 */
export function dotsPerRow(bandWidth: number, dotSize: number) {
  if (bandWidth <= 0 || dotSize <= 0) return 0;
  return Math.max(1, Math.ceil(bandWidth / 2 / dotSize - 1e-4));
}

function toneFor(index: number, side: Side) {
  const shift = side === "right" ? 3 : 0;
  return BRAND_TONES[(index + shift) % BRAND_TONES.length];
}

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * One gentle colour wave along a single row, both ways from the hovered dot.
 * Colour only — the keyframes never transform the circle.
 */
function flashFrom(dot: HTMLElement) {
  if (reducedMotion()) return;
  const row = dot.parentElement;
  if (!row) return;
  const dots = [...row.querySelectorAll<HTMLElement>(".dot-band-dot")];
  const origin = dots.indexOf(dot);
  if (origin < 0) return;
  const next =
    row.dataset.wave === "dot-confetti-a" ? "dot-confetti-b" : "dot-confetti-a";
  row.dataset.wave = next;
  for (const [index, item] of dots.entries()) {
    item.style.setProperty(
      "--dot-delay",
      `${Math.abs(index - origin) * WAVE_MS}ms`,
    );
    item.style.animationName = next;
  }
}

function hitDot(band: HTMLElement, x: number, y: number) {
  const bandRect = band.getBoundingClientRect();
  if (bandRect.width === 0 || bandRect.height === 0) return null;
  if (
    x < bandRect.left ||
    x > bandRect.right ||
    y < bandRect.top ||
    y > bandRect.bottom
  ) {
    return null;
  }
  const upperFirst = band.classList.contains("dot-band-mirror")
    ? ["dot-row-left", "dot-row-right"]
    : ["dot-row-right", "dot-row-left"];
  for (const side of upperFirst) {
    const row = band.querySelector(`.${side}`);
    if (!row) continue;
    for (const dot of row.querySelectorAll<HTMLElement>(".dot-band-dot")) {
      const rect = dot.getBoundingClientRect();
      const dx = x - (rect.left + rect.width / 2);
      const dy = y - (rect.top + rect.height / 2);
      const radius = rect.width / 2;
      if (dx * dx + dy * dy <= radius * radius) return dot;
    }
  }
  return null;
}

function DotRow({ count, side }: { count: number; side: Side }) {
  return (
    <div
      className={cn(
        "dot-row",
        side === "left" ? "dot-row-left" : "dot-row-right",
      )}
      style={{ "--dot-count": String(count) } as CSSProperties}
    >
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          className="dot-band-dot"
          style={{ "--dot-tone": toneFor(index, side) } as CSSProperties}
        />
      ))}
    </div>
  );
}

/**
 * Decorative band of tangent sand circles that steps halfway across.
 * Until the width is measured, `.dot-band` paints the same circles with a
 * gradient. Real circles then take over so a hover can colour one row.
 * Pointer events stay off the circles — a band overlaps photos and links.
 */
export function DotBand({ mirror = false, className }: DotBandProps) {
  const ref = useRef<HTMLDivElement>(null);
  const countRef = useRef(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const band = ref.current;
    if (!band) return;

    const measure = () => {
      const size = Number.parseFloat(
        getComputedStyle(band).getPropertyValue("--dot-size"),
      );
      const next = dotsPerRow(band.clientWidth, size);
      if (next !== countRef.current) {
        countRef.current = next;
        setCount(next);
      }
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(band);

    let current: HTMLElement | null = null;
    let lockedRow: HTMLElement | null = null;
    let lockedUntil = 0;
    const onPointer = (event: PointerEvent) => {
      const dot = hitDot(band, event.clientX, event.clientY);
      if (!dot) {
        current = null;
        lockedRow = null;
        return;
      }
      if (dot === current) return;
      const row = dot.parentElement;
      const now = performance.now();
      if (row && row === lockedRow && now < lockedUntil) {
        current = dot;
        return;
      }
      current = dot;
      lockedRow = row;
      lockedUntil = now + WAVE_LOCK_MS;
      flashFrom(dot);
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPointer, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("dot-band", mirror && "dot-band-mirror", className)}
    >
      {count > 0 ? (
        <>
          <DotRow count={count} side="left" />
          <DotRow count={count} side="right" />
        </>
      ) : null}
    </div>
  );
}
