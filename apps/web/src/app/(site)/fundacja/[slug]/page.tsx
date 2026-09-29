import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { publicPathForPage } from "@/lib/routes";
import { getPageBySlug, getPageRoutes } from "@/lib/sanity/fetch";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

/** Old `/fundacja/{slug}` addresses. The page itself now lives at `/{slug}`. */
export async function generateStaticParams() {
  const pages = await getPageRoutes();
  return pages.filter((page) => page.slug).map((page) => ({ slug: page.slug }));
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
  permanentRedirect(publicPathForPage(page));
}
