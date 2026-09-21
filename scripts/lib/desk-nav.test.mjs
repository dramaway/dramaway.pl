import assert from "node:assert/strict";
import { test } from "node:test";
import {
  deskNavFromSettings,
  pageDocumentIds,
} from "../../apps/studio/desk-nav.ts";

test("an empty menu yields no shortcuts", () => {
  assert.deepEqual(deskNavFromSettings(null), []);
  assert.deepEqual(deskNavFromSettings([]), []);
});

test("document rows become shortcuts and path rows are dropped", () => {
  assert.deepEqual(
    deskNavFromSettings([
      {
        _key: "projekty",
        label: "Projekty",
        target: "reference",
        pageId: "landing-projekty",
        pageType: "landingPage",
        pageTitle: null,
      },
      {
        _key: "centrum",
        label: "Centrum",
        target: "path",
        pageId: null,
        pageType: null,
        pageTitle: null,
      },
      {
        _key: "osoba",
        label: "",
        target: "reference",
        pageId: "drafts.person-anna",
        pageType: "person",
        pageTitle: "Anna Nowak",
      },
      {
        _key: "home",
        label: "Start",
        target: "reference",
        pageId: "siteSettings",
        pageType: "siteSettings",
        pageTitle: "Fundacja",
      },
    ], ["siteSettings"]),
    [
      {
        id: "nav-projekty",
        title: "Projekty",
        schemaType: "landingPage",
        documentId: "landing-projekty",
        children: [],
      },
      {
        id: "nav-osoba",
        title: "Anna Nowak",
        schemaType: "person",
        documentId: "person-anna",
        children: [],
      },
    ],
  );
});

test("children nest under a parent and a path parent is dropped", () => {
  const entries = deskNavFromSettings([
    {
      _key: "baza",
      label: "Baza wiedzy",
      target: "reference",
      pageId: "landing-baza-wiedzy",
      pageType: "landingPage",
      pageTitle: "Baza",
      children: [
        {
          _key: "metody",
          label: "Metody",
          target: "reference",
          pageId: "page-drupal-49",
          pageType: "page",
          pageTitle: "Metody pracy",
        },
        {
          _key: "zewnetrzne",
          label: "Na zewnątrz",
          target: "path",
          pageId: null,
          pageType: null,
        },
      ],
    },
    {
      _key: "sam-adres",
      label: "Link",
      target: "path",
      children: [
        {
          _key: "kontakt",
          label: "Kontakt",
          target: "reference",
          pageId: "page-drupal-2",
          pageType: "page",
          pageTitle: "Kontakt",
        },
      ],
    },
  ]);

  assert.deepEqual(entries, [
    {
      id: "nav-baza",
      title: "Baza wiedzy",
      schemaType: "landingPage",
      documentId: "landing-baza-wiedzy",
      children: [
        {
          id: "nav-metody",
          title: "Metody",
          schemaType: "page",
          documentId: "page-drupal-49",
          children: [],
        },
      ],
    },
  ]);
  assert.deepEqual(pageDocumentIds(entries), ["page-drupal-49"]);
});
