import Link from "next/link";
import { Section } from "@/components/layout/section";
import { CtaLink } from "@/components/visual/cta-link";
import { Media } from "@/components/visual/media";
import { publicPathForPersonSlug } from "@/lib/routes";
import type { SanityImage } from "@/lib/sanity/types";

export type TeamRowPerson = {
  name: string;
  slug: string;
  role?: string | null;
  photo?: SanityImage | null;
};

type TeamRowProps = {
  people: TeamRowPerson[];
  heading?: string;
  href?: string;
  ctaLabel?: string;
  emptyMessage?: string;
};

/**
 * Circular portraits from `person` documents. Survives zero people and
 * missing photos (Media paints sand).
 */
export function TeamRow({
  people,
  heading,
  href,
  ctaLabel,
  emptyMessage = "Brak osób w CMS.",
}: TeamRowProps) {
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
        <ul className={heading ? "team-row mt-8" : "team-row"}>
          {people.map((person) => (
            <li key={person.slug} className="stack-item">
              <Link
                href={publicPathForPersonSlug(person.slug)}
                className="card-link"
              >
                <Media
                  image={person.photo ?? null}
                  alt={person.name}
                  variant="bleed"
                  ratio="portrait"
                  sizes="(min-width: 64rem) 15vw, 40vw"
                  className="team-photo"
                />
                <p className="mt-4 font-display text-h4 font-black">
                  {person.name}
                </p>
              </Link>
              {person.role ? (
                <p className="mt-2 text-small">{person.role}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
      {href && ctaLabel ? (
        <CtaLink href={href} className="mt-8">
          {ctaLabel}
        </CtaLink>
      ) : null}
    </Section>
  );
}
