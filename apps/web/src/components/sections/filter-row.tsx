"use client";

import { useCallback, useLayoutEffect, useRef } from "react";
import type { MouseEvent } from "react";
import { CtaLink } from "@/components/visual/cta-link";

export type FilterChip = {
  href: string;
  label: string;
  current: boolean;
};

type FilterRowProps = {
  label: string;
  chips: FilterChip[];
};

/** Format tabs for the library; empty formats and a single tab are omitted. */
export function FilterRow({ label, chips }: FilterRowProps) {
  const navRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const activeHref = chips.find((chip) => chip.current)?.href;
  const labelsKey = chips.map((chip) => chip.label).join("\0");

  const moveIndicator = useCallback((link: HTMLAnchorElement | null) => {
    const list = listRef.current;
    const indicator = indicatorRef.current;
    if (!link || !list || !indicator) return;

    const linkRect = link.getBoundingClientRect();
    const listRect = list.getBoundingClientRect();
    indicator.style.width = `${linkRect.width}px`;
    indicator.style.transform = `translate(${linkRect.left - listRect.left}px, ${linkRect.bottom - listRect.top - 3}px)`;
    navRef.current?.classList.add("is-enhanced");
  }, []);

  useLayoutEffect(() => {
    if (activeHref) {
      moveIndicator(
        listRef.current?.querySelector<HTMLAnchorElement>(
          'a[aria-current="true"]',
        ) ?? null,
      );
    }

    const handleResize = () => {
      moveIndicator(
        listRef.current?.querySelector<HTMLAnchorElement>(
          'a[aria-current="true"]',
        ) ?? null,
      );
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeHref, labelsKey, moveIndicator]);

  function handleClick(event: MouseEvent<HTMLElement>) {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const link = target.closest<HTMLAnchorElement>("a");
    if (link && listRef.current?.contains(link)) moveIndicator(link);
  }

  if (chips.length < 2) return null;

  return (
    <nav
      ref={navRef}
      className="filter-row-switches"
      aria-label={label}
      onClick={handleClick}
    >
      <ul ref={listRef}>
        {chips.map((chip) => (
          <li key={`${chip.href}-${chip.label}`}>
            <CtaLink href={chip.href} scroll={false} current={chip.current}>
              {chip.label}
            </CtaLink>
          </li>
        ))}
        <li className="filter-row-indicator-slot" aria-hidden="true">
          <span ref={indicatorRef} className="filter-row-indicator" />
        </li>
      </ul>
    </nav>
  );
}
