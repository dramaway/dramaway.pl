import { BlobRow } from "@/components/sections/blob-row";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/layout/section";
import { PortableBody } from "@/components/portable-body";
import { DotBand } from "@/components/visual/dot-band";
import { editionPath } from "@/lib/routes";
import type { ProjectDetail } from "@/lib/sanity/types";

export function ProjectArticle({ project }: { project: ProjectDetail }) {
  const editions = (project.editions ?? []).filter((edition) => edition.slug);
  const rows = editions.map((edition) => ({
    title: edition.title,
    lead: edition.summary?.trim() || edition.years || null,
    href: editionPath(project.slug, edition.slug),
  }));

  return (
    <>
      <PageHero
        title={project.title}
        lead={project.summary}
        parent={{ href: "/projekty", label: "Projekty" }}
      />
      {project.body ? (
        <Section>
          <div className="measure">
            <PortableBody value={project.body} />
          </div>
        </Section>
      ) : null}
      {editions.length > 0 ? (
        <>
          <DotBand />
          <BlobRow heading="Edycje" items={rows} />
        </>
      ) : null}
      {project.partners && project.partners.length > 0 ? (
        <Section>
          <h2 className="font-display text-h3 font-black">Partnerzy</h2>
          <ul className="mt-8 list-disc space-y-1 pl-6 text-body">
            {project.partners.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </Section>
      ) : null}
      {project.afterword ? (
        <Section>
          <div className="measure">
            <PortableBody value={project.afterword} />
          </div>
        </Section>
      ) : null}
    </>
  );
}
