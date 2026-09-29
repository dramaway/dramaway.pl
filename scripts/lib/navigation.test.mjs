import assert from "node:assert/strict";
import { test } from "node:test";
import { resolveMainNav } from "../../apps/web/src/lib/navigation.ts";

const builtin = [
  { href: "/", label: "Strona główna" },
  { href: "/projekty", label: "Projekty" },
  {
    href: "/baza-wiedzy",
    label: "Baza wiedzy",
    children: [{ href: "/czytelnia", label: "Czytelnia" }],
  },
  { href: "/fundacja", label: "O fundacji" },
  { href: "/kontakt", label: "Kontakt" },
];

test("empty navigation keeps the built-in menu", () => {
  assert.deepEqual(resolveMainNav(null), builtin);
  assert.deepEqual(resolveMainNav([]), builtin);
  assert.deepEqual(resolveMainNav(undefined), builtin);
});

test("resolves document types to public paths and falls back to the document title", () => {
  assert.deepEqual(
    resolveMainNav([
      {
        target: "reference",
        page: {
          _type: "landingPage",
          title: null,
          name: null,
          slug: null,
          route: "zespol",
        },
      },
      {
        target: "reference",
        page: {
          _type: "aboutPage",
          title: "",
          name: null,
          slug: null,
          route: null,
        },
      },
      {
        label: "Statut",
        target: "reference",
        page: {
          _type: "page",
          title: "Statut fundacji",
          name: null,
          slug: "statut",
          section: "fundacja",
          route: null,
        },
      },
      {
        target: "reference",
        page: {
          _type: "project",
          title: "Art Generacje",
          name: null,
          slug: "art-generacje",
          route: null,
        },
      },
      {
        target: "reference",
        page: {
          _type: "publication",
          title: "Teatr Forum",
          name: null,
          slug: "teatr-forum",
          route: null,
        },
      },
      {
        target: "reference",
        page: {
          _type: "person",
          title: null,
          name: "Anna Nowak",
          slug: "anna-nowak",
          route: null,
        },
      },
      {
        label: "Aktualność",
        target: "reference",
        page: {
          _type: "page",
          title: "News",
          name: null,
          slug: "aktualnosc-las",
          route: null,
        },
      },
    ]),
    [
      { href: "/zespol", label: "Zespół" },
      { href: "/fundacja", label: "O fundacji" },
      { href: "/fundacja/statut", label: "Statut" },
      { href: "/projekty/art-generacje", label: "Art Generacje" },
      { href: "/czytelnia/teatr-forum", label: "Teatr Forum" },
      { href: "/zespol/anna-nowak", label: "Anna Nowak" },
      { href: "/las", label: "Aktualność" },
    ],
  );
});

test("keeps one level of children and drops items that cannot be linked", () => {
  assert.deepEqual(
    resolveMainNav([
      {
        label: "Baza wiedzy",
        target: "path",
        href: "/baza-wiedzy",
        children: [
          { label: "Metody", target: "path", href: "/metody" },
          { label: "Zewnętrzne", target: "path", href: "https://centrum.dramaway.pl/szkolenia" },
          { target: "path", href: "/bez-etykiety" },
          { label: "Zły", target: "path", href: "javascript:alert(1)" },
          { label: "Brak strony", target: "reference", page: null },
        ],
      },
      {
        label: "Sam rodzic",
        target: "reference",
        page: null,
        children: [{ label: "Dziecko", target: "path", href: "/kontakt" }],
      },
    ]),
    [
      {
        href: "/baza-wiedzy",
        label: "Baza wiedzy",
        children: [
          { href: "/metody", label: "Metody" },
          {
            href: "https://centrum.dramaway.pl/szkolenia",
            label: "Zewnętrzne",
            external: true,
          },
        ],
      },
    ],
  );
});

test("a single valid item replaces the built-in menu", () => {
  assert.deepEqual(
    resolveMainNav([{ label: "Kontakt", target: "path", href: "/kontakt" }]),
    [{ href: "/kontakt", label: "Kontakt" }],
  );
});
