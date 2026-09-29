import assert from "node:assert/strict";
import { test } from "node:test";
import { ctaIndentLevel, resolveCtaButton } from "../../apps/web/src/lib/cta-button.ts";
import {
  aboutPageQuery,
  newsBySlugQuery,
  pageBySlugQuery,
  personBySlugQuery,
  portableBodyProjection,
  projectBySlugQuery,
  publicationBySlugQuery,
} from "../../apps/web/src/lib/sanity/queries.ts";

test("a document button resolves to that document's path", () => {
  assert.deepEqual(
    resolveCtaButton({
      label: "więcej",
      target: "reference",
      page: { _type: "page", slug: "kontakt" },
    }),
    { href: "/kontakt", label: "więcej" },
  );
});

test("news, project, publication, person, listing and about each keep their public path", () => {
  assert.equal(
    resolveCtaButton({
      label: "czytaj",
      target: "reference",
      page: { _type: "news", slug: "aktualnosc-las" },
    })?.href,
    "/las",
  );
  assert.equal(
    resolveCtaButton({
      label: "projekt",
      page: { _type: "project", slug: "art-generacje" },
    })?.href,
    "/projekty/art-generacje",
  );
  assert.equal(
    resolveCtaButton({
      label: "tekst",
      page: { _type: "publication", slug: "boal" },
    })?.href,
    "/czytelnia/boal",
  );
  assert.equal(
    resolveCtaButton({
      label: "osoba",
      page: { _type: "person", slug: "aldona" },
    })?.href,
    "/zespol/aldona",
  );
  assert.equal(
    resolveCtaButton({
      label: "lista",
      page: { _type: "landingPage", route: "projekty" },
    })?.href,
    "/projekty",
  );
  assert.equal(
    resolveCtaButton({
      label: "fundacja",
      page: { _type: "aboutPage" },
    })?.href,
    "/fundacja",
  );
});

test("a file opens its asset url and an address keeps https or a path", () => {
  assert.equal(
    resolveCtaButton({
      label: "pdf",
      target: "file",
      href: "/ignoruj",
      file: { asset: { url: "https://cdn.sanity.io/files/tr2qdg9j/production/abc.pdf" } },
    })?.href,
    "https://cdn.sanity.io/files/tr2qdg9j/production/abc.pdf",
  );
  assert.equal(
    resolveCtaButton({
      label: "centrum",
      target: "url",
      href: "https://centrum.dramaway.pl",
      page: { _type: "page", slug: "kontakt" },
    })?.href,
    "https://centrum.dramaway.pl/",
  );
  assert.equal(
    resolveCtaButton({
      label: "edycja",
      target: "url",
      href: "/projekty/art-generacje/edycja-2016",
    })?.href,
    "/projekty/art-generacje/edycja-2016",
  );
});

test("anchor and query are appended, with or without the leading symbol", () => {
  const page = { _type: "project", slug: "art-generacje" };
  assert.equal(
    resolveCtaButton({ label: "edycje", target: "reference", page, hash: "edycje" })?.href,
    "/projekty/art-generacje#edycje",
  );
  assert.equal(
    resolveCtaButton({ label: "edycje", target: "reference", page, hash: "#edycje" })?.href,
    "/projekty/art-generacje#edycje",
  );
  assert.equal(
    resolveCtaButton({
      label: "książki",
      target: "url",
      href: "/czytelnia",
      query: "rodzaj=books",
    })?.href,
    "/czytelnia?rodzaj=books",
  );
  assert.equal(
    resolveCtaButton({
      label: "książki",
      target: "reference",
      page: { _type: "landingPage", route: "czytelnia" },
      query: "?rodzaj=books",
      hash: "lista",
    })?.href,
    "/czytelnia?rodzaj=books#lista",
  );
});

test("a query merges with one already on the address, and an anchor replaces the old one", () => {
  assert.equal(
    resolveCtaButton({
      label: "filtr",
      target: "url",
      href: "https://example.com/a?b=1",
      query: "c=2",
    })?.href,
    "https://example.com/a?b=1&c=2",
  );
  assert.equal(
    resolveCtaButton({
      label: "niżej",
      target: "url",
      href: "/projekty/art-generacje#stare",
      hash: "edycje",
    })?.href,
    "/projekty/art-generacje#edycje",
  );
  assert.equal(
    resolveCtaButton({
      label: "zostaw",
      target: "url",
      href: "/projekty/art-generacje#edycje",
      query: "rok=2024",
    })?.href,
    "/projekty/art-generacje?rok=2024#edycje",
  );
});

test("a broken button is omitted: no label, no target, or a dangerous address", () => {
  assert.equal(resolveCtaButton({ label: "  ", target: "url", href: "/kontakt" }), null);
  assert.equal(resolveCtaButton({ label: "więcej", target: "reference" }), null);
  assert.equal(resolveCtaButton({ label: "więcej", target: "file" }), null);
  assert.equal(resolveCtaButton({ label: "więcej", target: "url", href: "javascript:alert(1)" }), null);
  assert.equal(resolveCtaButton({ label: "więcej", target: "url", href: "//evil.example" }), null);
  assert.equal(resolveCtaButton({ label: "więcej", target: "url", href: "mailto:a@b.pl" }), null);
  assert.equal(resolveCtaButton({ label: "więcej", target: "other", href: "/kontakt" }), null);
});

test("an invalid anchor or query is ignored and the base link stays", () => {
  assert.equal(
    resolveCtaButton({
      label: "więcej",
      target: "url",
      href: "/kontakt",
      hash: "zła kotwica",
      query: "a=1#nie",
    })?.href,
    "/kontakt",
  );
});

test("button indent is 0, 1, 2 or 3 steps and anything else stays flush left", () => {
  assert.equal(ctaIndentLevel(undefined), 0);
  assert.equal(ctaIndentLevel(0), 0);
  assert.equal(ctaIndentLevel("1"), 1);
  assert.equal(ctaIndentLevel(2), 2);
  assert.equal(ctaIndentLevel(3), 3);
  assert.equal(ctaIndentLevel(4), 0);
  assert.equal(ctaIndentLevel(-1), 0);
  assert.equal(ctaIndentLevel("deep"), 0);
});

test("every rendered Portable Text field expands Button links", () => {
  assert.match(portableBodyProjection, /textColumns/);
  for (const query of [
    pageBySlugQuery,
    newsBySlugQuery,
    personBySlugQuery,
    projectBySlugQuery,
    publicationBySlugQuery,
    aboutPageQuery,
  ]) {
    assert.match(query, /ctaButton/);
  }
  assert.match(projectBySlugQuery, /afterword\[\]/);
  assert.match(aboutPageQuery, /lead\[\]/);
  assert.doesNotMatch(aboutPageQuery, /methods \{[^}]*lead\[\]/);
});
