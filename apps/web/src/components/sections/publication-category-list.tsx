"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  CzytelniaStack,
  type CzytelniaRowItem,
} from "@/components/sections/czytelnia-stack";
import {
  czytelniaCategoryHeadingId,
  czytelniaFilterHref,
} from "@/lib/czytelnia-filters";
import type { PublicationFormat } from "@/lib/sanity/types";

export type PublicationCategorySection = {
  slug: string;
  title: string;
  items: CzytelniaRowItem[];
};

function CategorySection({
  group,
  copy,
  rodzaj,
  focusedSlug,
}: {
  group: PublicationCategorySection;
  copy: { expand: string; collapse: string };
  rodzaj: PublicationFormat;
  focusedSlug: string | undefined;
}) {
  const headingId = czytelniaCategoryHeadingId(group.slug);
  const isFocused = focusedSlug === group.slug;
  const open = !focusedSlug || isFocused;
  const href = czytelniaFilterHref({
    rodzaj,
    kategoria: isFocused ? undefined : group.slug,
  });

  return (
    <section className="pub-cat" aria-labelledby={headingId}>
      <h2 id={headingId} className="pub-cat-head">
        <Link
          href={href}
          scroll={false}
          className="pub-cat-toggle"
          aria-expanded={open}
          aria-current={isFocused ? "true" : undefined}
        >
          <span className="pub-cat-title">
            {group.title}{" "}
            <span className="pub-cat-count">({group.items.length})</span>
          </span>
          <span className="pub-cat-action">
            {open ? copy.collapse : copy.expand}
          </span>
        </Link>
      </h2>
      {open ? (
        <div className="pub-cat-list">
          <div className="measure">
            <CzytelniaStack items={group.items} />
          </div>
        </div>
      ) : null}
    </section>
  );
}

export function PublicationCategoryList({
  groups,
  copy,
  rodzaj,
  focusedSlug,
}: {
  groups: PublicationCategorySection[];
  copy: { expand: string; collapse: string };
  rodzaj: PublicationFormat;
  focusedSlug: string | undefined;
}) {
  useEffect(() => {
    if (!focusedSlug) return;
    const heading = document.getElementById(
      czytelniaCategoryHeadingId(focusedSlug),
    );
    heading?.scrollIntoView({ block: "start" });
  }, [focusedSlug]);

  if (groups.length === 0) return null;

  return (
    <div className="pub-cats">
      {groups.map((group) => (
        <CategorySection
          key={group.slug}
          group={group}
          copy={copy}
          rodzaj={rodzaj}
          focusedSlug={focusedSlug}
        />
      ))}
    </div>
  );
}
