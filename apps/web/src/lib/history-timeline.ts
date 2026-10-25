/** Desktop sine for the vertical timeline. Index 0 stays on the left edge. */
export const HISTORY_WAVE_FREQUENCY = 0.8;

/** How many markers nearest the focal point may open at once. */
export const HISTORY_FOCUS_COUNT = 3;

export type HistoryLayout = "vertical" | "horizontal";

export function resolveHistoryLayout(
  value: string | null | undefined,
): HistoryLayout {
  return value === "horizontal" ? "horizontal" : "vertical";
}

/** 0 at the left edge, 1 at the full rightward amplitude. */
export function historyWaveFactor(
  index: number,
  frequency = HISTORY_WAVE_FREQUENCY,
): number {
  if (!Number.isFinite(index)) return 0;
  return (1 - Math.cos(index * frequency)) / 2;
}

/**
 * Cubic from this marker to the next, in a 100×100 viewBox whose width is
 * one wave amplitude. x = 0 is this marker's centre.
 */
export function historyWavePath(factor: number, nextFactor: number): string {
  const x = Math.round((nextFactor - factor) * 10000) / 100;
  return `M 0 0 C 0 50 ${x} 50 ${x} 100`;
}

/** Sticky runway: one viewport plus the horizontal distance the track must travel. */
export function historyPinSpan(viewport: number, travel: number): number {
  return Math.max(0, viewport) + Math.max(0, travel);
}

/** Negative translate that maps vertical progress 0…1 onto the track. */
export function historyTrackOffset(progress: number, travel: number): number {
  const p = clamp01(progress);
  const distance = Math.max(0, travel);
  if (p === 0 || distance === 0) return 0;
  return -p * distance;
}

/**
 * 0 when the pin's top edge hits the viewport top, 1 when the pin has
 * scrolled through by `pinHeight - viewport`.
 */
export function historyPinProgress(
  pinTop: number,
  pinHeight: number,
  viewport: number,
): number {
  const travel = pinHeight - viewport;
  if (travel <= 0) return 0;
  return clamp01(-pinTop / travel);
}

/**
 * Openness 0…1. Only the `activeCount` positions closest to `focal` ease
 * open; the rest stay shut. `reach` is the distance at which openness hits 0.
 */
export function historyOpenness(
  positions: readonly number[],
  focal: number,
  reach: number,
  activeCount = HISTORY_FOCUS_COUNT,
): number[] {
  if (positions.length === 0 || !(reach > 0) || !(activeCount > 0)) {
    return positions.map(() => 0);
  }
  const ranked = positions
    .map((pos, index) => ({ index, dist: Math.abs(pos - focal) }))
    .sort((a, b) => a.dist - b.dist || a.index - b.index);
  const active = new Set(
    ranked.slice(0, activeCount).map((entry) => entry.index),
  );
  return positions.map((pos, index) => {
    if (!active.has(index)) return 0;
    const t = Math.abs(pos - focal) / reach;
    return 1 - smoothstep(t);
  });
}

/** `null` keeps the scroll value. A number forces that openness. */
export function historyMergeOpenness(
  scroll: readonly number[],
  forced: readonly (number | null)[],
): number[] {
  return scroll.map((value, index) => {
    const override = forced[index];
    if (override == null || !Number.isFinite(override)) return clamp01(value);
    return clamp01(override);
  });
}

export type HistoryScrollBand = {
  /** Marker centre at which a year is fully open on the way up. */
  focal: number;
  /** Distance below `focal` over which the year opens. */
  reach: number;
  /** Top edge of the buffer: the year starts closing once its marker is above. */
  hold: number;
  /**
   * A long body keeps the year open until its fully opened end rises above
   * this line, even when the marker has already left the buffer.
   */
  release: number;
  /** Marker travel over which the year closes once the close starts. */
  span: number;
};

/**
 * Vertical openness as a pure function of position, no timing. Rises as the
 * marker comes up to `focal`, stays at 1 through the top buffer, then falls
 * over `span`. `length` is the distance from the marker centre to the end of
 * the fully opened body; it does not depend on the current openness, so the
 * curve does not feed back on itself.
 */
export function historyScrollOpenness(
  center: number,
  length: number,
  band: HistoryScrollBand,
): number {
  if (!Number.isFinite(center)) return 0;
  if (!(band.reach > 0) || !(band.span > 0)) return 0;
  const rise = center <= band.focal
    ? 1
    : 1 - smoothstep((center - band.focal) / band.reach);
  const reach = Number.isFinite(length) ? Math.max(0, length) : 0;
  const start = Math.min(band.hold, band.release - reach);
  const fall = center >= start
    ? 1
    : 1 - smoothstep((start - center) / band.span);
  return Math.min(rise, fall);
}

/**
 * Once the last vertical entry has opened, keep it open until its marker has
 * moved below the viewport on the way back up. Collapsing it while it is in
 * view would shorten the document underneath the user's scroll position.
 */
export function historyLastOpenLatch(
  latched: boolean,
  openness: number,
  scrollDirection: "up" | "down" | null,
  markerTop: number,
  viewport: number,
): boolean {
  if (!latched && scrollDirection === "down" && openness > 0) return true;
  if (
    latched &&
    scrollDirection === "up" &&
    Number.isFinite(markerTop) &&
    Number.isFinite(viewport) &&
    markerTop >= viewport
  ) {
    return false;
  }
  return latched;
}

export function historyHoldLastOpen(openness: number, latched: boolean): number {
  return latched ? 1 : clamp01(openness);
}

/** Ease toward the target. Snaps when the gap is under 0.01. */
export function historyDampOpenness(
  current: readonly number[],
  target: readonly number[],
  factor = 0.35,
): number[] {
  const k = clamp01(factor);
  return target.map((goal, index) => {
    const prev = current[index] ?? 0;
    const next = prev + (goal - prev) * k;
    return Math.abs(goal - next) < 0.01 ? goal : next;
  });
}

function clamp01(n: number): number {
  if (!Number.isFinite(n) || n <= 0) return 0;
  if (n >= 1) return 1;
  return n;
}

function smoothstep(t: number): number {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
}
