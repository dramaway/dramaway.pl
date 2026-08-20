import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { PageArticle } from "@/components/page-article";
import {
  fundacjaPath,
  isFundacjaPageSlug,
  isProjectDocumentSlug,
  isProjectSectionPageSlug,
  newsPublicSlug,
  NEWS_SLUG_PREFIX,
  projectPath,
} from "@/lib/routes";
import {
  getPageByPublicSlug,
  getPageSlugs,
  getProjectBySlug,
} from "@/lib/sanity/fetch";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getPageSlugs();
  return slugs
    .filter(Boolean)
    .filter(
      (slug) =>
        !isFundacjaPageSlug(slug) &&
        !isProjectSectionPageSlug(slug) &&
        !isProjectDocumentSlug(slug),
    )
    .map((slug) =>
      slug.startsWith(NEWS_SLUG_PREFIX)
        ? { slug: newsPublicSlug(slug) }
        : { slug },
    );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageByPublicSlug(slug);
  return { title: page?.title ?? "Fundacja Drama Way" };
}

export default async function RootPage({ params }: Props) {
  const { slug } = await params;

  if (isFundacjaPageSlug(slug)) redirect(fundacjaPath(slug));
  if (isProjectSectionPageSlug(slug) || isProjectDocumentSlug(slug)) {
    redirect(projectPath(slug));
  }

  const project = await getProjectBySlug(slug);
  if (project) redirect(projectPath(slug));

  const page = await getPageByPublicSlug(slug);
  if (!page) notFound();

  return <PageArticle page={page} />;
}
