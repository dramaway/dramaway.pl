import { BlobRow } from "@/components/sections/blob-row";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/layout/section";
import { PortableBody, hasPortableContent } from "@/components/portable-body";
import { FoldList, type FoldListItem } from "@/components/visual/fold-list";
import { Blob } from "@/components/visual/blob";
import { projectEditionHeading } from "@/lib/edition-label";
import { sortEditionsNewestFirst } from "@/lib/edition-sort";
import {
  splitPortableByHeading,
  splitPortableByTerm,
  type PortableHeadingSection,
} from "@/lib/portable-split";
import { resolveHeroSlides } from "@/lib/hero-slides";
import { hasHeroImage } from "@/lib/sanity/image";
import { editionPath } from "@/lib/routes";
import type { HeroSlide, ProjectDetail } from "@/lib/sanity/types";
import { SUBPAGE } from "@/lib/subpage-copy";

const PARTNERS_HEADING = "Partnerzy";
const SPONSORS_HEADING = "Sponsorzy";

/**
 * `heroImages` wins. An empty list keeps the existing still: the first
 * edition-gallery image, otherwise the first image in the body.
 */
function projectHeroSlides(project: ProjectDetail): HeroSlide[] {
  const listed = resolveHeroSlides(project.heroImages, project.title);
  if (listed.length > 0) return listed;
  return resolveHeroSlides(project.cover ? [project.cover] : [], project.title);
}

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
  const isArtGeneracje = project.slug === "art-generacje";
  const isTeatrCodzienny = project.slug === "teatr-codzienny";
  const usesThumbnailListing = isArtGeneracje || isTeatrCodzienny;
  const projectBodyParts = isArtGeneracje
    ? splitPortableByTerm(project.body)
    : null;
  const rows = editions.map((edition) => ({
    title: projectEditionHeading(project.slug, edition),
    titleLanguage: edition.titleLanguage,
    lead: edition.summary?.trim() || null,
    href: editionPath(project.slug, edition.slug),
    ctaLabel: SUBPAGE.artGeneracje.editionCta,
    image: isArtGeneracje
      ? (edition.gallery?.find((image) => hasHeroImage(image)) ?? null)
      : isTeatrCodzienny
        ? (edition.gallery?.find((image) => hasHeroImage(image)) ??
          edition.outcomes?.find((outcome) => hasHeroImage(outcome.image))
            ?.image ??
          null)
        : null,
  }));
  const { preamble, sections } = splitPortableByHeading(project.afterword);
  const foldItems = projectFoldItems(project, sections);
  const copy = SUBPAGE.artGeneracje;

  return (
    <>
      <PageHero
        title={project.title}
        titleLanguage={project.titleLanguage}
        lead={project.summary?.trim() || null}
        textAlign={project.heroTextAlign}
        ctaLabel={editions.length > 0 ? copy.ctaLabel : null}
        ctaHref={editions.length > 0 ? copy.ctaHref : null}
        slides={projectHeroSlides(project)}
        parent={{ href: "/projekty", label: "Projekty" }}
      />
      {hasPortableContent(project.body) ? (
        <Section
          className={
            isArtGeneracje
              ? "project-article-copy project-article-copy-art-generacje"
              : isTeatrCodzienny
              ? "project-article-copy"
              : undefined
          }
        >
          <div className="article-body">
            {projectBodyParts ? (
              <div className="project-art-generacje-body-flow">
                {projectBodyParts.map((part, index) =>
                  part.kind === "term" ? (
                    <section
                      key={`term-${index}`}
                      className="project-art-generacje-editorial-section"
                    >
                      <h2 className="project-art-generacje-term-heading">
                        {part.title}
                        <span
                          className="project-text-section-dots"
                          aria-hidden="true"
                        >
                          <i />
                          <i />
                          <i />
                          <i />
                        </span>
                      </h2>
                      {part.blocks.length > 0 ? (
                        <div className="project-art-generacje-term-copy">
                          <PortableBody value={part.blocks} />
                        </div>
                      ) : null}
                    </section>
                  ) : (
                    <div
                      key={`blocks-${index}`}
                      className="project-art-generacje-body-block"
                    >
                      <PortableBody value={part.blocks} />
                    </div>
                  ),
                )}
              </div>
            ) : (
              <PortableBody value={project.body} />
            )}
          </div>
        </Section>
      ) : null}
      {project.sectionsBeforeEditions?.some(
        (section) => section.heading?.trim() && section.text?.trim(),
      ) ? (
        <Section>
          <div
            className={`project-text-sections${isArtGeneracje ? " project-text-sections-art-generacje" : ""}`}
          >
            {project.sectionsBeforeEditions.map((section) => {
              const heading = section.heading?.trim();
              const text = section.text?.trim();
              if (!heading || !text) return null;
              return (
                <section key={section._key} className="project-text-section">
                  <Blob className="project-text-section-blob" />
                  <div className="project-text-section-content">
                    <h2
                      className={`blob-row-label project-text-section-heading${section.headingColor === "black" ? " project-text-section-heading-black" : ""}`}
                    >
                      {heading}
                      {isArtGeneracje ? (
                        <span
                          className="project-text-section-dots"
                          aria-hidden="true"
                        >
                          <i />
                          <i />
                          <i />
                          <i />
                        </span>
                      ) : null}
                    </h2>
                    <p className="project-text-section-copy">{text}</p>
                  </div>
                </section>
              );
            })}
          </div>
        </Section>
      ) : null}
      {hasPortableContent(project.bodyAfterTextSections) ? (
        <Section
          className={
            isArtGeneracje || isTeatrCodzienny
              ? "project-article-copy"
              : undefined
          }
        >
          <div className="article-body">
            <PortableBody value={project.bodyAfterTextSections} />
          </div>
        </Section>
      ) : null}
      {editions.length > 0 ? (
        <section id="edycje" aria-label={copy.editionsHeading}>
          <BlobRow
            width="wide"
            heading={
              isArtGeneracje
                ? project.editionsHeading?.trim()
                : isTeatrCodzienny
                  ? copy.editionsListHeading
                  : null
            }
            items={rows}
            variant={usesThumbnailListing ? "thumbnail" : "blob"}
          />
        </section>
      ) : null}
      {preamble || foldItems.length > 0 ? (
        <Section>
          <div className="article-body">
            {preamble ? <PortableBody value={preamble} /> : null}
            <FoldList items={foldItems} />
          </div>
        </Section>
      ) : null}
    </>
  );
}
