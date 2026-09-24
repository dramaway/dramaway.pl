import assert from "node:assert/strict";
import { test } from "node:test";
import { resolveContentSections } from "../../apps/web/src/lib/content-sections.ts";

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
    { key: "n", kind: "news", heading: null },
  ]);
  assert.deepEqual(
    resolveContentSections([
      { _key: "n", _type: "newsFeedModule", heading: "  Nowości  " },
    ]),
    [{ key: "n", kind: "news", heading: "Nowości" }],
  );
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
      { key: "p", title: "Ada", href: "/zespol/ada", ctaLabel: "poznaj" },
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
  assert.equal(sections[0].tiles[0].ctaLabel, "poznaj");
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
