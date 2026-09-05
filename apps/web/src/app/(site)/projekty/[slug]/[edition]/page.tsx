import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/layout/section";
import { PortableBody } from "@/components/portable-body";
import { Media } from "@/components/visual/media";
import { editionPath, projectPath } from "@/lib/routes";
import {
  getProjectBySlug,
  getProjectEditionParams,
} from "@/lib/sanity/fetch";

type Props = { params: Promise<{ slug: string; edition: string }> };

export const revalidate = 60;

export async function generateStaticParams() {
  const projects = await getProjectEditionParams();
  return projects.flatMap((project) =>
    (project.editionSlugs ?? []).filter(Boolean).map((edition) => ({
      slug: project.slug,
      edition,
    })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, edition: editionSlug } = await params;
  const project = await getProjectBySlug(slug);
  const edition = project?.editions?.find((item) => item.slug === editionSlug);
  if (!edition) return { title: "Edycja" };
  return {
    title: `${edition.title} — ${project.title}`,
    alternates: { canonical: editionPath(slug, editionSlug) },
  };
}

export default async function EditionPage({ params }: Props) {
  const { slug, edition: editionSlug } = await params;
  const project = await getProjectBySlug(slug);
  const edition = project?.editions?.find((item) => item.slug === editionSlug);
  if (!project || !edition) notFound();

  const gallery = (edition.gallery ?? []).filter(Boolean);
  const outcomes = edition.outcomes ?? [];
  const lead = edition.summary?.trim() || edition.years || edition.theme || null;

  return (
    <>
      <PageHero
        title={edition.title}
        lead={lead}
        parent={{ href: projectPath(project.slug), label: project.title }}
      />
      {edition.body ? (
        <Section>
          <div className="measure">
            <PortableBody value={edition.body} />
          </div>
        </Section>
      ) : null}
      {gallery.length > 0 ? (
        <Section>
          <div className="cols-3">
            {gallery.map((image, index) => (
              <Media
                key={index}
                image={image}
                alt={`${edition.title} — ${index + 1}`}
                variant="inset"
                ratio="album"
                sizes="(min-width: 64rem) 30vw, 100vw"
              />
            ))}
          </div>
        </Section>
      ) : null}
      {outcomes.length > 0 ? (
        <Section>
          <h2 className="font-display text-h3 font-black">Rezultaty</h2>
          <ul className="mt-8 stack">
            {outcomes.map((outcome) => (
              <li key={outcome.title} className="stack-item">
                <h3 className="font-display text-h4 font-black">
                  {outcome.title}
                </h3>
                {outcome.subtitle || outcome.date ? (
                  <p className="mt-2 text-small">
                    {[outcome.subtitle, outcome.date].filter(Boolean).join(" · ")}
                  </p>
                ) : null}
                {outcome.description ? (
                  <p className="measure mt-4 text-body">{outcome.description}</p>
                ) : null}
                {outcome.image ? (
                  <Media
                    image={outcome.image}
                    alt={outcome.title}
                    variant="inset"
                    ratio="landscape"
                    className="mt-6"
                    sizes="(min-width: 64rem) 40vw, 100vw"
                  />
                ) : null}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </>
  );
}
