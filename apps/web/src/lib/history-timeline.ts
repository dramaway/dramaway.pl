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

/**
 * An entry has to be this open before a downward scroll target is delayed.
 * Partial neighbours still follow the scroll immediately.
 */
export const HISTORY_OPEN_ENOUGH = 0.8;

/** Pause before an open year starts following a lower scroll target. */
export const HISTORY_COLLAPSE_HOLD_MS = 700;

export type HistoryHold = {
  /** Keep the openness already reached instead of following a lower `goal`. */
  hold: boolean;
  /**
   * 0 — no pending release. A positive timestamp — release then.
   * -1 — the release already fired, so a later frame must not start it again.
   */
  until: number;
};

/**
 * Collapse lags the scroll target by one short pause. The pause starts when
 * the target first drops and is not refreshed, so the year then follows the
 * scroll again. Once the two are within a few percent the next drop may pause
 * again. A rise always passes through.
 */
export function historyCollapseHold(
  current: number,
  goal: number,
  now: number,
  until: number,
): HistoryHold {
  if (!(current >= HISTORY_OPEN_ENOUGH) || goal >= current - 0.03) {
    return { hold: false, until: 0 };
  }
  if (until === 0) {
    return { hold: true, until: now + HISTORY_COLLAPSE_HOLD_MS };
  }
  if (now < until) return { hold: true, until };
  return { hold: false, until: -1 };
}

/**
 * While the pause lasts, stay at the openness scroll already produced.
 * A higher goal still wins, so opening is never held back.
 */
export function historyHeldOpenness(
  current: number,
  goal: number,
  hold: boolean,
): number {
  if (!hold) return goal;
  return Math.max(current, goal);
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
