import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { PageArticle } from "@/components/page-article";
import { ProjectArticle } from "@/components/project-article";
import {
  getPageBySlug,
  getPageRoutes,
  getProjectBySlug,
  getProjectSlugs,
} from "@/lib/sanity/fetch";
import { projectPath, publicPathForPage } from "@/lib/routes";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateStaticParams() {
  const [projectSlugs, pages] = await Promise.all([
    getProjectSlugs(),
    getPageRoutes(),
  ]);
  const slugs = new Set(projectSlugs.filter(Boolean));
  for (const page of pages) {
    if (page.slug && publicPathForPage(page) === projectPath(page.slug)) {
      slugs.add(page.slug);
    }
  }
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

  const project = await getProjectBySlug(slug);
  if (project) return <ProjectArticle project={project} />;

  const page = await getPageBySlug(slug);
  if (!page) notFound();

  const canonical = publicPathForPage(page);
  if (canonical !== projectPath(slug)) permanentRedirect(canonical);

  return <PageArticle page={page} parent={{ href: "/projekty", label: "Projekty" }} />;
}
