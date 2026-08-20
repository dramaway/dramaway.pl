import "server-only";

import { sanityClient } from "./client";
import {
  contentCountsQuery,
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
  projectsListQuery,
  siteSettingsQuery,
} from "./queries";
import type {
  ContentCounts,
  PageDetail,
  PageListItem,
  PersonDetail,
  PersonListItem,
  ProjectDetail,
  ProjectListItem,
  SiteSettings,
} from "./types";
import { NEWS_SLUG_PREFIX } from "@/lib/routes";

const revalidate = { next: { revalidate: 60 } };

export async function getContentCounts(): Promise<ContentCounts> {
  return sanityClient.fetch(contentCountsQuery, {}, revalidate);
}

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

export async function getPageBySlug(slug: string): Promise<PageDetail | null> {
  return sanityClient.fetch(pageBySlugQuery, { slug }, revalidate);
}

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
