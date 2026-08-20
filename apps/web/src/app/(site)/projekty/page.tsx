import type { Metadata } from "next";
import Link from "next/link";
import { ListingShell } from "@/components/article-shell";
import {
  PROJECT_SECTION_PAGE_SLUGS,
  publicPathForPageSlug,
  publicPathForProjectSlug,
} from "@/lib/routes";
import { getPagesBySlugs, getProjects } from "@/lib/sanity/fetch";

export const metadata: Metadata = { title: "Projekty" };
export const revalidate = 60;

const listingPageSlugs = PROJECT_SECTION_PAGE_SLUGS.filter(
  (slug) => slug !== "art-generacje-0",
);

export default async function ProjectsPage() {
  const [projects, extraPages] = await Promise.all([
    getProjects(),
    getPagesBySlugs(listingPageSlugs),
  ]);

  return (
    <ListingShell>
      <h1 className="text-3xl font-semibold tracking-tight">Projekty</h1>
      {projects.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">
          Brak dokumentów projektu w CMS.
        </p>
      ) : (
        <ul className="mt-8 divide-y">
          {projects.map((project) => (
            <li key={project._id} className="py-4">
              <Link
                href={publicPathForProjectSlug(project.slug)}
                className="font-medium hover:underline"
              >
                {project.title}
              </Link>
              <p className="mt-1 text-sm text-muted-foreground">
                {project.featured ? "wyróżniony · " : ""}
                {project.status === "active"
                  ? "aktywny"
                  : project.status === "archive" || project.status === "completed"
                    ? "archiwum"
                    : ""}
                {project.editionCount ? ` · ${project.editionCount} edycji` : ""}
              </p>
              {project.summary ? (
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {project.summary}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      {extraPages.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-xl font-semibold">Więcej</h2>
          <ul className="mt-4 divide-y">
            {extraPages.map((page) => (
              <li key={page._id} className="py-3">
                <Link
                  href={publicPathForPageSlug(page.slug)}
                  className="font-medium hover:underline"
                >
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </ListingShell>
  );
}
