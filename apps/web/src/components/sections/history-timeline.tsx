"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
} from "react";
import { SUBPAGE } from "@/lib/subpage-copy";
import {
  historyDampOpenness,
  historyMergeOpenness,
  historyOpenness,
  historyPinProgress,
  historyPinSpan,
  historyTrackOffset,
  historyWaveFactor,
  historyWavePath,
  type HistoryLayout,
} from "@/lib/history-timeline";
import type { ResolvedAboutHistoryItem } from "@/lib/sanity/types";
import { cn } from "@/lib/utils";

const MARKER_TONES = [
  "bg-brand-1",
  "bg-brand-2",
  "bg-brand-3",
  "bg-brand-4",
  "bg-brand-5",
  "bg-brand-6",
  "bg-brand-7",
] as const;

const OPEN_EASE = 0.22;
const VERTICAL_REACH = 0.34;
const HORIZONTAL_REACH = 0.32;
const FOCAL_Y = 0.46;

type HistoryTimelineProps = {
  items: readonly ResolvedAboutHistoryItem[];
  layout: HistoryLayout;
  spaced?: boolean;
};

type MotionCss = CSSProperties & {
  "--open"?: number;
  "--wave"?: number;
};

/**
 * /fundacja history. Vertical list with a desktop sine, or a sticky
 * horizontal track whose vertical scroll drives translateX. Phones and
 * reduced motion always get the vertical list. Scroll opens the two or
 * three markers nearest the focal point; "więcej" / "zwiń" pins one year.
 */
export function HistoryTimeline({ items, layout, spaced = false }: HistoryTimelineProps) {
  const [wide, setWide] = useState(false);
  const [reduced, setReduced] = useState(false);

  useLayoutEffect(() => {
    const widthQuery = window.matchMedia("(min-width: 64rem)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setWide(widthQuery.matches);
      setReduced(motionQuery.matches);
    };
    sync();
    widthQuery.addEventListener("change", sync);
    motionQuery.addEventListener("change", sync);
    return () => {
      widthQuery.removeEventListener("change", sync);
      motionQuery.removeEventListener("change", sync);
    };
  }, []);

  const horizontal = layout === "horizontal" && wide && !reduced;
  const reveal = !reduced;
  const itemKey = items.map((item) => `${item.year}\0${item.title}`).join("\n");

  const [openness, setOpenness] = useState<number[]>(() => items.map(() => 0));
  const [forced, setForced] = useState<(number | null)[]>(() => items.map(() => null));
  const [seen, setSeen] = useState<boolean[]>(() => items.map(() => false));

  const opennessRef = useRef(openness);
  const forcedRef = useRef(forced);
  const itemsRef = useRef(items);
  const kickRef = useRef<() => void>(() => {});
  opennessRef.current = openness;
  forcedRef.current = forced;
  itemsRef.current = items;

  const [generation, setGeneration] = useState(itemKey);
  if (generation !== itemKey) {
    const blank = items.map(() => 0);
    const locks = items.map((): number | null => null);
    opennessRef.current = blank;
    forcedRef.current = locks;
    setGeneration(itemKey);
    setOpenness(blank);
    setForced(locks);
    setSeen(items.map(() => false));
  }

  const pinRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const markerRefs = useRef<(HTMLElement | null)[]>([]);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const count = itemsRef.current.length;
    if (reduced || typeof IntersectionObserver === "undefined") {
      setSeen(Array.from({ length: count }, () => true));
      return;
    }
    const nodes = itemRefs.current.filter((node): node is HTMLLIElement => Boolean(node));
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setSeen((prev) => {
          const next = prev.slice();
          let changed = false;
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const index = Number((entry.target as HTMLElement).dataset.index);
            if (!Number.isInteger(index) || next[index]) continue;
            next[index] = true;
            changed = true;
            observer.unobserve(entry.target);
          }
          return changed ? next : prev;
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" },
    );
    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, [horizontal, itemKey, reduced]);

  useEffect(() => {
    const count = itemsRef.current.length;
    if (!reveal) {
      const locked = Array.from({ length: count }, (_, index) => forcedRef.current[index] ?? 0);
      opennessRef.current = locked;
      setOpenness(locked);
      return;
    }

    let frame = 0;
    let stopped = false;

    const measure = () => {
      const current = itemsRef.current;
      const sticky = stickyRef.current;
      const focal = horizontal
        ? (sticky?.getBoundingClientRect().left ?? 0) +
          (sticky?.clientWidth ?? window.innerWidth) / 2
        : window.innerHeight * FOCAL_Y;
      const reach = horizontal
        ? Math.max(1, (sticky?.clientWidth ?? window.innerWidth) * HORIZONTAL_REACH)
        : Math.max(1, window.innerHeight * VERTICAL_REACH);
      const positions = current.map((_, index) => {
        const marker = markerRefs.current[index];
        if (!marker) return focal + reach * 4;
        const rect = marker.getBoundingClientRect();
        return horizontal ? rect.left + rect.width / 2 : rect.top + rect.height / 2;
      });
      return historyOpenness(positions, focal, reach);
    };

    const syncPin = () => {
      if (!horizontal) return;
      const pin = pinRef.current;
      const sticky = stickyRef.current;
      const track = trackRef.current;
      if (!pin || !sticky || !track) return;
      const viewport = window.innerHeight;
      const travel = Math.max(0, track.scrollWidth - sticky.clientWidth);
      const span = historyPinSpan(viewport, travel);
      pin.style.height = `${span}px`;
      const progress = historyPinProgress(
        pin.getBoundingClientRect().top,
        span,
        viewport,
      );
      track.style.transform = `translate3d(${historyTrackOffset(progress, travel)}px, 0, 0)`;
    };

    const tick = (framesLeft: number) => {
      if (stopped) return;
      syncPin();
      const target = historyMergeOpenness(measure(), forcedRef.current);
      const next = historyDampOpenness(opennessRef.current, target, OPEN_EASE);
      const changed = next.some((value, index) => value !== opennessRef.current[index]);
      if (changed) {
        opennessRef.current = next;
        setOpenness(next);
      }
      const settled = next.every((value, index) => value === target[index]);
      if (!settled && framesLeft > 0) {
        frame = window.requestAnimationFrame(() => tick(framesLeft - 1));
      }
    };

    const kick = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => tick(24));
    };

    kickRef.current = kick;
    kick();
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    const sticky = stickyRef.current;
    let lastWidth = sticky?.clientWidth ?? 0;
    const observer =
      horizontal && sticky
        ? new ResizeObserver(() => {
            if (sticky.clientWidth === lastWidth) return;
            lastWidth = sticky.clientWidth;
            kick();
          })
        : null;
    if (sticky && observer) observer.observe(sticky);
    return () => {
      stopped = true;
      kickRef.current = () => {};
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      observer?.disconnect();
    };
  }, [horizontal, itemKey, reveal]);

  const centerInPin = useCallback((index: number) => {
    const pin = pinRef.current;
    const sticky = stickyRef.current;
    const track = trackRef.current;
    const card = itemRefs.current[index];
    if (!pin || !sticky || !track || !card) return;
    const travel = Math.max(0, track.scrollWidth - sticky.clientWidth);
    if (travel <= 0) return;
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const progress = Math.min(1, Math.max(0, -(sticky.clientWidth / 2 - cardCenter) / travel));
    const viewport = window.innerHeight;
    const span = Math.max(pin.offsetHeight, historyPinSpan(viewport, travel));
    const pinTop = pin.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: pinTop + progress * (span - viewport),
      behavior: "smooth",
    });
  }, []);

  const onToggle = (index: number) => {
    const shown = opennessRef.current[index] ?? 0;
    const nextValue = shown > 0.45 ? 0 : 1;
    const locks = forcedRef.current.slice();
    locks[index] = nextValue;
    forcedRef.current = locks;
    setForced(locks);
    if (!reveal) {
      const nextOpen = opennessRef.current.slice();
      nextOpen[index] = nextValue;
      opennessRef.current = nextOpen;
      setOpenness(nextOpen);
      return;
    }
    kickRef.current();
  };

  const onFocus = (event: FocusEvent<HTMLButtonElement>, index: number) => {
    if (!horizontal) return;
    const button = event.currentTarget;
    window.requestAnimationFrame(() => {
      if (button.matches(":focus-visible")) centerInPin(index);
    });
  };

  const entries = items.map((item, index) => (
    <HistoryEntry
      key={`${item.year}-${item.title}-${index}`}
      item={item}
      index={index}
      isLast={index === items.length - 1}
      horizontal={horizontal}
      open={openness[index] ?? 0}
      seen={seen[index] ?? false}
      itemRef={(node) => {
        itemRefs.current[index] = node;
      }}
      markerRef={(node) => {
        markerRefs.current[index] = node;
      }}
      onToggle={() => onToggle(index)}
      onFocus={(event) => onFocus(event, index)}
    />
  ));

  if (horizontal) {
    return (
      <div ref={pinRef} className={cn("history-pin", spaced && "history-follow")}>
        <div ref={stickyRef} className="history-pin-sticky">
          <ol ref={trackRef} className="history-track">
            {entries}
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("stack-narrow", spaced && "history-follow")}>
      <ol className={cn("history-list", !reduced && "history-reveal")}>{entries}</ol>
    </div>
  );
}

type HistoryEntryProps = {
  item: ResolvedAboutHistoryItem;
  index: number;
  isLast: boolean;
  horizontal: boolean;
  open: number;
  seen: boolean;
  itemRef: (node: HTMLLIElement | null) => void;
  markerRef: (node: HTMLElement | null) => void;
  onToggle: () => void;
  onFocus: (event: FocusEvent<HTMLButtonElement>) => void;
};

function HistoryEntry({
  item,
  index,
  isLast,
  horizontal,
  open,
  seen,
  itemRef,
  markerRef,
  onToggle,
  onFocus,
}: HistoryEntryProps) {
  const panelId = useId();
  const copy = SUBPAGE.history;
  const expanded = open >= 0.5;
  const factor = historyWaveFactor(index);
  const nextFactor = historyWaveFactor(index + 1);
  const style: MotionCss = { "--open": open, "--wave": factor };

  return (
    <li
      ref={itemRef}
      data-index={index}
      data-seen={seen ? "" : undefined}
      className={horizontal ? "history-card" : "history-item"}
      style={style}
    >
      <div className="history-axis">
        <span
          ref={markerRef}
          aria-hidden
          className={cn("history-marker", MARKER_TONES[index % MARKER_TONES.length])}
        >
          {item.year}
        </span>
        {!horizontal && !isLast ? <span className="history-stem" aria-hidden /> : null}
        {!horizontal && !isLast ? (
          <svg
            className="history-wave"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              d={historyWavePath(factor, nextFactor)}
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ) : null}
      </div>
      <div className="history-copy">
        <h3 className="history-title">
          {item.body ? (
            <button
              type="button"
              className="history-trigger"
              aria-expanded={expanded}
              aria-controls={panelId}
              onClick={onToggle}
              onFocus={onFocus}
            >
              <span className="history-trigger-label">{item.title}</span>
              <span className="history-more">
                <span>{expanded ? copy.collapse : copy.expand}</span>
                <svg className="history-chevron" viewBox="0 0 24 24" aria-hidden>
                  <path
                    d="M6 9l6 6 6-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
          ) : (
            item.title
          )}
        </h3>
        {item.body ? <HistoryPanel id={panelId} body={item.body} open={open} /> : null}
      </div>
    </li>
  );
}

function HistoryPanel({ id, body, open }: { id: string; body: string; open: number }) {
  const innerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const inner = innerRef.current;
    const panel = panelRef.current;
    if (!inner || !panel) return;
    const apply = () => {
      panel.style.setProperty("--panel", String(inner.scrollHeight));
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(inner);
    return () => observer.disconnect();
  }, [body]);

  return (
    <div
      ref={panelRef}
      id={id}
      className="history-panel"
      aria-hidden={open < 0.05 ? true : undefined}
    >
      <div ref={innerRef} className="history-panel-inner">
        <p className="history-body">{body}</p>
      </div>
    </div>
  );
}
