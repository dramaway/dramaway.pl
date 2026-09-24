import "server-only";

import { cache } from "react";

import { resolveContentSections } from "../content-sections";
import { sanityClient } from "./client";
import {
  aboutPageQuery,
  landingPageByIdQuery,
  homepageNewsQuery,
  newsListQuery,
  pageBySlugQuery,
  pageSlugsQuery,
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
  publicationSlugsQuery,
  publicationsListQuery,
  readingMethodsQuery,
  siteSettingsQuery,
} from "./queries";
import type {
  AboutPage,
  CmsContentSection,
  LandingPage,
  PageDetail,
  PageListItem,
  PersonDetail,
  PersonListItem,
  ProjectDetail,
  ProjectListItem,
  PublicationDetail,
  PublicationListItem,
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

export async function getNewsPages(): Promise<PageListItem[]> {
  return sanityClient.fetch(newsListQuery, {}, revalidate);
}

/** Latest news for the homepage: max 3, truncated excerpt, newest first. */
export async function getHomepageNews(): Promise<PageListItem[]> {
  return sanityClient.fetch(homepageNewsQuery, {}, revalidate);
}

export const getPageBySlug = cache(async function getPageBySlug(
  slug: string,
): Promise<PageDetail | null> {
  const page = await sanityClient.fetch<
    Omit<PageDetail, "sections"> & { sections?: CmsContentSection[] | null }
  >(pageBySlugQuery, { slug }, revalidate);
  if (!page) return null;
  return {
    ...page,
    sections: resolveContentSections(page.sections),
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

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return sanityClient.fetch(siteSettingsQuery, {}, revalidate);
}

export async function getAboutPage(): Promise<AboutPage | null> {
  return sanityClient.fetch(aboutPageQuery, {}, revalidate);
}

export const getLandingPage = cache(async function getLandingPage(
  id: string,
): Promise<LandingPage | null> {
  return sanityClient.fetch(landingPageByIdQuery, { id }, revalidate);
});

export async function getPageSlugs(): Promise<string[]> {
  return sanityClient.fetch(pageSlugsQuery, {}, revalidate);
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
