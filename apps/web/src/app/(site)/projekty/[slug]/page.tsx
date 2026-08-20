import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageArticle } from "@/components/page-article";
import { ProjectArticle } from "@/components/project-article";
import {
  getPageBySlug,
  getPageSlugs,
  getProjectBySlug,
  getProjectSlugs,
} from "@/lib/sanity/fetch";
import {
  isFundacjaPageSlug,
  isProjectDocumentSlug,
  isProjectSectionPageSlug,
} from "@/lib/routes";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateStaticParams() {
  const [projectSlugs, pageSlugs] = await Promise.all([
    getProjectSlugs(),
    getPageSlugs(),
  ]);
  const slugs = new Set([
    ...projectSlugs.filter(Boolean),
    ...pageSlugs.filter(
      (slug) =>
        isProjectSectionPageSlug(slug) || isProjectDocumentSlug(slug),
    ),
  ]);
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (project) return { title: project.title };
  const page = await getPageBySlug(slug);
  return { title: page?.title ?? "Projekt" };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  if (isFundacjaPageSlug(slug)) notFound();

  const project = await getProjectBySlug(slug);
  if (project) return <ProjectArticle project={project} />;

  const page = await getPageBySlug(slug);
  if (page) {
    return <PageArticle page={page} parent={{ href: "/projekty", label: "Projekty" }} />;
  }

  notFound();
}
