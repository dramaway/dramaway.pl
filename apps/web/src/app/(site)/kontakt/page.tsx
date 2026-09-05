import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageArticle } from "@/components/page-article";
import { getPageBySlug } from "@/lib/sanity/fetch";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("kontakt");
  return { title: page?.title ?? "Kontakt" };
}

export default async function ContactPage() {
  const page = await getPageBySlug("kontakt");
  if (!page) notFound();
  return <PageArticle page={page} />;
}
