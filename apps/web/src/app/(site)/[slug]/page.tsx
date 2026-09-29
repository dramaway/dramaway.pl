import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { PageArticle } from "@/components/page-article";
import {
  newsPublicSlug,
  NEWS_SLUG_PREFIX,
  projectPath,
  publicPathForPage,
} from "@/lib/routes";
import {
  getPageByPublicSlug,
  getPageRoutes,
  getProjectBySlug,
} from "@/lib/sanity/fetch";

type Props = { params: Promise<{ slug: string }> };

/** Dedicated routes. `/metody` redirects to `/baza-wiedzy`. `/kontakt` is its own view. */
const RESERVED = new Set(["metody", "kontakt"]);

export const revalidate = 60;

export async function generateStaticParams() {
  const pages = await getPageRoutes();
  return pages.flatMap((page) => {
    if (!page.slug || RESERVED.has(page.slug)) return [];
    const publicSlug = page.slug.startsWith(NEWS_SLUG_PREFIX)
      ? newsPublicSlug(page.slug)
      : page.slug;
    if (publicPathForPage(page) !== `/${publicSlug}`) return [];
    return [{ slug: publicSlug }];
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageByPublicSlug(slug);
  return { title: page?.title ?? "Fundacja Drama Way" };
}

export default async function RootPage({ params }: Props) {
  const { slug } = await params;

  const project = await getProjectBySlug(slug);
  if (project) permanentRedirect(projectPath(slug));

  const page = await getPageByPublicSlug(slug);
  if (!page) notFound();

  const canonical = publicPathForPage(page);
  if (canonical !== `/${slug}`) permanentRedirect(canonical);

  return <PageArticle page={page} />;
}
