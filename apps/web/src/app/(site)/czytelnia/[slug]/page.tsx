import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicationArticle } from "@/components/publication-article";
import {
  getPublicationBySlug,
  getPublicationSlugs,
} from "@/lib/sanity/fetch";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getPublicationSlugs();
  return slugs.filter(Boolean).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const publication = await getPublicationBySlug(slug);
  return { title: publication?.title ?? "Czytelnia" };
}

export default async function PublicationPage({ params }: Props) {
  const { slug } = await params;
  const publication = await getPublicationBySlug(slug);
  if (!publication) notFound();

  return <PublicationArticle publication={publication} />;
}
