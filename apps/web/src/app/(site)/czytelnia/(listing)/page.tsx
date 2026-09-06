import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { BlobStack } from "@/components/sections/blob-stack";
import { FilterRow } from "@/components/sections/filter-row";
import { PublicationCategoryList } from "@/components/sections/publication-category-list";
import {
  czytelniaFilterHref,
  filterPublicationsByFormat,
  firstSearchParam,
  formatsWithItems,
  groupPublicationsByCategory,
  resolvePublicationFormat,
} from "@/lib/czytelnia-filters";
import { publicationPath } from "@/lib/routes";
import { getPublications, getReadingMethods } from "@/lib/sanity/fetch";
import { SUBPAGE } from "@/lib/subpage-copy";

export const metadata: Metadata = { title: "Czytelnia" };
export const revalidate = 60;

type SearchParams = Promise<{
  rodzaj?: string | string[];
}>;

function toRowItems(
  items: { title: string; summary: string | null; slug: string }[],
) {
  return items.map((item) => ({
    title: item.title,
    lead: item.summary,
    href: publicationPath(item.slug),
  }));
}

export default async function CzytelniaPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const [publications, categories] = await Promise.all([
    getPublications(),
    getReadingMethods(),
  ]);
  const available = formatsWithItems(publications);
  const rodzaj = resolvePublicationFormat(
    firstSearchParam(params.rodzaj),
    available,
  );
  const filtered = filterPublicationsByFormat(publications, rodzaj);
  const copy = SUBPAGE.czytelnia;
  const listing = groupPublicationsByCategory(
    filtered,
    categories,
    copy.sections.uncategorized,
  );

  return (
    <Section>
      <FilterRow
        label={copy.filters.formatLabel}
        chips={available.map((format) => ({
          href: czytelniaFilterHref(format),
          label: copy.filters.formats[format],
          current: rodzaj === format,
        }))}
      />
      {filtered.length === 0 ? (
        <p className="text-body">{copy.empty}</p>
      ) : listing.kind === "flat" ? (
        <div className="measure">
          <BlobStack items={toRowItems(listing.items)} />
        </div>
      ) : (
        <PublicationCategoryList
          groups={listing.groups.map((group) => ({
            slug: group.slug,
            title: group.title,
            items: toRowItems(group.items),
          }))}
          copy={copy.sections}
        />
      )}
    </Section>
  );
}
