import { Section } from "@/components/layout/section";
import { PortableBody, hasPortableContent } from "@/components/portable-body";
import { CtaLink } from "@/components/visual/cta-link";
import { Media } from "@/components/visual/media";
import { splitPortableByHeading } from "@/lib/portable-split";
import { publicPathForPersonSlug } from "@/lib/routes";
import type { PortableContent, SanityImage } from "@/lib/sanity/types";

export type TeamBioPerson = {
  name: string;
  slug: string;
  role?: string | null;
  photo?: SanityImage | null;
  excerpt?: string | null;
};

type TeamBiosProps = {
  people: TeamBioPerson[];
  heading?: string | null;
  ctaLabel?: string | null;
  body?: PortableContent | null;
};

function personBlurb(person: TeamBioPerson) {
  return person.excerpt?.trim() || person.role?.trim() || null;
}

const SECTION_HEADING = "font-display text-h3 font-black";

/**
 * Zarząd, then Zespół, then anything else under its own H2 — one column of
 * blocks with a shared rhythm. Every block uses
 * the same two tracks from lg: the two bio cards fill them side by side, and
 * the staff roster flows across them, so nothing hugs the left edge.
 *
 * Each H2 of `team.body` becomes a block; blocks before the first H2 stay
 * under the board. Survives zero people, missing photos, an empty body, and
 * a body with no H2.
 */
export function TeamBios({ people, heading, ctaLabel, body }: TeamBiosProps) {
  const copy = hasPortableContent(body) ? body : null;
  if (people.length === 0 && !copy) return null;

  const { preamble, sections } = copy
    ? splitPortableByHeading(copy)
    : { preamble: null, sections: [] };

  const hasBoard = Boolean(heading || people.length > 0 || preamble);
  const board = hasBoard ? (
    <section className="team-block">
      {heading ? <h2 className={SECTION_HEADING}>{heading}</h2> : null}
      {people.length > 0 ? (
        <ul className={heading ? "team-bios team-block-body" : "team-bios"}>
          {people.map((person) => {
            const blurb = personBlurb(person);
            return (
              <li key={person.slug} className="team-bio">
                <Media
                  image={person.photo ?? null}
                  alt={person.name}
                  variant="bleed"
                  ratio="portrait"
                  sizes="(min-width: 64rem) 12vw, 40vw"
                  className="team-photo"
                />
                <div className="team-bio-copy">
                  <h3 className="team-bio-name text-h4 font-semibold">
                    {person.name}
                  </h3>
                  {blurb ? (
                    <p className="team-bio-blurb mt-4 text-body">{blurb}</p>
                  ) : null}
                  {ctaLabel ? (
                    <CtaLink
                      href={publicPathForPersonSlug(person.slug)}
                      className="mt-4"
                    >
                      {ctaLabel}
                    </CtaLink>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
      {preamble ? (
        <div className="team-copy">
          <PortableBody value={preamble} />
        </div>
      ) : null}
    </section>
  ) : null;

  return (
    <Section className="fundacja-flow">
      <div className="team-blocks stack-wide">
        {board}
        {sections.map((section) => (
          <section key={section.title} className="team-block">
            <h2 className={SECTION_HEADING}>{section.title}</h2>
            <div className="team-copy">
              <PortableBody value={section.blocks} />
            </div>
          </section>
        ))}
      </div>
    </Section>
  );
}
