import { BlobRow } from "@/components/sections/blob-row";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/layout/section";
import { PortableBody } from "@/components/portable-body";
import { DotBand } from "@/components/visual/dot-band";
import { editionHeading } from "@/lib/edition-label";
import { splitIntroAndVideo } from "@/lib/portable-split";
import { editionPath } from "@/lib/routes";
import type { ProjectDetail } from "@/lib/sanity/types";
import { SUBPAGE } from "@/lib/subpage-copy";

export function ProjectArticle({ project }: { project: ProjectDetail }) {
  const editions = (project.editions ?? []).filter((edition) => edition.slug);
  const rows = editions.map((edition) => ({
    title: editionHeading(edition),
    lead: edition.summary?.trim() || edition.years || null,
    href: editionPath(project.slug, edition.slug),
    ctaLabel: SUBPAGE.artGeneracje.editionCta,
  }));
  const { intro, youtube, rest } = splitIntroAndVideo(project.body);
  const copy = SUBPAGE.artGeneracje;

  return (
    <>
      <PageHero
        title={project.title}
        lead={copy.lead}
        ctaLabel={editions.length > 0 ? copy.ctaLabel : null}
        ctaHref={editions.length > 0 ? copy.ctaHref : null}
        image={project.cover}
        parent={{ href: "/projekty", label: "Projekty" }}
      />
      {intro ? (
        <Section>
          <div className="measure">
            <PortableBody value={intro} />
          </div>
        </Section>
      ) : null}
      {youtube ? (
        <Section>
          <PortableBody value={youtube} />
        </Section>
      ) : null}
      {editions.length > 0 ? (
        <>
          <DotBand />
          <BlobRow
            heading={copy.editionsHeading}
            headingId="edycje"
            items={rows}
          />
        </>
      ) : null}
      {rest ? (
        <Section>
          <div className="measure">
            <PortableBody value={rest} />
          </div>
        </Section>
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
