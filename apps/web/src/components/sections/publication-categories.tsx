import Link from "next/link";
import {
  CzytelniaStack,
  type CzytelniaRowItem,
} from "@/components/sections/czytelnia-stack";
import { categoryToneForSlug } from "@/lib/category-tones";
import { czytelniaFilterHref } from "@/lib/czytelnia-filters";
import type { PublicationFormat } from "@/lib/sanity/types";

export type PublicationCategorySection = {
  slug: string;
  title: string;
  items: CzytelniaRowItem[];
};

/**
 * Category tiles act as the table of contents of the library.
 * Picking a tile shows only that category; "Wszystkie" shows every one.
 */
export function PublicationCategories({
  groups,
  rodzaj,
  focusedSlug,
  allLabel,
  navLabel,
}: {
  groups: PublicationCategorySection[];
  rodzaj: PublicationFormat;
  focusedSlug: string | undefined;
  allLabel: string;
  navLabel: string;
}) {
  if (groups.length === 0) return null;
  const total = groups.reduce((sum, group) => sum + group.items.length, 0);
  const visible = focusedSlug
    ? groups.filter((group) => group.slug === focusedSlug)
    : groups;

  return (
    <>
      <nav className="cat-tiles" aria-label={navLabel}>
        <ul>
          <li>
            <Link
              href={czytelniaFilterHref({ rodzaj })}
              scroll={false}
              className="cat-tile"
              aria-current={focusedSlug ? undefined : "true"}
            >
              <span className="cat-tile-title">{allLabel}</span>
              <span className="cat-tile-count">{total}</span>
            </Link>
          </li>
          {groups.map((group, index) => (
            <li key={group.slug}>
              <Link
                href={czytelniaFilterHref({ rodzaj, kategoria: group.slug })}
                scroll={false}
                className="cat-tile"
                data-tone={categoryToneForSlug(group.slug, index)}
                aria-current={group.slug === focusedSlug ? "true" : undefined}
              >
                <span className="cat-tile-title">{group.title}</span>
                <span className="cat-tile-count">{group.items.length}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {visible.map((group) => {
        return (
          <section
            key={group.slug}
            className="pub-cat"
            aria-label={group.title}
          >
            <div className="pub-cat-list">
              <div className="stack-wide">
                <CzytelniaStack items={group.items} />
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
