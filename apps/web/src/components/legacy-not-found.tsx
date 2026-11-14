import Link from "next/link";
import { headers } from "next/headers";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/layout/section";
import { CtaLink } from "@/components/visual/cta-link";
import { LegacyNotFoundEvent } from "@/components/legacy-not-found-event";
import { getLegacySuggestionSources } from "@/lib/sanity/fetch";
import {
  LEGACY_PATH_HEADER,
  classifyLegacyMiss,
  normalizeLegacyPath,
  type LegacyPathEntry,
  type LegacySuggestion,
} from "@/lib/legacy-redirects";
import { mainNav, personPath, publicationPath } from "@/lib/routes";
import { SUBPAGE } from "@/lib/subpage-copy";
import pathsJson from "@/data/legacy-paths.json";

const legacyPaths = pathsJson as LegacyPathEntry[];

function mailtoText(text: string) {
  const email = SUBPAGE.notFound.email;
  const parts = text.split(email);
  if (parts.length === 1) return text;
  return parts.flatMap((part, index) =>
    index === 0
      ? [part]
      : [
          <a key={email + index} href={`mailto:${email}`}>
            {email}
          </a>,
          part,
        ],
  );
}

function sectionLinks() {
  const czytelnia = publicationPath("x").replace(/\/x$/, "");
  const team = personPath("x").replace(/\/x$/, "");
  const nav = mainNav().filter((item) => item.href !== "/");
  const projects = nav.find((item) => item.href === "/projekty");
  const rest = nav.filter((item) => item.href !== "/projekty");
  return [
    projects,
    { href: czytelnia, label: "Czytelnia" },
    { href: team, label: "Zespół" },
    ...rest,
  ].filter((item): item is { href: string; label: string } => Boolean(item));
}

function SuggestionList({
  items,
  withCta,
}: {
  items: LegacySuggestion[];
  withCta: boolean;
}) {
  return (
    <ul className="stack-narrow mt-8" data-testid="not-found-suggestions">
      {items.map((item) => (
        <li key={item.href}>
          <Link href={item.href} className="text-listing-title">
            {item.title}
          </Link>
          <p className="mt-2 text-small">{item.typeLabel}</p>
          {item.excerpt ? (
            <p className="mt-2 line-clamp-2 text-small">{item.excerpt}</p>
          ) : null}
          {withCta ? (
            <CtaLink href={item.href} className="mt-6">
              {SUBPAGE.notFound.moved.cta}
            </CtaLink>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export async function LegacyNotFound() {
  const headerList = await headers();
  const requested = headerList.get(LEGACY_PATH_HEADER) || "";
  const [pathname, search = ""] = requested.split("?");
  const path = normalizeLegacyPath(pathname || "/", search ? `?${search}` : "");
  const entry = legacyPaths.find((row) => row.path === path) ?? null;
  const documents = await getLegacySuggestionSources();
  const miss = classifyLegacyMiss({ path, entry, documents });
  const copy = SUBPAGE.notFound;
  const title =
    miss.kind === "A"
      ? copy.moved.title
      : miss.kind === "B"
        ? copy.file.title
        : copy.unknown.title;
  const lead =
    miss.kind === "A"
      ? copy.moved.lead
      : miss.kind === "B"
        ? copy.file.lead
        : copy.unknown.lead;
  const czytelnia = publicationPath("x").replace(/\/x$/, "");

  return (
    <div className="page-article-text-only" data-testid="not-found" data-kind={miss.kind}>
      <LegacyNotFoundEvent kind={miss.kind} path={path} />
      <PageHero layout="stack" title={title} lead={lead} slides={[]} showBand={false} />
      <Section>
        <div className="stack-narrow">
          {miss.kind === "A" ? (
            <>
              <h2 className="font-display text-h3 font-black normal-case">
                {miss.suggestions.length === 1
                  ? copy.moved.oneHeading
                  : copy.moved.manyHeading}
              </h2>
              <SuggestionList
                items={miss.suggestions}
                withCta={miss.suggestions.length === 1}
              />
              <p className="not-found-note mt-8 text-small">{mailtoText(copy.moved.note)}</p>
            </>
          ) : null}
          {miss.kind === "B" ? (
            <CtaLink href={czytelnia}>{copy.file.cta}</CtaLink>
          ) : null}
          {miss.kind === "C" && miss.suggestions.length > 0 ? (
            <>
              <h2 className="font-display text-h3 font-black normal-case">{copy.unknown.suggestions}</h2>
              <SuggestionList items={miss.suggestions} withCta={false} />
            </>
          ) : null}
          <h2 className="mt-12 font-display text-h3 font-black normal-case">{copy.sectionsHeading}</h2>
          <ul className="mt-6">
            {sectionLinks().map((item) => (
              <li key={item.href} className="mt-3">
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
          {path && path !== "/" ? (
            <p className="not-found-note mt-10 text-small" data-testid="not-found-path">
              {copy.pathLabel} {path}
            </p>
          ) : null}
        </div>
      </Section>
    </div>
  );
}
