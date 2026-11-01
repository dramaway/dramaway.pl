import "server-only";

import { cache } from "react";

import { resolveContentSections } from "../content-sections";
import { sanityClient } from "./client";
import {
  aboutPageQuery,
  landingPageByIdQuery,
  contentFeedQuery,
  newsBySlugQuery,
  newsRoutesQuery,
  pageBySlugQuery,
  pageRoutesQuery,
  pagesBySlugsQuery,
  pagesListQuery,
  peopleListQuery,
  personBySlugQuery,
  personSlugsQuery,
  projectBySlugQuery,
  projectSlugsQuery,
  projectEditionParamsQuery,
  projectsListQuery,
  publicationBySlugQuery,
  publicationRoutesQuery,
  publicationSlugsQuery,
  publicationsListQuery,
  readingMethodsQuery,
  siteSettingsQuery,
} from "./queries";
import type {
  AboutPage,
  CmsContentSection,
  ContentFeedPool,
  LandingPage,
  PageDetail,
  PageListItem,
  PageRoute,
  NewsDetail,
  PersonDetail,
  PersonListItem,
  ProjectDetail,
  ProjectListItem,
  PublicationDetail,
  PublicationListItem,
  PublicationRoute,
  ReadingMethodListItem,
  SiteSettings,
} from "./types";
import { NEWS_SLUG_PREFIX } from "@/lib/routes";
import { SANITY_CACHE_TAG } from "./cache";

const revalidate = {
  next: { revalidate: 60, tags: [SANITY_CACHE_TAG] },
};

export async function getPeople(): Promise<PersonListItem[]> {
  return sanityClient.fetch(peopleListQuery, {}, revalidate);
}

export async function getPersonBySlug(
  slug: string,
): Promise<PersonDetail | null> {
  return sanityClient.fetch(personBySlugQuery, { slug }, revalidate);
}

export async function getPersonSlugs(): Promise<string[]> {
  return sanityClient.fetch(personSlugsQuery, {}, revalidate);
}

export async function getPages(): Promise<PageListItem[]> {
  return sanityClient.fetch(pagesListQuery, {}, revalidate);
}

export const getNewsBySlug = cache(async function getNewsBySlug(
  slug: string,
): Promise<NewsDetail | null> {
  return sanityClient.fetch<NewsDetail | null>(newsBySlugQuery, { slug }, revalidate);
});

export async function getNewsRoutes(): Promise<PageRoute[]> {
  return sanityClient.fetch(newsRoutesQuery, {}, revalidate);
}

/** Recent documents for configurable news-feed sections, newest first within each kind. */
export async function getContentFeed(): Promise<ContentFeedPool> {
  return sanityClient.fetch(contentFeedQuery, {}, revalidate);
}

export const getPageBySlug = cache(async function getPageBySlug(
  slug: string,
): Promise<PageDetail | null> {
  const page = await sanityClient.fetch<
    Omit<PageDetail, "sections" | "sectionsAfterBody"> & {
      sections?: CmsContentSection[] | null;
      sectionsAfterBody?: CmsContentSection[] | null;
    }
  >(pageBySlugQuery, { slug }, revalidate);
  if (!page) return null;
  return {
    ...page,
    sections: resolveContentSections(page.sections),
    sectionsAfterBody: resolveContentSections(page.sectionsAfterBody),
  };
});

/** Root Drupal aliases: try the slug, then the migrated `aktualnosc-` prefix. */
export async function getPageByPublicSlug(
  slug: string,
): Promise<PageDetail | null> {
  const direct = await getPageBySlug(slug);
  if (direct) return direct;
  return getPageBySlug(`${NEWS_SLUG_PREFIX}${slug}`);
}

export async function getPagesBySlugs(
  slugs: readonly string[],
): Promise<PageListItem[]> {
  const rows: PageListItem[] = await sanityClient.fetch(
    pagesBySlugsQuery,
    { slugs: [...slugs] },
    revalidate,
  );
  const bySlug = new Map(rows.map((row) => [row.slug, row]));
  return slugs
    .map((slug) => bySlug.get(slug))
    .filter((row): row is PageListItem => Boolean(row));
}

export const getSiteSettings = cache(async function getSiteSettings(): Promise<
  SiteSettings | null
> {
  return sanityClient.fetch(siteSettingsQuery, {}, revalidate);
});

export async function getAboutPage(): Promise<AboutPage | null> {
  return sanityClient.fetch(aboutPageQuery, {}, revalidate);
}

export const getLandingPage = cache(async function getLandingPage(
  id: string,
): Promise<LandingPage | null> {
  return sanityClient.fetch(landingPageByIdQuery, { id }, revalidate);
});

export async function getPageRoutes(): Promise<PageRoute[]> {
  return sanityClient.fetch(pageRoutesQuery, {}, revalidate);
}

export async function getProjects(): Promise<ProjectListItem[]> {
  return sanityClient.fetch(projectsListQuery, {}, revalidate);
}

export async function getProjectBySlug(
  slug: string,
): Promise<ProjectDetail | null> {
  return sanityClient.fetch(projectBySlugQuery, { slug }, revalidate);
}

export async function getProjectSlugs(): Promise<string[]> {
  return sanityClient.fetch(projectSlugsQuery, {}, revalidate);
}

export async function getProjectEditionParams(): Promise<
  { slug: string; editionSlugs: string[] | null }[]
> {
  return sanityClient.fetch(projectEditionParamsQuery, {}, revalidate);
}

export async function getPublications(): Promise<PublicationListItem[]> {
  return sanityClient.fetch(publicationsListQuery, {}, revalidate);
}

export async function getReadingMethods(): Promise<ReadingMethodListItem[]> {
  return sanityClient.fetch(readingMethodsQuery, {}, revalidate);
}

export async function getPublicationBySlug(
  slug: string,
): Promise<PublicationDetail | null> {
  return sanityClient.fetch(publicationBySlugQuery, { slug }, revalidate);
}

export async function getPublicationSlugs(): Promise<string[]> {
  return sanityClient.fetch(publicationSlugsQuery, {}, revalidate);
}

export async function getPublicationRoutes(): Promise<PublicationRoute[]> {
  return sanityClient.fetch(publicationRoutesQuery, {}, revalidate);
}
