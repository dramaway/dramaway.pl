import { Section } from "@/components/layout/section";
import { CtaLink } from "@/components/visual/cta-link";
import { Media } from "@/components/visual/media";
import { publicPathForPersonSlug } from "@/lib/routes";
import type { SanityImage } from "@/lib/sanity/types";

export type TeamBioPerson = {
  name: string;
  slug: string;
  role?: string | null;
  photo?: SanityImage | null;
  excerpt?: string | null;
};

type TeamBiosProps = {
  people: TeamBioPerson[];
  heading?: string;
  ctaLabel: string;
  emptyMessage?: string;
};

function personBlurb(person: TeamBioPerson) {
  return person.excerpt?.trim() || person.role?.trim() || null;
}

/**
 * Two-column team bios: circle photo above name, blurb, profile CTA.
 * Survives zero people and missing photos (Media paints sand).
 */
export function TeamBios({
  people,
  heading,
  ctaLabel,
  emptyMessage = "Brak osób w CMS.",
}: TeamBiosProps) {
  return (
    <Section>
      {heading ? (
        <h2 className="font-display text-h3 font-black">{heading}</h2>
      ) : null}
      {people.length === 0 ? (
        <p className={heading ? "mt-8 text-body" : "text-body"}>
          {emptyMessage}
        </p>
      ) : (
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
                  <CtaLink
                    href={publicPathForPersonSlug(person.slug)}
                    className="mt-8"
                  >
                    {ctaLabel}
                  </CtaLink>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Section>
  );
}
