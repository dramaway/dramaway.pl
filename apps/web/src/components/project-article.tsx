import { BlobRow } from "@/components/sections/blob-row";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/layout/section";
import { PortableBody } from "@/components/portable-body";
import { FoldList, type FoldListItem } from "@/components/visual/fold-list";
import { PaletteRow } from "@/components/visual/palette-row";
import { editionHeading } from "@/lib/edition-label";
import { sortEditionsNewestFirst } from "@/lib/edition-sort";
import {
  splitIntroAndVideo,
  splitPortableByHeading,
  type PortableHeadingSection,
} from "@/lib/portable-split";
import { editionPath } from "@/lib/routes";
import type { ProjectDetail } from "@/lib/sanity/types";
import { SUBPAGE } from "@/lib/subpage-copy";

const PARTNERS_HEADING = "Partnerzy";
const SPONSORS_HEADING = "Sponsorzy";

function headingKey(title: string) {
  return title.replace(/\s+/g, " ").trim().toLowerCase();
}

function namesList(names: string[]) {
  return (
    <ul className="mt-8 list-disc space-y-1 pl-6 text-body">
      {names.map((name, index) => (
        <li key={`${name}-${index}`}>{name}</li>
      ))}
    </ul>
  );
}

/**
 * Fold panels from afterword H2s plus `partners` / `sponsors`.
 * A non-empty array field wins over a matching afterword H2 (no duplicate lists).
 */
function projectFoldItems(
  project: ProjectDetail,
  sections: PortableHeadingSection[],
): FoldListItem[] {
  const partners = (project.partners ?? []).filter((name) => name.trim());
  const sponsors = (project.sponsors ?? []).filter((name) => name.trim());
  const items: FoldListItem[] = [];
  let partnersUsed = false;
  let sponsorsUsed = false;

  for (const section of sections) {
    const key = headingKey(section.title);
    if (key === headingKey(PARTNERS_HEADING) && partners.length > 0) {
      if (!partnersUsed) {
        items.push({ title: PARTNERS_HEADING, children: namesList(partners) });
        partnersUsed = true;
      }
      continue;
    }
    if (key === headingKey(SPONSORS_HEADING) && sponsors.length > 0) {
      if (!sponsorsUsed) {
        items.push({ title: SPONSORS_HEADING, children: namesList(sponsors) });
        sponsorsUsed = true;
      }
      continue;
    }
    if (section.blocks.length === 0) continue;
    items.push({
      title: section.title,
      children: <PortableBody value={section.blocks} />,
    });
  }

  if (partners.length > 0 && !partnersUsed) {
    items.push({ title: PARTNERS_HEADING, children: namesList(partners) });
  }
  if (sponsors.length > 0 && !sponsorsUsed) {
    items.push({ title: SPONSORS_HEADING, children: namesList(sponsors) });
  }

  return items;
}

export function ProjectArticle({ project }: { project: ProjectDetail }) {
  const editions = sortEditionsNewestFirst(project.editions ?? []).filter(
    (edition) => edition.slug,
  );
  const rows = editions.map((edition) => ({
    title: editionHeading(edition),
    lead: edition.summary?.trim() || edition.years || null,
    href: editionPath(project.slug, edition.slug),
    ctaLabel: SUBPAGE.artGeneracje.editionCta,
  }));
  const { intro, youtube, rest } = splitIntroAndVideo(project.body);
  const copy = SUBPAGE.artGeneracje;
  const isArtGeneracje = project.slug === "art-generacje";
  const { preamble, sections } = splitPortableByHeading(project.afterword);
  const foldItems = projectFoldItems(project, sections);

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
      {!isArtGeneracje && intro ? (
        <Section>
          <div className="measure">
            <PortableBody value={intro} />
          </div>
        </Section>
      ) : null}
      {youtube ? (
        <Section>
          <div className="stack-wide">
            <PortableBody value={youtube} />
          </div>
        </Section>
      ) : null}
      {isArtGeneracje ? (
        <div className="page py-section">
          <PaletteRow />
        </div>
      ) : null}
      {editions.length > 0 ? (
        <section id="edycje" aria-label={copy.editionsHeading}>
          <BlobRow width="wide" items={rows} />
        </section>
      ) : null}
      {rest ? (
        <Section>
          <div className="measure">
            <PortableBody value={rest} />
          </div>
        </Section>
      ) : null}
      {preamble || foldItems.length > 0 ? (
        <Section>
          <div className="measure">
            {preamble ? <PortableBody value={preamble} /> : null}
            <FoldList items={foldItems} />
          </div>
        </Section>
      ) : null}
    </>
  );
}
