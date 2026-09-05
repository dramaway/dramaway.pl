import type { Metadata } from "next";
import { BlobRow } from "@/components/sections/blob-row";
import { PageHero } from "@/components/sections/page-hero";
import { PaletteRow } from "@/components/visual/palette-row";
import { czytelniaPath, publicPathForProjectSlug } from "@/lib/routes";
import { getProjects } from "@/lib/sanity/fetch";
import type { ProjectListItem } from "@/lib/sanity/types";
import { SUBPAGE } from "@/lib/subpage-copy";

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
  const projects = await getProjects();
  const active = projects.filter(isActive);
  const archive = projects.filter((project) => !isActive(project));
  const heroImage = active[0]?.cover ?? archive[0]?.cover ?? null;
  const { projects: copy } = SUBPAGE;

  return (
    <>
      <PageHero
        title={copy.title}
        lead={copy.lead}
        ctaLabel={copy.ctaLabel}
        ctaHref={copy.ctaHref}
        image={heroImage}
      />
      <BlobRow
        items={[
          ...active.map(projectToRow),
          {
            title: copy.czytelnia.title,
            lead: copy.czytelnia.lead,
            href: czytelniaPath(),
            ctaLabel: copy.czytelnia.ctaLabel,
          },
        ]}
        emptyMessage="Brak aktywnych projektów w CMS."
      />
      <div className="page py-section">
        <PaletteRow />
      </div>
      <BlobRow
        heading="Zakończone projekty"
        items={archive.map(projectToRow)}
        density="compact"
        emptyMessage="Brak zakończonych projektów w CMS."
      />
    </>
  );
}
