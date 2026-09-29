import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { NewsArticle } from "@/components/news-article";
import { PageArticle } from "@/components/page-article";
import {
  newsPublicSlug,
  NEWS_SLUG_PREFIX,
  projectPath,
  publicPathForPage,
} from "@/lib/routes";
import {
  getNewsBySlug,
  getNewsRoutes,
  getPageByPublicSlug,
  getPageRoutes,
  getProjectBySlug,
} from "@/lib/sanity/fetch";

type Props = { params: Promise<{ slug: string }> };

/** Dedicated routes. `/metody` redirects to `/baza-wiedzy`. `/kontakt` is its own view. */
const RESERVED = new Set(["metody", "kontakt"]);

export const revalidate = 60;

export async function generateStaticParams() {
  const [pages, news] = await Promise.all([getPageRoutes(), getNewsRoutes()]);
  const slugs = new Set<string>();
  for (const page of [...pages, ...news]) {
    if (!page.slug || RESERVED.has(page.slug)) continue;
    slugs.add(newsPublicSlug(page.slug));
  }
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageByPublicSlug(slug);
  if (page) return { title: page.title };
  const news = await resolveNews(slug);
  return { title: news?.title ?? "Fundacja Drama Way" };
}

async function resolveNews(slug: string) {
  const direct = await getNewsBySlug(slug);
  if (direct) return direct;
  if (!slug.startsWith(NEWS_SLUG_PREFIX)) return null;
  return getNewsBySlug(newsPublicSlug(slug));
}

export default async function RootPage({ params }: Props) {
  const { slug } = await params;

  const project = await getProjectBySlug(slug);
  if (project) permanentRedirect(projectPath(slug));

  const page = await getPageByPublicSlug(slug);
  if (page) {
    const canonical = publicPathForPage(page);
    if (canonical !== `/${slug}`) permanentRedirect(canonical);
    return <PageArticle page={page} />;
  }

  const news = await resolveNews(slug);
  if (!news) notFound();
  const canonical = publicPathForPage({ slug: news.slug, isNews: true });
  if (canonical !== `/${slug}`) permanentRedirect(canonical);
  return <NewsArticle news={news} />;
}
