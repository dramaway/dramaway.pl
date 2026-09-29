/**
 * Fill siteSettings.navigation with the current header when the list is empty.
 * Does not overwrite a list that already has items. Patches the published
 * document and, when present, an empty draft so Studio shows the same menu.
 *
 * Usage (from repo root):
 *   pnpm seed:navigation
 */

import assert from "node:assert/strict";
import { createClient } from "@sanity/client";
import { navigationProjection } from "../apps/web/src/lib/sanity/navigation-query.ts";
import "./lib/register-ts-extension.mjs";

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error("Missing SANITY_STUDIO_PROJECT_ID or SANITY_API_WRITE_TOKEN");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
  perspective: "raw",
});

const SINGLETONS = [
  "landing-projekty",
  "landing-czytelnia",
  "aboutPage",
];

function refItem(key, type, label, id) {
  return {
    _key: key,
    _type: type,
    label,
    target: "reference",
    page: { _type: "reference", _ref: id },
  };
}

function pathItem(key, type, label, href) {
  return {
    _key: key,
    _type: type,
    label,
    target: "path",
    href,
  };
}

function linkItem(key, type, label, id, href) {
  return id ? refItem(key, type, label, id) : pathItem(key, type, label, href);
}

function publishedPageId(pages, slug) {
  const published = pages.find(
    (page) => page.slug === slug && !String(page._id).startsWith("drafts."),
  );
  return published?._id ?? null;
}

let snapshot;
try {
  snapshot = await client.fetch(
    `{
      "settings": *[_type == "siteSettings"]{ _id, "items": count(navigation) },
      "singletons": *[_id in $singletons]{ _id },
      "pages": *[_type == "page" && slug.current in ["baza-wiedzy", "kontakt"]]{
        _id,
        "slug": slug.current
      }
    }`,
    { singletons: SINGLETONS },
  );
} catch (error) {
  const status = error && error.statusCode;
  if (status === 401) {
    console.error(
      "Sanity rejected SANITY_API_WRITE_TOKEN (401). Create a new robot token and update apps/studio/.env, then run pnpm seed:navigation again.",
    );
    process.exit(1);
  }
  throw error;
}

const publishedSettings = (snapshot.settings ?? []).filter(
  (doc) => !String(doc._id).startsWith("drafts."),
);

if (publishedSettings.length !== 1) {
  console.error(
    `Expected one published siteSettings document, found ${publishedSettings.length}.`,
  );
  process.exit(1);
}

const publishedId = publishedSettings[0]._id;
const draftId = `drafts.${publishedId}`;
const present = new Set(
  (snapshot.singletons ?? [])
    .map((doc) => doc._id)
    .filter((id) => !String(id).startsWith("drafts.")),
);
const knowledgeId = publishedPageId(snapshot.pages ?? [], "baza-wiedzy");
const kontaktId = publishedPageId(snapshot.pages ?? [], "kontakt");

const navigation = [
  linkItem(
    "projekty",
    "navItem",
    "Projekty",
    present.has("landing-projekty") ? "landing-projekty" : null,
    "/projekty",
  ),
  {
    ...linkItem(
      "baza-wiedzy",
      "navItem",
      "Baza wiedzy",
      knowledgeId,
      "/baza-wiedzy",
    ),
    children: [
      linkItem(
        "czytelnia",
        "navChild",
        "Czytelnia",
        present.has("landing-czytelnia") ? "landing-czytelnia" : null,
        "/czytelnia",
      ),
    ],
  },
  linkItem(
    "fundacja",
    "navItem",
    "O fundacji",
    present.has("aboutPage") ? "aboutPage" : null,
    "/fundacja",
  ),
  linkItem("kontakt", "navItem", "Kontakt", kontaktId, "/kontakt"),
];

function isEmpty(doc) {
  return doc.items == null || doc.items === 0;
}

const targets = [];
if (isEmpty(publishedSettings[0])) targets.push(publishedId);
const draft = (snapshot.settings ?? []).find((doc) => doc._id === draftId);
if (draft && isEmpty(draft)) targets.push(draftId);

if (targets.length === 0) {
  console.log("siteSettings.navigation already set — skip");
  process.exit(0);
}

for (const id of targets) {
  await client.patch(id).set({ navigation }).commit();
  console.log(`Set navigation on ${id}`);
}

if (!targets.includes(publishedId)) {
  process.exit(0);
}

const { resolveMainNav } = await import("../apps/web/src/lib/navigation.ts");
const published = client.withConfig({ perspective: "published" });
const stored = await published.fetch(
  `*[_id == $id][0].navigation[] { ${navigationProjection} }`,
  { id: publishedId },
);
const visible = resolveMainNav(stored).filter((item) => item.href !== "/");

assert.deepEqual(visible, [
  { href: "/projekty", label: "Projekty" },
  {
    href: "/baza-wiedzy",
    label: "Baza wiedzy",
    children: [{ href: "/czytelnia", label: "Czytelnia" }],
  },
  { href: "/fundacja", label: "O fundacji" },
  { href: "/kontakt", label: "Kontakt" },
]);

console.log("Published menu resolves to the current header.");
