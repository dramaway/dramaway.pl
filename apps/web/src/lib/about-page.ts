import { cache } from "react";
import { getAboutPage, getPagesBySlugs, getPeople } from "./sanity/fetch";
import type {
  AboutDocumentItem,
  AboutHistoryItem,
  PersonListItem,
  ResolvedAboutDocument,
  ResolvedAboutHistoryItem,
  ResolvedAboutPage,
} from "./sanity/types";
import { publicPathForPageSlug } from "./routes";
import { SUBPAGE } from "./subpage-copy";

/** Pages listed on /fundacja when the CMS document list is empty. */
export const FALLBACK_ABOUT_DOCUMENT_SLUGS = [
  "statut",
  "sprawozdania",
  "jak-nas-wesprzec",
] as const;

function isExternalHref(href: string) {
  return /^(https?:)?\/\//i.test(href);
}

function resolveDocument(item: AboutDocumentItem): ResolvedAboutDocument | null {
  const fileUrl = item.file?.asset?.url?.trim();
  const pageSlug = item.page?.slug?.trim();
  const href = item.href?.trim();
  const title =
    item.title?.trim() ||
    item.page?.title?.trim() ||
    item.file?.asset?.originalFilename?.trim() ||
    "";

  if (fileUrl) {
    if (!title) return null;
    return { title, href: fileUrl, external: true };
  }
  if (pageSlug) {
    if (!title) return null;
    return {
      title,
      href: publicPathForPageSlug(pageSlug),
      external: false,
    };
  }
  if (href) {
    if (!title) return null;
    return { title, href, external: isExternalHref(href) };
  }
  return null;
}

function resolveHistoryItems(
  items: AboutHistoryItem[] | null | undefined,
): ResolvedAboutHistoryItem[] {
  if (!items?.length) return [];
  return items.flatMap((item) => {
    const year = item.year?.trim();
    const title = item.title?.trim();
    if (!year || !title) return [];
    return [
      {
        year,
        title,
        body: item.body?.trim() || null,
      },
    ];
  });
}

function resolvePeople(
  cmsPeople: PersonListItem[] | null | undefined,
  allPeople: PersonListItem[],
): PersonListItem[] {
  if (cmsPeople == null) return allPeople;
  return cmsPeople.filter((person): person is PersonListItem =>
    Boolean(person?.slug),
  );
}

export const getResolvedAboutPage = cache(
  async function getResolvedAboutPage(): Promise<ResolvedAboutPage> {
    const copy = SUBPAGE.fundacja;
    const [cms, allPeople, fallbackPages] = await Promise.all([
      getAboutPage(),
      getPeople(),
      getPagesBySlugs(FALLBACK_ABOUT_DOCUMENT_SLUGS),
    ]);

    const cmsValues =
      cms?.methods?.values
        ?.map((value) => value.label?.trim())
        .filter((label): label is string => Boolean(label)) ?? [];

    const cmsDocuments =
      cms?.documents?.items
        ?.map(resolveDocument)
        .filter((item): item is ResolvedAboutDocument => Boolean(item)) ?? [];

    const title = cms?.title?.trim() || copy.title;
    const methodsHeading = cms?.methods?.heading?.trim() || copy.methods.title;
    const methodsHref = cms?.methods?.ctaHref?.trim() || copy.methods.href;

    return {
      title,
      lead: cms?.lead?.trim() || copy.lead,
      ctaLabel: cms?.ctaLabel?.trim() || copy.ctaLabel,
      ctaHref: cms?.ctaHref?.trim() || copy.ctaHref,
      image: cms?.image ?? null,
      imageAlt: cms?.image?.alt?.trim() || title,
      methods: {
        heading: methodsHeading,
        lead: cms?.methods?.lead?.trim() || copy.methods.lead,
        ctaLabel: cms?.methods?.ctaLabel?.trim() || copy.methods.ctaLabel,
        ctaHref: methodsHref,
        values: cmsValues.length > 0 ? cmsValues : [...copy.values],
      },
      team: {
        heading: cms?.team?.heading?.trim() || copy.teamHeading,
        ctaLabel: cms?.team?.ctaLabel?.trim() || copy.teamCta,
        people: resolvePeople(cms?.team?.people, allPeople),
        emptyMessage: copy.teamEmpty,
      },
      history: {
        heading: cms?.history?.heading?.trim() || copy.history.heading,
        lead: cms?.history?.lead?.trim() || null,
        items: resolveHistoryItems(cms?.history?.items),
      },
      documents: {
        heading: cms?.documents?.heading?.trim() || copy.documents.heading,
        items:
          cmsDocuments.length > 0
            ? cmsDocuments
            : fallbackPages.map((page) => ({
                title: page.title,
                href: publicPathForPageSlug(page.slug),
                external: false,
              })),
        emptyMessage: copy.documents.empty,
      },
    };
  },
);
