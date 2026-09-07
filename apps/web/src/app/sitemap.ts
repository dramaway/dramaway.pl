import type { MetadataRoute } from "next";
import {
  editionPath,
  knowledgeHubPath,
  methodsPath,
  personPath,
  projectPath,
  publicationPath,
  publicPathForPageSlug,
} from "@/lib/routes";
import {
  getPageSlugs,
  getPersonSlugs,
  getProjectEditionParams,
  getPublicationSlugs,
} from "@/lib/sanity/fetch";
import { siteIndexingEnabled, siteOrigin } from "@/lib/site-url";

const HUBS = [
  "/",
  "/projekty",
  knowledgeHubPath(),
  methodsPath(),
  "/czytelnia",
  "/fundacja",
  "/kontakt",
  "/zespol",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!siteIndexingEnabled()) return [];

  const origin = siteOrigin();
  const [pageSlugs, personSlugs, publicationSlugs, projects] =
    await Promise.all([
      getPageSlugs(),
      getPersonSlugs(),
      getPublicationSlugs(),
      getProjectEditionParams(),
    ]);

  const paths = new Set<string>(HUBS);

  for (const slug of pageSlugs) {
    if (slug) paths.add(publicPathForPageSlug(slug));
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
