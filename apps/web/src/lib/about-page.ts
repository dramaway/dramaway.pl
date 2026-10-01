import { cache } from "react";
import { cmsCta, cmsText } from "./cms-text";
import { resolveHeroSlides } from "./hero-slides";
import { safeHref } from "./safe-url";
import { getAboutPage } from "./sanity/fetch";
import type {
  AboutDocumentItem,
  AboutHistoryItem,
  PersonListItem,
  PortableContent,
  ResolvedAboutDocument,
  ResolvedAboutHistoryItem,
  ResolvedAboutPage,
} from "./sanity/types";
import { publicPathForPage } from "./routes";

function resolveDocument(item: AboutDocumentItem): ResolvedAboutDocument | null {
  const fileUrl = safeHref(item.file?.asset?.url);
  const pageSlug = item.page?.slug?.trim();
  const href = safeHref(item.href);
  const title =
    cmsText(item.title) ||
    cmsText(item.page?.title) ||
    cmsText(item.file?.asset?.originalFilename);

  if (fileUrl) {
    if (!title) return null;
    return { title, href: fileUrl.href, external: fileUrl.kind === "http" };
  }
  if (pageSlug) {
    if (!title) return null;
    return {
      title,
      href: publicPathForPage({ slug: pageSlug }),
      external: false,
    };
  }
  if (href) {
    if (!title) return null;
    return { title, href: href.href, external: href.kind === "http" };
  }
  return null;
}

function resolveHistoryItems(
  items: AboutHistoryItem[] | null | undefined,
): ResolvedAboutHistoryItem[] {
  if (!items?.length) return [];
  return items.flatMap((item) => {
    const year = cmsText(item.year);
    const title = cmsText(item.title);
    if (!year || !title) return [];
    return [
      {
        year,
        title,
        body: cmsText(item.body),
      },
    ];
  });
}

function resolvePeople(
  cmsPeople: PersonListItem[] | null | undefined,
): PersonListItem[] {
  if (!cmsPeople?.length) return [];
  return cmsPeople.filter((person): person is PersonListItem =>
    Boolean(person?.slug),
  );
}

/** Portable Text, or a leftover plain string from before the schema change. */
function resolvePortable(
  value: PortableContent | string | null | undefined,
): PortableContent | null {
  if (Array.isArray(value) && value.length > 0) return value;
  if (typeof value === "string") {
    const text = value.trim();
    if (!text) return null;
    return [
      {
        _type: "block",
        _key: "legacy-text",
        style: "normal",
        markDefs: [],
        children: [{ _type: "span", _key: "legacy-span", text, marks: [] }],
      },
    ];
  }
  return null;
}

export const getResolvedAboutPage = cache(
  async function getResolvedAboutPage(): Promise<ResolvedAboutPage> {
    const cms = await getAboutPage();

    const cmsValues =
      cms?.methods?.values
        ?.map((value) => cmsText(value.label))
        .filter((label): label is string => Boolean(label)) ?? [];

    const cmsDocuments =
      cms?.documents?.items
        ?.map(resolveDocument)
        .filter((item): item is ResolvedAboutDocument => Boolean(item)) ?? [];

    const title = cmsText(cms?.title);
    const methodsCta = cmsCta(cms?.methods?.ctaLabel, cms?.methods?.ctaHref);
    const heroCta = cmsCta(cms?.ctaLabel, cms?.ctaHref);
    const teamPeople = resolvePeople(cms?.team?.people);

    return {
      title,
      lead: cmsText(cms?.lead),
      ctaLabel: heroCta?.label ?? null,
      ctaHref: heroCta?.href ?? null,
      slides: resolveHeroSlides(cms?.heroImages, cms?.image, title || ""),
      methods: {
        heading: cmsText(cms?.methods?.heading),
        lead: cmsText(cms?.methods?.lead),
        ctaLabel: methodsCta?.label ?? null,
        ctaHref: methodsCta?.href ?? null,
        values: cmsValues,
      },
      team: {
        heading: cmsText(cms?.team?.heading),
        ctaLabel: cmsText(cms?.team?.ctaLabel),
        body: resolvePortable(cms?.team?.body),
        people: teamPeople,
      },
      history: {
        heading: cmsText(cms?.history?.heading),
        lead: resolvePortable(cms?.history?.lead),
        items: resolveHistoryItems(cms?.history?.items),
      },
      documents: {
        heading: cmsText(cms?.documents?.heading),
        items: cmsDocuments,
      },
    };
  },
);
