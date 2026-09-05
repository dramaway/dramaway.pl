import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageArticle } from "@/components/page-article";
import { knowledgeHubPath } from "@/lib/routes";
import { getPageBySlug } from "@/lib/sanity/fetch";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("metody");
  return { title: page?.title ?? "Metody" };
}

export default async function MethodsPage() {
  const page = await getPageBySlug("metody");
  if (!page) notFound();
  return (
    <PageArticle
      page={page}
      parent={{ href: knowledgeHubPath(), label: "Baza wiedzy" }}
    />
  );
}
