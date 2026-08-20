import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageArticle } from "@/components/page-article";
import { FUNDACJA_PAGE_SLUGS, isFundacjaPageSlug } from "@/lib/routes";
import { getPageBySlug } from "@/lib/sanity/fetch";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export function generateStaticParams() {
  return FUNDACJA_PAGE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  return { title: page?.title ?? "O fundacji" };
}

export default async function FundacjaPage({ params }: Props) {
  const { slug } = await params;
  if (!isFundacjaPageSlug(slug)) notFound();
  const page = await getPageBySlug(slug);
  if (!page) notFound();
  return (
    <PageArticle page={page} parent={{ href: "/fundacja", label: "O fundacji" }} />
  );
}
