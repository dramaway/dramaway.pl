import { Section } from "@/components/layout/section";
import { PortableBody, hasPortableContent } from "@/components/portable-body";
import { CtaLink } from "@/components/visual/cta-link";
import { Media } from "@/components/visual/media";
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

/**
 * Two-column team bios: circle photo above name, blurb, profile CTA.
 * Optional Portable Text under the grid (Zespół / Społeczność).
 * Survives zero people, missing photos, and empty body.
 */
export function TeamBios({
  people,
  heading,
  ctaLabel,
  body,
}: TeamBiosProps) {
  const copy = hasPortableContent(body) ? body : null;
  if (people.length === 0 && !copy) return null;

  return (
    <Section>
      {heading ? (
        <h2 className="font-display text-h3 font-black">{heading}</h2>
      ) : null}
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
                      className="mt-8"
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
      {copy ? (
        <div
          className={cn(
            "team-copy measure",
            (heading || people.length > 0) && "mt-8",
          )}
        >
          <PortableBody value={copy} />
        </div>
      ) : null}
    </Section>
  );
}
