"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Section } from "@/components/layout/section";
import { CtaLink } from "@/components/visual/cta-link";
import { LegacyNotFoundEvent } from "@/components/legacy-not-found-event";
import {
  normalizeLegacyPath,
  type LegacySuggestion,
} from "@/lib/legacy-redirects";
import { personPath, projectPath, publicationPath } from "@/lib/routes";
import { SUBPAGE } from "@/lib/subpage-copy";

type Kind = "A" | "B" | "C";

type Miss = {
  path: string;
  kind: Kind;
  suggestions: LegacySuggestion[];
};

function mailtoText(text: string) {
  const email = SUBPAGE.notFound.email;
  const parts = text.split(email);
  if (parts.length === 1) return text;
  return parts.flatMap((part, index) =>
    index === 0
      ? [part]
      : [
          <a key={`${email}-${index}`} href={`mailto:${email}`}>
            {email}
          </a>,
          part,
        ],
  );
}

function sectionLinks() {
  return [
    { href: projectPath("x").replace(/\/x$/, ""), label: "Projekty" },
    { href: publicationPath("x").replace(/\/x$/, ""), label: "Czytelnia" },
    { href: personPath("x").replace(/\/x$/, ""), label: "Zespół" },
    { href: "/fundacja", label: "O fundacji" },
    { href: "/kontakt", label: "Kontakt" },
  ];
}

function SuggestionList({
  items,
  single,
}: {
  items: LegacySuggestion[];
  single: boolean;
}) {
  return (
    <ul className="stack-narrow mt-8" data-testid="not-found-suggestions">
      {items.map((item) => (
        <li key={item.href}>
          {single ? (
            <p className="text-listing-title">{item.title}</p>
          ) : (
            <Link href={item.href} className="text-listing-title">
              {item.title}
            </Link>
          )}
          <p className="mt-2 text-small">{item.typeLabel}</p>
          {item.excerpt ? (
            <p className="mt-2 line-clamp-2 text-small">{item.excerpt}</p>
          ) : null}
          {single ? (
            <CtaLink href={item.href} className="mt-6">
              {SUBPAGE.notFound.moved.cta}
            </CtaLink>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function NotFoundBody({
  path,
  kind,
  suggestions,
  track,
}: {
  path: string;
  kind: Kind;
  suggestions: LegacySuggestion[];
  track: boolean;
}) {
  const copy = SUBPAGE.notFound;
  const title =
    kind === "A" ? copy.moved.title : kind === "B" ? copy.file.title : copy.unknown.title;
  const lead = kind === "A" ? copy.moved.lead : kind === "C" ? copy.unknown.lead : null;
  const czytelnia = publicationPath("x").replace(/\/x$/, "");
  const single = kind === "A" && suggestions.length === 1;

  return (
    <div className="page-article-text-only" data-testid="not-found" data-kind={kind}>
      {track ? <LegacyNotFoundEvent kind={kind} path={path} /> : null}
      <section className="hero hero-stack" data-text-align="left">
        <div className="hero-heading">
          <h1 className="hero-title font-display text-display font-black">{title}</h1>
        </div>
        <div className="hero-copy">
          {lead ? <p className="text-lead">{lead}</p> : null}
          {kind === "B" ? <p className="text-lead">{mailtoText(copy.file.lead)}</p> : null}
        </div>
      </section>
      <Section>
        <div className="stack-narrow">
          {kind === "A" && suggestions.length > 0 ? (
            <>
              <h2 className="font-display text-h3 font-black normal-case">
                {single ? copy.moved.oneHeading : copy.moved.manyHeading}
              </h2>
              <SuggestionList items={suggestions} single={single} />
              <p className="not-found-note mt-8 text-small">{mailtoText(copy.moved.note)}</p>
            </>
          ) : null}
          {kind === "B" ? <CtaLink href={czytelnia}>{copy.file.cta}</CtaLink> : null}
          {kind === "C" && suggestions.length > 0 ? (
            <>
              <h2 className="font-display text-h3 font-black normal-case">
                {copy.unknown.suggestions}
              </h2>
              <SuggestionList items={suggestions} single={false} />
            </>
          ) : null}
          <h2 className="mt-12 font-display text-h3 font-black normal-case">
            {copy.sectionsHeading}
          </h2>
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

function SearchQuery({ onQuery }: { onQuery: (q: string) => void }) {
  const q = useSearchParams().get("q") ?? "";
  useEffect(() => {
    onQuery(q);
  }, [q, onQuery]);
  return null;
}

function LegacyNotFoundClient() {
  const pathname = usePathname() || "/";
  const [query, setQuery] = useState("");
  const [miss, setMiss] = useState<Miss | null>(null);

  useEffect(() => {
    const params = new URLSearchParams({ path: pathname });
    if (query) params.set("q", query);
    const controller = new AbortController();
    fetch(`/api/legacy-404?${params}`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((body: Miss | null) => {
        if (!body || (body.kind !== "A" && body.kind !== "B" && body.kind !== "C")) return;
        setMiss({
          path: typeof body.path === "string" ? body.path : pathname,
          kind: body.kind,
          suggestions: Array.isArray(body.suggestions) ? body.suggestions : [],
        });
      })
      .catch(() => {
        // Keep the static C shell when the classifier is unreachable.
      });
    return () => controller.abort();
  }, [pathname, query]);

  const path = miss?.path || normalizeLegacyPath(pathname, query ? `?q=${query}` : "");
  const kind = miss?.kind ?? "C";
  const suggestions = miss?.suggestions ?? [];

  return (
    <>
      <Suspense fallback={null}>
        <SearchQuery onQuery={setQuery} />
      </Suspense>
      <NotFoundBody
        path={path}
        kind={kind}
        suggestions={suggestions}
        track={miss !== null}
      />
    </>
  );
}

/** Static 404 shell. Variant C until the classifier answers, so the layout does not jump to a spinner. */
export function LegacyNotFound() {
  return <LegacyNotFoundClient />;
}
