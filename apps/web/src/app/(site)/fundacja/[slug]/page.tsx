import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { PageArticle } from "@/components/page-article";
import { fundacjaPath, publicPathForPage } from "@/lib/routes";
import { getPageBySlug, getPageRoutes } from "@/lib/sanity/fetch";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateStaticParams() {
  const pages = await getPageRoutes();
  return pages
    .filter((page) => page.slug && publicPathForPage(page) === fundacjaPath(page.slug))
    .map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  return { title: page?.title ?? "O fundacji" };
}

export default async function FundacjaPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) notFound();

  const canonical = publicPathForPage(page);
  if (canonical !== fundacjaPath(slug)) permanentRedirect(canonical);

  return (
    <PageArticle page={page} parent={{ href: "/fundacja", label: "O fundacji" }} />
  );
}
