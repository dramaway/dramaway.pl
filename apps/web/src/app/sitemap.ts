import type { MetadataRoute } from "next";
import {
  editionPath,
  knowledgeHubPath,
  personPath,
  projectPath,
  publicationPath,
  publicPathForPage,
} from "@/lib/routes";
import {
  getPageRoutes,
  getNewsRoutes,
  getPersonSlugs,
  getProjectEditionParams,
  getPublicationSlugs,
} from "@/lib/sanity/fetch";
import { siteIndexingEnabled, siteOrigin } from "@/lib/site-url";

const HUBS = [
  "/",
  "/projekty",
  knowledgeHubPath(),
  "/czytelnia",
  "/fundacja",
  "/kontakt",
  "/zespol",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!siteIndexingEnabled()) return [];

  const origin = siteOrigin();
  const [pages, news, personSlugs, publicationSlugs, projects] =
    await Promise.all([
      getPageRoutes(),
      getNewsRoutes(),
      getPersonSlugs(),
      getPublicationSlugs(),
      getProjectEditionParams(),
    ]);

  const paths = new Set<string>(HUBS);

  for (const page of pages) {
    if (page.slug) paths.add(publicPathForPage(page));
  }
  for (const item of news) {
    if (item.slug) paths.add(publicPathForPage({ slug: item.slug, isNews: true }));
  }
  for (const slug of personSlugs) {
    if (slug) paths.add(personPath(slug));
  }
  for (const slug of publicationSlugs) {
    if (slug) paths.add(publicationPath(slug));
  }
  for (const project of projects) {
    if (!project.slug) continue;
    paths.add(projectPath(project.slug));
    for (const editionSlug of project.editionSlugs ?? []) {
      if (editionSlug) paths.add(editionPath(project.slug, editionSlug));
    }
  }

  return [...paths].map((path) => ({
    url: path === "/" ? origin : `${origin}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));
}
