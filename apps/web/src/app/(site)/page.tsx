import type { Metadata } from "next";
import Link from "next/link";
import { ListingShell } from "@/components/article-shell";
import { getNewsPages, getProjects } from "@/lib/sanity/fetch";
import {
  newsPublicSlug,
  publicPathForPageSlug,
  publicPathForProjectSlug,
} from "@/lib/routes";
import { getResolvedSite } from "@/lib/site";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const site = await getResolvedSite();
  return {
    title: site.title,
    description: site.tagline ?? undefined,
  };
}

export default async function HomePage() {
  const [site, projects, news] = await Promise.all([
    getResolvedSite(),
    getProjects(),
    getNewsPages(),
  ]);
  const featured = projects.find((project) => project.featured) ?? projects[0];

  return (
    <ListingShell>
      <h1 className="text-4xl font-semibold tracking-tight">{site.title}</h1>
      {site.tagline ? (
        <p className="mt-3 text-lg text-muted-foreground">{site.tagline}</p>
      ) : null}

      {featured ? (
        <section className="mt-10 rounded-lg border p-6">
          <p className="text-sm text-muted-foreground">Projekt wyróżniony</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">
            <Link
              href={publicPathForProjectSlug(featured.slug)}
              className="hover:underline"
            >
              {featured.title}
            </Link>
          </h2>
          {featured.summary ? (
            <p className="mt-2 text-muted-foreground">{featured.summary}</p>
          ) : null}
          {featured.editionCount ? (
            <p className="mt-2 text-sm text-muted-foreground">
              {featured.editionCount} edycji
            </p>
          ) : null}
        </section>
      ) : null}

      <section className="mt-12">
        <h2 className="text-xl font-semibold">Projekty</h2>
        <ul className="mt-4 divide-y">
          {projects.map((project) => (
            <li key={project._id} className="py-3">
              <Link
                href={publicPathForProjectSlug(project.slug)}
                className="font-medium hover:underline"
              >
                {project.title}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4">
          <Link href="/projekty" className="text-sm underline underline-offset-2">
            Wszystkie projekty
          </Link>
        </p>
      </section>

      {news.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-xl font-semibold">Aktualności</h2>
          <ul className="mt-4 divide-y">
            {news.map((item) => (
              <li key={item._id} className="py-3">
                <Link
                  href={publicPathForPageSlug(item.slug)}
                  className="font-medium hover:underline"
                >
                  {item.title.replace(/^\[Aktualność\]\s*/i, "")}
                </Link>
                <span className="ml-2 text-xs text-muted-foreground">
                  /{newsPublicSlug(item.slug)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </ListingShell>
  );
}
