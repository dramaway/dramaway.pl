"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
} from "react";
import { SUBPAGE } from "@/lib/subpage-copy";
import {
  historyDampOpenness,
  historyHoldLastOpen,
  historyOpenness,
  historyScrollDirection,
  historyScrollOpenness,
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
/** Top of the buffer: a marker above this line starts closing its year. */
const HOLD_Y = 0.28;
/** A long body stays open until its end rises above this line. */
const RELEASE_Y = 0.62;
/** Marker travel, as a viewport share, over which a year closes. */
const CLOSE_SPAN = 0.3;

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
 * years around the focal point, in step with the scroll. On the vertical
 * list a year stays fully open while its dot and title pass through the top
 * of the screen and closes only as the end of its body rises further.
 * "rozwiń całość" opens every year for plain reading and turns the scroll
 * effect off.
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

  const [reading, setReading] = useState(false);
  const horizontal = layout === "horizontal" && wide && !reduced && !reading;
  const itemKey = items.map((item) => `${item.year}\0${item.title}`).join("\n");

  const [openness, setOpenness] = useState<number[]>(() => items.map(() => 0));
  const [seen, setSeen] = useState<boolean[]>(() => items.map(() => false));

  const opennessRef = useRef(openness);
  const itemsRef = useRef(items);
  const readingRef = useRef(reading);
  const kickRef = useRef<() => void>(() => {});
  const lastOpenRef = useRef(false);
  const scrollDirectionRef = useRef<"up" | "down" | null>(null);
  const lastScrollYRef = useRef(0);
  const lastScrollHeightRef = useRef(0);
  opennessRef.current = openness;
  itemsRef.current = items;
  readingRef.current = reading;

  const [generation, setGeneration] = useState(itemKey);
  if (generation !== itemKey) {
    const blank = items.map(() => 0);
    opennessRef.current = blank;
    setGeneration(itemKey);
    setOpenness(blank);
    setReading(false);
    setSeen(items.map(() => false));
    lastOpenRef.current = false;
    scrollDirectionRef.current = null;
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
    if (reduced) {
      const locked = Array.from({ length: count }, () => (readingRef.current ? 1 : 0));
      opennessRef.current = locked;
      setOpenness(locked);
      return;
    }

    let frame = 0;
    let stopped = false;

    const measure = () => {
      const current = itemsRef.current;
      if (!horizontal) {
        const viewport = window.innerHeight;
        const band = {
          focal: viewport * FOCAL_Y,
          reach: Math.max(1, viewport * VERTICAL_REACH),
          hold: viewport * HOLD_Y,
          release: viewport * RELEASE_Y,
          span: Math.max(1, viewport * CLOSE_SPAN),
        };
        const target = current.map((_, index) => {
          const marker = markerRefs.current[index];
          if (!marker) return 0;
          const rect = marker.getBoundingClientRect();
          const center = rect.top + rect.height / 2;
          const panel = itemRefs.current[index]?.querySelector<HTMLElement>(".history-panel");
          let length = rect.height / 2;
          if (panel) {
            const full = Number(panel.style.getPropertyValue("--panel")) || 0;
            length = panel.getBoundingClientRect().top - center + full;
          }
          return historyScrollOpenness(center, length, band);
        });
        const lastIndex = target.length - 1;
        if (lastIndex >= 0) {
          if (scrollDirectionRef.current === "up") lastOpenRef.current = false;
          if (scrollDirectionRef.current === "down" && target[lastIndex] > 0) {
            lastOpenRef.current = true;
          }
          target[lastIndex] = historyHoldLastOpen(
            target[lastIndex],
            lastOpenRef.current,
            scrollDirectionRef.current,
          );
        }
        return target;
      }
      const sticky = stickyRef.current;
      const focal =
        (sticky?.getBoundingClientRect().left ?? 0) +
        (sticky?.clientWidth ?? window.innerWidth) / 2;
      const reach = Math.max(1, (sticky?.clientWidth ?? window.innerWidth) * HORIZONTAL_REACH);
      const positions = current.map((_, index) => {
        const marker = markerRefs.current[index];
        if (!marker) return focal + reach * 4;
        const rect = marker.getBoundingClientRect();
        return rect.left + rect.width / 2;
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
      if (!readingRef.current) syncPin();
      const target = readingRef.current
        ? itemsRef.current.map(() => 1)
        : measure();
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
    lastScrollYRef.current = window.scrollY;
    lastScrollHeightRef.current = document.documentElement.scrollHeight;
    kick();
    const onScroll = () => {
      const scrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      scrollDirectionRef.current = historyScrollDirection(
        lastScrollYRef.current,
        scrollY,
        lastScrollHeightRef.current,
        scrollHeight,
        lastOpenRef.current,
        scrollDirectionRef.current,
      );
      lastScrollYRef.current = scrollY;
      lastScrollHeightRef.current = scrollHeight;
      kick();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
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
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", kick);
      observer?.disconnect();
    };
  }, [horizontal, itemKey, reading, reduced]);

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

  const onFocus = (event: FocusEvent<HTMLHeadingElement>, index: number) => {
    if (!horizontal) return;
    const heading = event.currentTarget;
    window.requestAnimationFrame(() => {
      if (heading.matches(":focus-visible")) centerInPin(index);
    });
  };

  const canReadAll = items.some((item) => item.body);
  const copy = SUBPAGE.history;
  const readAll = canReadAll ? (
    <div className={cn("stack-narrow", spaced && "history-follow")}>
      <button
        type="button"
        className="history-all"
        aria-expanded={reading}
        onClick={() => setReading((value) => !value)}
      >
        {reading ? copy.collapseAll : copy.expandAll}
      </button>
    </div>
  ) : null;

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
      onFocus={(event) => onFocus(event, index)}
    />
  ));

  if (horizontal) {
    return (
      <>
        {readAll}
        <div ref={pinRef} className={cn("history-pin", !canReadAll && spaced && "history-follow")}>
          <div ref={stickyRef} className="history-pin-sticky">
            <ol ref={trackRef} className="history-track">
              {entries}
            </ol>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {readAll}
      <div className={cn("stack-narrow", !canReadAll && spaced && "history-follow")}>
        <ol className={cn("history-list", !reduced && !reading && "history-reveal")}>{entries}</ol>
      </div>
    </>
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
  onFocus: (event: FocusEvent<HTMLHeadingElement>) => void;
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
  onFocus,
}: HistoryEntryProps) {
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
      <span
        ref={markerRef}
        aria-hidden
        className={cn("history-marker", MARKER_TONES[index % MARKER_TONES.length])}
      >
        {item.year}
      </span>
      <h3
        className="history-title"
        tabIndex={horizontal ? 0 : undefined}
        onFocus={horizontal ? onFocus : undefined}
      >
        {item.title}
      </h3>
      {!horizontal && !isLast ? (
        <div className="history-rail" aria-hidden>
          <span className="history-stem" />
          <svg className="history-wave" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d={historyWavePath(factor, nextFactor)}
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      ) : null}
      {item.body ? <HistoryPanel body={item.body} open={open} /> : null}
    </li>
  );
}

function HistoryPanel({ body, open }: { body: string; open: number }) {
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
      className="history-panel"
      aria-hidden={open < 0.05 ? true : undefined}
    >
      <div ref={innerRef} className="history-panel-inner">
        <p className="history-body">{body}</p>
      </div>
    </div>
  );
}
