"use client";

import { useState } from "react";
import {
  BlobStack,
  type BlobRowItem,
} from "@/components/sections/blob-stack";
import { CATEGORY_SECTION_PREVIEW } from "@/lib/czytelnia-filters";

export type PublicationCategorySection = {
  slug: string;
  title: string;
  items: BlobRowItem[];
};

type Mode = "preview" | "open" | "closed";

function visibleItems(items: BlobRowItem[], mode: Mode): BlobRowItem[] {
  if (mode === "closed") return [];
  if (mode === "open") return items;
  return items.slice(0, CATEGORY_SECTION_PREVIEW);
}

function actionLabel(
  mode: Mode,
  count: number,
  copy: { expand: string; collapse: string },
): string {
  const needsExpand =
    mode === "closed" ||
    (mode === "preview" && count > CATEGORY_SECTION_PREVIEW);
  return needsExpand ? copy.expand : copy.collapse;
}

function CategorySection({
  group,
  copy,
}: {
  group: PublicationCategorySection;
  copy: { expand: string; collapse: string };
}) {
  const [mode, setMode] = useState<Mode>("preview");
  const shown = visibleItems(group.items, mode);
  const expanded = mode !== "closed";
  const label = actionLabel(mode, group.items.length, copy);
  const headingId = `czytelnia-${group.slug}`;

  function toggle() {
    setMode((current) => {
      if (current === "closed") return "open";
      if (current === "open") return "closed";
      return group.items.length > CATEGORY_SECTION_PREVIEW ? "open" : "closed";
    });
  }

  return (
    <section className="pub-cat" aria-labelledby={headingId}>
      <h2 id={headingId} className="pub-cat-head">
        <button
          type="button"
          className="pub-cat-toggle"
          aria-expanded={expanded}
          onClick={toggle}
        >
          <span className="pub-cat-title">
            {group.title}{" "}
            <span className="pub-cat-count">({group.items.length})</span>
          </span>
          <span className="pub-cat-action">{label}</span>
        </button>
      </h2>
      {shown.length > 0 ? (
        <div className="pub-cat-list">
          <BlobStack items={shown} />
        </div>
      ) : null}
    </section>
  );
}

export function PublicationCategoryList({
  groups,
  copy,
}: {
  groups: PublicationCategorySection[];
  copy: { expand: string; collapse: string };
}) {
  if (groups.length === 0) return null;

  return (
    <div className="pub-cats">
      {groups.map((group) => (
        <CategorySection key={group.slug} group={group} copy={copy} />
      ))}
    </div>
  );
}
