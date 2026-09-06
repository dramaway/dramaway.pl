import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { BlobRow } from "@/components/sections/blob-row";
import { FilterRow } from "@/components/sections/filter-row";
import { PageHero } from "@/components/sections/page-hero";
import {
  PUBLICATION_FORMATS,
  czytelniaFilterHref,
  filterPublications,
  firstSearchParam,
} from "@/lib/czytelnia-filters";
import { knowledgeHubPath, publicationPath } from "@/lib/routes";
import { getPublications, getReadingMethods } from "@/lib/sanity/fetch";
import { SUBPAGE } from "@/lib/subpage-copy";

export const metadata: Metadata = { title: "Czytelnia" };
export const revalidate = 60;

type SearchParams = Promise<{
  rodzaj?: string | string[];
  kategoria?: string | string[];
}>;

export default async function CzytelniaPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const rodzaj = firstSearchParam(params.rodzaj);
  const kategoria = firstSearchParam(params.kategoria);
  const [publications, categories] = await Promise.all([
    getPublications(),
    getReadingMethods(),
  ]);
  const filtered = filterPublications(publications, { rodzaj, kategoria });
  const filtersOn = Boolean(rodzaj || kategoria);
  const copy = SUBPAGE.czytelnia;

  return (
    <>
      <PageHero
        title="Czytelnia"
        lead="Publikacje z portalu wiedzy. Lista pokazuje pozycje oznaczone w CMS do spisu."
        parent={{ href: knowledgeHubPath(), label: "Baza wiedzy" }}
      />
      <Section>
        <FilterRow
          label={copy.filters.formatLabel}
          chips={[
            {
              href: czytelniaFilterHref({ kategoria }),
              label: copy.filters.all,
              current: !rodzaj,
            },
            ...PUBLICATION_FORMATS.map((format) => ({
              href: czytelniaFilterHref({ rodzaj: format, kategoria }),
              label: copy.filters.formats[format],
              current: rodzaj === format,
            })),
          ]}
        />
        <FilterRow
          label={copy.filters.categoryLabel}
          chips={[
            {
              href: czytelniaFilterHref({ rodzaj }),
              label: copy.filters.all,
              current: !kategoria,
            },
            ...categories
              .filter(
                (category): category is (typeof categories)[number] & {
                  slug: string;
                } => Boolean(category.slug),
              )
              .map((category) => ({
                href: czytelniaFilterHref({
                  rodzaj,
                  kategoria: category.slug,
                }),
                label: category.title,
                current: kategoria === category.slug,
              })),
          ]}
        />
      </Section>
      <BlobRow
        items={filtered.map((item) => ({
          title: item.title,
          lead: item.summary,
          href: publicationPath(item.slug),
        }))}
        emptyMessage={filtersOn ? copy.emptyFiltered : copy.empty}
      />
    </>
  );
}
