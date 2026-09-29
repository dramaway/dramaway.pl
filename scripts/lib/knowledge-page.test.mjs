import assert from "node:assert/strict";
import { test } from "node:test";
import {
  foldKnowledgeNavigation,
  knowledgePagePatch,
  knowledgeReferencePatch,
  prependPlainLead,
} from "./knowledge-page.mjs";

const keys = () => {
  let n = 0;
  return () => `k${++n}`;
};

const landing = {
  lead: "DramaWay tworzy projekty teatralne i edukacyjne.",
};

const methodsPage = {
  slug: "metody",
  heroLead: "Projekty realizujemy najczęściej w oparciu o metodę dramy.\nDruga linia.",
  body: [
    {
      _key: "old",
      _type: "block",
      style: "normal",
      markDefs: [],
      children: [{ _key: "old-span", _type: "span", marks: [], text: "TZS to forma pracy." }],
    },
  ],
};

test("methods page becomes Baza wiedzy and keeps both intros", () => {
  const set = knowledgePagePatch(methodsPage, landing, keys());
  assert.equal(set.title, "Baza wiedzy");
  assert.equal(set.slug.current, "baza-wiedzy");
  assert.equal(set.heroLead, landing.lead);
  assert.equal(set.body[0].children[0].text, "Projekty realizujemy najczęściej w oparciu o metodę dramy.");
  assert.equal(set.body[1].children[0].text, "Druga linia.");
  assert.equal(set.body[2].children[0].text, "TZS to forma pracy.");
});

test("a second pass does not rewrite a page that already moved", () => {
  assert.equal(knowledgePagePatch({ slug: "baza-wiedzy", heroLead: "x", body: [] }, landing), null);
});

test("prepend does not duplicate the lead", () => {
  const once = prependPlainLead([], "Akapit.", keys());
  const twice = prependPlainLead(once, "Akapit.", keys());
  assert.equal(twice.length, 1);
});

test("menu drops Metody and points Baza wiedzy at the page", () => {
  const navigation = [
    {
      _key: "projekty",
      _type: "navItem",
      label: "Projekty",
      target: "reference",
      page: { _type: "reference", _ref: "landing-projekty" },
    },
    {
      _key: "baza-wiedzy",
      _type: "navItem",
      label: "Baza wiedzy",
      target: "reference",
      page: { _type: "reference", _ref: "landing-baza-wiedzy" },
      children: [
        {
          _key: "metody",
          _type: "navChild",
          label: "Metody",
          target: "reference",
          page: { _type: "reference", _ref: "page-drupal-49" },
        },
        {
          _key: "czytelnia",
          _type: "navChild",
          label: "Czytelnia",
          target: "reference",
          page: { _type: "reference", _ref: "landing-czytelnia" },
        },
      ],
    },
  ];

  const folded = foldKnowledgeNavigation(navigation, { pageId: "page-drupal-49" });
  assert.equal(folded[0].page._ref, "landing-projekty");
  assert.equal(folded[1].page._ref, "page-drupal-49");
  assert.equal(folded[1].target, "reference");
  assert.equal("href" in folded[1], false);
  assert.deepEqual(
    folded[1].children.map((child) => child.label),
    ["Czytelnia"],
  );

  const again = foldKnowledgeNavigation(folded, { pageId: "page-drupal-49" });
  assert.deepEqual(again, folded);
});

test("homepage tile reference moves off the retired landing", () => {
  const set = knowledgeReferencePatch(
    {
      _id: "siteSettings",
      _type: "siteSettings",
      homepageSections: [
        {
          _key: "row",
          _type: "contentModule",
          tiles: [
            {
              _key: "baza",
              title: "Baza wiedzy",
              page: { _type: "reference", _ref: "landing-baza-wiedzy" },
            },
          ],
        },
      ],
      navigation: [
        {
          _key: "baza-wiedzy",
          _type: "navItem",
          label: "Baza wiedzy",
          target: "reference",
          href: "/baza-wiedzy",
          page: { _type: "reference", _ref: "landing-baza-wiedzy" },
          children: [
            {
              _key: "metody",
              _type: "navChild",
              label: "Metody",
              target: "path",
              href: "/metody",
            },
          ],
        },
      ],
    },
    { pageId: "page-drupal-49" },
  );

  assert.equal(set.homepageSections[0].tiles[0].page._ref, "page-drupal-49");
  assert.equal(set.navigation[0].page._ref, "page-drupal-49");
  assert.equal(set.navigation[0].children, undefined);
});
