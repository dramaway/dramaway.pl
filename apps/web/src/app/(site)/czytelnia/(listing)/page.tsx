import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
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
  const groups = groupPublicationsByCategory(
    filtered,
    categories,
    copy.sections.uncategorized,
  ).map((group) => ({
    slug: group.slug,
    title: group.title,
    items: group.items.map((item) => ({
      title: item.title,
      lead: item.summary,
      href: publicationPath(item.slug),
    })),
  }));

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
      {groups.length === 0 ? (
        <p className="text-body">{copy.empty}</p>
      ) : (
        <PublicationCategoryList groups={groups} copy={copy.sections} />
      )}
    </Section>
  );
}
