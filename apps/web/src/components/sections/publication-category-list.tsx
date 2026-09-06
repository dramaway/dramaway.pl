"use client";

import { useState } from "react";
import {
  BlobStack,
  type BlobRowItem,
} from "@/components/sections/blob-stack";

export type PublicationCategorySection = {
  slug: string;
  title: string;
  items: BlobRowItem[];
};

function CategorySection({
  group,
  copy,
}: {
  group: PublicationCategorySection;
  copy: { expand: string; collapse: string };
}) {
  const [open, setOpen] = useState(true);
  const headingId = `czytelnia-${group.slug}`;

  return (
    <section className="pub-cat" aria-labelledby={headingId}>
      <h2 id={headingId} className="pub-cat-head">
        <button
          type="button"
          className="pub-cat-toggle"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
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
          <div className="measure">
            <BlobStack items={group.items} />
          </div>
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
