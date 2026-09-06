/**
 * Create the O fundacji singleton if it does not exist.
 *
 * Does not overwrite an existing document. Does not run migrate:fundacja.
 *
 * Usage (from repo root):
 *   pnpm seed:about-page
 */

import { createClient } from "@sanity/client";
import { randomBytes } from "crypto";

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
});

const ABOUT_ID = "aboutPage";
const VALUE_LABELS = [
  "Zaufanie",
  "Energia",
  "Dialog",
  "Otwartość",
  "Wolność",
  "Szacunek",
  "Przestrzeń",
  "Ambicja",
];
const DOCUMENT_SLUGS = ["statut", "sprawozdania", "jak-nas-wesprzec"];

function key() {
  return randomBytes(6).toString("hex");
}

const existing = await client.fetch(`*[_id == $id][0]._id`, { id: ABOUT_ID });
if (existing) {
  console.log("aboutPage already exists — skip");
  process.exit(0);
}

const [people, pages] = await Promise.all([
  client.fetch(`*[_type == "person"] | order(name asc) { _id, name }`),
  client.fetch(
    `*[_type == "page" && slug.current in $slugs]{ _id, title, "slug": slug.current }`,
    { slugs: DOCUMENT_SLUGS },
  ),
]);

const pagesBySlug = new Map(pages.map((page) => [page.slug, page]));

const doc = {
  _id: ABOUT_ID,
  _type: "aboutPage",
  title: "O fundacji",
  ctaLabel: "zobacz nasze publikacje",
  ctaHref: "/czytelnia",
  methods: {
    heading: "Metody i wartości",
    ctaLabel: "dowiedz się więcej",
    ctaHref: "/metody",
    values: VALUE_LABELS.map((label) => ({
      _type: "aboutValue",
      _key: key(),
      label,
    })),
  },
  team: {
    heading: "Zespół",
    ctaLabel: "zobacz pełne bio",
    people: people.map((person) => ({
      _type: "reference",
      _key: key(),
      _ref: person._id,
    })),
  },
  history: {
    heading: "Historia fundacji",
    items: [],
  },
  documents: {
    heading: "Dokumenty i sprawozdania",
    items: DOCUMENT_SLUGS.flatMap((slug) => {
      const page = pagesBySlug.get(slug);
      if (!page) return [];
      return [
        {
          _type: "aboutDocument",
          _key: key(),
          title: page.title,
          page: { _type: "reference", _ref: page._id },
        },
      ];
    }),
  },
};

await client.createIfNotExists(doc);
console.log(
  `Created aboutPage (${people.length} people, ${doc.documents.items.length} documents). History left empty.`,
);
