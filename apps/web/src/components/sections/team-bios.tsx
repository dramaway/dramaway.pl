import { Section } from "@/components/layout/section";
import { PortableBody, hasPortableContent } from "@/components/portable-body";
import { CtaLink } from "@/components/visual/cta-link";
import { Media } from "@/components/visual/media";
import { splitPortableByHeading } from "@/lib/portable-split";
import { publicPathForPersonSlug } from "@/lib/routes";
import type { PortableContent, SanityImage } from "@/lib/sanity/types";
import { cn } from "@/lib/utils";

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
 * Board bios and the staff list stand side by side on a wide screen — two short
 * blocks stacked left a hole and pushed the essay far down the page.
 *
 * The pairing rule is positional: the **first** H2 section of `team.body`
 * (Zespół) joins the board, and everything after it (Społeczność) reads below
 * in one column — an essay next to four roster rows would not balance.
 * Survives zero people, missing photos, an empty body, and a body with no H2.
 */
export function TeamBios({ people, heading, ctaLabel, body }: TeamBiosProps) {
  const copy = hasPortableContent(body) ? body : null;
  if (people.length === 0 && !copy) return null;

  const { preamble, sections } = copy
    ? splitPortableByHeading(copy)
    : { preamble: null, sections: [] };
  const [paired, ...rest] = sections;

  const hasBoard = Boolean(heading || people.length > 0 || preamble);
  const board = hasBoard ? (
    <div className="team-split-col">
      {heading ? <h2 className={SECTION_HEADING}>{heading}</h2> : null}
      {people.length > 0 ? (
        <ul className={heading ? "team-bios mt-8" : "team-bios"}>
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
                <div>
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
    </div>
  ) : null;

  const roster = paired ? (
    <div className="team-split-col">
      <h2 className={SECTION_HEADING}>{paired.title}</h2>
      <div className="team-copy">
        <PortableBody value={paired.blocks} />
      </div>
    </div>
  ) : null;

  return (
    <Section className="fundacja-flow">
      <div className="stack-wide">
        {board || roster ? (
          <div className={cn("team-split", board && roster && "team-split-pair")}>
            {board}
            {roster}
          </div>
        ) : null}
        {rest.length > 0 ? (
          <div className="team-rest">
            {rest.map((section) => (
              <section key={section.title} className="team-rest-item">
                <h2 className={SECTION_HEADING}>{section.title}</h2>
                <div className="team-copy">
                  <PortableBody value={section.blocks} />
                </div>
              </section>
            ))}
          </div>
        ) : null}
      </div>
    </Section>
  );
}
