"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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

function openFromFocus(
  slugs: string[],
  focusedSlug: string | undefined,
): Record<string, boolean> {
  return Object.fromEntries(
    slugs.map((slug) => [slug, focusedSlug ? slug === focusedSlug : true]),
  );
}

function CategorySection({
  group,
  copy,
  open,
  onToggle,
}: {
  group: PublicationCategorySection;
  copy: { expand: string; collapse: string };
  open: boolean;
  onToggle: (slug: string) => void;
}) {
  const headingId = czytelniaCategoryHeadingId(group.slug);

  return (
    <section className="pub-cat" aria-labelledby={headingId}>
      <h2 id={headingId} className="pub-cat-head">
        <button
          type="button"
          className="pub-cat-toggle"
          aria-expanded={open}
          onClick={() => onToggle(group.slug)}
        >
          <span className="pub-cat-title">
            {group.title}{" "}
            <span className="pub-cat-count">({group.items.length})</span>
          </span>
          <span className="pub-cat-action">
            {open ? copy.collapse : copy.expand}
          </span>
        </button>
      </h2>
      {open ? (
        <div className="pub-cat-list">
          <div className="stack-wide">
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
  const router = useRouter();
  const slugs = groups.map((group) => group.slug);
  const slugKey = slugs.join("\n");
  const [openBySlug, setOpenBySlug] = useState(() =>
    openFromFocus(slugs, focusedSlug),
  );
  // Href we already applied locally. A later server echo of the same
  // address must not reopen sections the click just closed.
  const appliedHref = useRef<string | null>(null);

  useEffect(() => {
    const serverHref = czytelniaFilterHref({
      rodzaj,
      kategoria: focusedSlug,
    });
    if (appliedHref.current === serverHref) return;
    appliedHref.current = serverHref;
    setOpenBySlug(
      openFromFocus(slugKey.split("\n").filter(Boolean), focusedSlug),
    );
    if (!focusedSlug) return;
    document
      .getElementById(czytelniaCategoryHeadingId(focusedSlug))
      ?.scrollIntoView({ block: "start" });
  }, [focusedSlug, slugKey, rodzaj]);

  function toggle(slug: string) {
    const next = { ...openBySlug, [slug]: !openBySlug[slug] };
    const openSlugs = slugs.filter((item) => next[item]);
    const kategoria = openSlugs.length === 1 ? openSlugs[0] : undefined;
    const href = czytelniaFilterHref({ rodzaj, kategoria });
    const serverHref = czytelniaFilterHref({ rodzaj, kategoria: focusedSlug });
    setOpenBySlug(next);
    if (href === serverHref) return;
    appliedHref.current = href;
    router.replace(href, { scroll: false });
  }

  if (groups.length === 0) return null;

  return (
    <div className="pub-cats">
      {groups.map((group) => (
        <CategorySection
          key={group.slug}
          group={group}
          copy={copy}
          open={openBySlug[group.slug] ?? !focusedSlug}
          onToggle={toggle}
        />
      ))}
    </div>
  );
}
