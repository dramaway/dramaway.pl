import type { Metadata } from "next";
import { BlobRow } from "@/components/sections/blob-row";
import { ContentModules } from "@/components/sections/content-modules";
import { PageHero } from "@/components/sections/page-hero";
import { DotBand } from "@/components/visual/dot-band";
import { publicPathForProjectSlug } from "@/lib/routes";
import { getProjects } from "@/lib/sanity/fetch";
import type { ProjectListItem } from "@/lib/sanity/types";
import { getProjectsLanding } from "@/lib/landing-page";

export const metadata: Metadata = { title: "Projekty" };
export const revalidate = 60;

function isActive(project: ProjectListItem) {
  return Boolean(project.featured) || project.status === "active";
}

function projectToRow(project: ProjectListItem) {
  return {
    title: project.title,
    lead: project.summary,
    href: publicPathForProjectSlug(project.slug),
  };
}

export default async function ProjectsPage() {
  const [projects, landing] = await Promise.all([
    getProjects(),
    getProjectsLanding(),
  ]);
  const active = projects.filter(isActive);
  const archive = projects.filter((project) => !isActive(project));
  const { czytelnia } = landing;
  const activeItems = [
    ...active.map(projectToRow),
    ...(czytelnia
      ? [
          {
            title: czytelnia.title,
            lead: czytelnia.lead,
            href: czytelnia.href,
            ctaLabel: czytelnia.ctaLabel,
            excerpt: true,
          },
        ]
      : []),
  ];

  return (
    <>
      <PageHero
        title={landing.title}
        lead={landing.lead}
        ctaLabel={landing.ctaLabel}
        ctaHref={landing.ctaHref}
        slides={landing.slides}
      />
      {landing.sections.length > 0 ? (
        <ContentModules sections={landing.sections} variant="page" />
      ) : (
        <BlobRow
          width="wide"
          items={activeItems}
          emptyMessage="Brak aktywnych projektów w CMS."
        />
      )}
      <DotBand />
      <BlobRow
        heading="Zakończone projekty"
        items={archive.map(projectToRow)}
        density="compact"
        emptyMessage="Brak zakończonych projektów w CMS."
      />
    </>
  );
}
