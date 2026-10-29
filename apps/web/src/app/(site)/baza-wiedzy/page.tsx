import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageArticle } from "@/components/page-article";
import { Section } from "@/components/layout/section";
import { DotBand } from "@/components/visual/dot-band";
import {
  CzytelniaStack,
  type CzytelniaRowItem,
} from "@/components/sections/czytelnia-stack";
import { FilterRow } from "@/components/sections/filter-row";
import { PublicationCategories } from "@/components/sections/publication-categories";
import {
  UNCATEGORIZED_CATEGORY_SLUG,
  czytelniaFilterHref,
  filterPublicationsByFormat,
  firstSearchParam,
  formatsWithItems,
  groupPublicationsByCategory,
  orderFeaturedPublications,
  resolvePublicationCategory,
  resolvePublicationFormat,
} from "@/lib/czytelnia-filters";
import {
  publicationDestination,
  publicationListLead,
} from "@/lib/publication-destination";
import { LIBRARY_ANCHOR, publicationPath } from "@/lib/routes";
import { safeHrefString } from "@/lib/safe-url";
import {
  getPageBySlug,
  getPublications,
  getReadingMethods,
} from "@/lib/sanity/fetch";
import { hasHeroImage } from "@/lib/sanity/image";
import type { PublicationListItem } from "@/lib/sanity/types";
import { LIST_CTA_LABEL, SUBPAGE } from "@/lib/subpage-copy";

export const metadata: Metadata = { title: "Baza wiedzy" };
export const revalidate = 60;

type SearchParams = Promise<{
  rodzaj?: string | string[];
  kategoria?: string | string[];
}>;

function toCzytelniaRows(items: PublicationListItem[]): CzytelniaRowItem[] {
  return items.map((item) => {
    const fileHref = safeHrefString(item.file?.asset?.url);
    const destination = publicationDestination({
      format: item.format,
      hasFile: Boolean(fileHref),
      hasVideo: Boolean(item.hasVideo),
    });
    const external = destination === "file" && Boolean(fileHref);
    return {
      title: item.title,
      lead: publicationListLead({
        destination,
        summary: item.summary,
        bodyText: item.bodyText,
      }),
      href: external && fileHref ? fileHref : publicationPath(item.slug),
      ctaLabel: external ? SUBPAGE.czytelnia.pdfCta : LIST_CTA_LABEL,
      external,
      cover: hasHeroImage(item.cover) ? item.cover : null,
    };
  });
}

export default async function KnowledgeHubPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const [page, publications, categories] = await Promise.all([
    getPageBySlug("baza-wiedzy"),
    getPublications(),
    getReadingMethods(),
  ]);
  if (!page) notFound();
  const featured = orderFeaturedPublications(
    publications,
    page.featuredPublicationIds,
  );
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
  const knownCategorySlugs = [
    ...categories
      .map((category) => category.slug)
      .filter((slug): slug is string => Boolean(slug)),
    UNCATEGORIZED_CATEGORY_SLUG,
  ];
  const kategoriaParam = resolvePublicationCategory(
    firstSearchParam(params.kategoria),
    knownCategorySlugs,
  );
  const focusedSlug =
    listing.kind === "grouped"
      ? resolvePublicationCategory(
          kategoriaParam,
          listing.groups.map((group) => group.slug),
        )
      : undefined;

  return (
    <>
      <PageArticle
        page={{
          ...page,
          heroCtaLabel: copy.libraryCta,
          heroCtaHref: `#${LIBRARY_ANCHOR}`,
        }}
      />
      {featured.length > 0 ? (
        <>
          <DotBand className="library-dot-band" />
          <Section className="library-section">
            <h2 className="font-display text-h2 font-black">
              {copy.featuredHeading}
            </h2>
            <div className="stack-wide mt-5">
              <CzytelniaStack items={toCzytelniaRows(featured)} />
            </div>
          </Section>
          <DotBand className="library-dot-band" />
        </>
      ) : null}
      <Section id="pelna-biblioteka" className="library-section scroll-mt-24">
        <h2 className="font-display text-h2 font-black">
          {copy.heading}
        </h2>
        <FilterRow
          label={copy.filters.formatLabel}
          chips={available.map((format) => ({
            href: czytelniaFilterHref({
              rodzaj: format,
              kategoria: kategoriaParam,
            }),
            label: copy.filters.formats[format],
            current: rodzaj === format,
          }))}
        />
        {filtered.length === 0 ? (
          <p className="text-body">{copy.empty}</p>
        ) : listing.kind === "flat" ? (
          <div className="stack-wide">
            <CzytelniaStack items={toCzytelniaRows(listing.items)} />
          </div>
        ) : (
          <PublicationCategories
            groups={listing.groups.map((group) => ({
              slug: group.slug,
              title: group.title,
              items: toCzytelniaRows(group.items),
            }))}
            rodzaj={rodzaj}
            focusedSlug={focusedSlug}
            allLabel={copy.sections.all}
            navLabel={copy.sections.navLabel}
          />
        )}
      </Section>
    </>
  );
}
