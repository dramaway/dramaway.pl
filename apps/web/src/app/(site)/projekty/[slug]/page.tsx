import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { ProjectArticle } from "@/components/project-article";
import {
  getPageBySlug,
  getProjectBySlug,
  getProjectSlugs,
} from "@/lib/sanity/fetch";
import { publicPathForPage } from "@/lib/routes";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.filter(Boolean).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (project) return { title: project.title };
  return { title: "Projekt" };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;

  const project = await getProjectBySlug(slug);
  if (project) return <ProjectArticle project={project} />;

  const page = await getPageBySlug(slug);
  if (page) permanentRedirect(publicPathForPage(page));

  notFound();
}
