import assert from "node:assert/strict";
import { test } from "node:test";
import { resolveContentSections, selectFeedItems, toFeedCandidates } from "../../apps/web/src/lib/content-sections.ts";

test("drops empty input and unknown section types", () => {
  assert.deepEqual(resolveContentSections(null), []);
  assert.deepEqual(resolveContentSections([]), []);
  assert.deepEqual(
    resolveContentSections([{ _key: "x", _type: "hero" }]),
    [],
  );
});

test("keeps a news feed and uses an optional heading", () => {
  assert.deepEqual(resolveContentSections([{ _key: "n", _type: "newsFeedModule" }]), [
    { key: "n", kind: "news", heading: null, limit: 3, sources: ["news"] },
  ]);
  assert.deepEqual(
    resolveContentSections([
      { _key: "n", _type: "newsFeedModule", heading: "  Nowości  " },
    ]),
    [{ key: "n", kind: "news", heading: "Nowości", limit: 3, sources: ["news"] }],
  );
});

test("news feed keeps a limit and several source kinds", () => {
  const [section] = resolveContentSections([
    {
      _key: "n",
      _type: "newsFeedModule",
      limit: 99,
      sources: ["project", "nope", "person", "project"],
    },
  ]);
  assert.equal(section.kind, "news");
  if (section.kind !== "news") return;
  assert.equal(section.limit, 12);
  assert.deepEqual(section.sources, ["project", "person"]);
});

test("resolves a person reference and a path tile", () => {
  const sections = resolveContentSections([
    {
      _key: "m",
      _type: "contentModule",
      textLayout: "list",
      tiles: [
        {
          _key: "p",
          target: "reference",
          page: {
            _type: "person",
            title: null,
            name: "Ada",
            slug: "ada",
            route: null,
            docExcerpt: "Bio",
          },
        },
        {
          _key: "path",
          target: "path",
          href: "/czytelnia",
          title: "Czytelnia",
          excerpt: "Lead",
        },
        {
          _key: "bad",
          target: "path",
          href: "javascript:alert(1)",
          title: "Nie",
        },
      ],
    },
  ]);

  assert.equal(sections.length, 1);
  assert.equal(sections[0].kind, "module");
  if (sections[0].kind !== "module") return;
  assert.equal(sections[0].textLayout, "list");
  assert.equal(sections[0].image, null);
  assert.deepEqual(
    sections[0].tiles.map((tile) => ({
      key: tile.key,
      title: tile.title,
      href: tile.href,
      ctaLabel: tile.ctaLabel,
    })),
    [
      { key: "p", title: "Ada", href: "/zespol/ada", ctaLabel: "zobacz" },
      { key: "path", title: "Czytelnia", href: "/czytelnia", ctaLabel: "czytaj więcej" },
      { key: "bad", title: "Nie", href: null, ctaLabel: null },
    ],
  );
});

test("project reference uses the project path and an excerpt override", () => {
  const sections = resolveContentSections([
    {
      _key: "m",
      _type: "contentModule",
      tiles: [
        {
          _key: "ag",
          target: "reference",
          excerpt: "Z CMS",
          page: {
            _type: "project",
            title: "Art Generacje",
            name: null,
            slug: "art-generacje",
            route: null,
            docExcerpt: "Summary",
          },
        },
      ],
    },
  ]);
  assert.equal(sections[0].kind, "module");
  if (sections[0].kind !== "module") return;
  assert.equal(sections[0].textLayout, "grid");
  assert.equal(sections[0].tiles[0].href, "/projekty/art-generacje");
  assert.equal(sections[0].tiles[0].excerpt, "Z CMS");
  assert.equal(sections[0].tiles[0].ctaLabel, "zobacz");
});

test("drops a module whose tiles have no title or excerpt", () => {
  assert.deepEqual(
    resolveContentSections([
      {
        _key: "m",
        _type: "contentModule",
        tiles: [{ _key: "t", target: "path", href: "/fundacja" }],
      },
    ]),
    [],
  );
});

test("keeps an image and ignores text layout when the asset is set", () => {
  const image = { asset: { _ref: "image-1" }, alt: "Scena" };
  const sections = resolveContentSections([
    {
      _key: "m",
      _type: "contentModule",
      textLayout: "grid",
      image,
      tiles: [
        {
          _key: "a",
          target: "reference",
          page: {
            _type: "aboutPage",
            title: "O fundacji",
            name: null,
            slug: null,
            route: null,
            docExcerpt: null,
          },
        },
        {
          _key: "b",
          target: "reference",
          page: {
            _type: "landingPage",
            title: null,
            name: null,
            slug: null,
            route: "czytelnia",
            docExcerpt: "Lead",
          },
        },
        {
          _key: "c",
          target: "reference",
          title: "Cztery",
          page: {
            _type: "page",
            title: "Cztery",
            name: null,
            slug: "kontakt",
            route: null,
            docExcerpt: null,
          },
        },
        {
          _key: "d",
          target: "reference",
          title: "Pięć",
          page: {
            _type: "page",
            title: "Pięć",
            name: null,
            slug: "metody",
            route: null,
            docExcerpt: null,
          },
        },
      ],
    },
  ]);
  assert.equal(sections[0].kind, "module");
  if (sections[0].kind !== "module") return;
  assert.equal(sections[0].image, image);
  assert.equal(sections[0].imageAlt, "Scena");
  assert.deepEqual(
    sections[0].tiles.map((tile) => tile.href),
    ["/fundacja", "/czytelnia", "/kontakt"],
  );
});

test("a feed mixes selected kinds by creation date and stops at the limit", () => {
  const card = (id, source, createdAt) => ({
    id,
    source,
    title: id,
    href: `/${id}`,
    excerpt: null,
    createdAt,
    ctaLabel: "czytaj więcej",
  });
  const picked = selectFeedItems(
    [
      card("old-news", "news", "2020-01-01T00:00:00.000Z"),
      card("new-person", "person", "2026-06-01T00:00:00.000Z"),
      card("mid-project", "project", "2024-03-01T00:00:00.000Z"),
      card("page", "page", "2025-01-01T00:00:00.000Z"),
    ],
    { limit: 2, sources: ["news", "person", "project"] },
  );
  assert.deepEqual(
    picked.map((item) => item.id),
    ["new-person", "mid-project"],
  );
});

test("a news card keeps the article on the title and a labeled custom button", () => {
  const [item] = toFeedCandidates({
    news: [
      {
        _id: "news-1",
        title: "[Aktualność] Harmonia",
        slug: "harmonia-artgeneracje",
        ctaHref: "https://centrum.dramaway.pl",
        ctaLabel: "zobacz w Centrum",
        publishedAt: "2026-01-02T00:00:00.000Z",
        _createdAt: "2020-01-01T00:00:00.000Z",
      },
    ],
    page: null,
    person: null,
    project: null,
    publication: null,
  });
  assert.equal(item.title, "Harmonia");
  assert.equal(item.href, "/harmonia-artgeneracje");
  assert.equal(item.ctaHref, "https://centrum.dramaway.pl/");
  assert.equal(item.ctaLabel, "zobacz w Centrum");
  assert.equal(item.createdAt, "2026-01-02T00:00:00.000Z");
});
