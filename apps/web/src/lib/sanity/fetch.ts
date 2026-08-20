import "server-only";

import { sanityClient } from "./client";
import {
  contentCountsQuery,
  newsListQuery,
  pageBySlugQuery,
  pageSlugsQuery,
  pagesListQuery,
  peopleListQuery,
  personBySlugQuery,
  personSlugsQuery,
  projectBySlugQuery,
  projectSlugsQuery,
  projectsListQuery,
} from "./queries";
import type {
  ContentCounts,
  PageDetail,
  PageListItem,
  PersonDetail,
  PersonListItem,
  ProjectDetail,
  ProjectListItem,
} from "./types";

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
