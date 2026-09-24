/**
 * Move the old named homepage slots into homepage.sections.
 * Skips a document that already has sections. Does not invent copy.
 *
 * Usage (from repo root):
 *   pnpm seed:homepage-sections
 */

import { createClient } from "@sanity/client";

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

function text(value) {
  const trimmed = typeof value === "string" ? value.trim() : "";
  return trimmed || undefined;
}

function imageValue(image) {
  const ref = image?.asset?._ref;
  if (!ref) return undefined;
  const value = {
    _type: "image",
    asset: { _type: "reference", _ref: ref },
  };
  if (image.hotspot) value.hotspot = image.hotspot;
  if (image.crop) value.crop = image.crop;
  const alt = text(image.alt);
  if (alt) value.alt = alt;
  return value;
}

function pathTile(key, fields) {
  const href = text(fields.href);
  const title = text(fields.title);
  const excerpt = text(fields.excerpt);
  const ctaLabel = text(fields.ctaLabel);
  if (!href && !title && !excerpt) return null;
  return {
    _key: key,
    _type: "contentTile",
    target: "path",
    ...(href ? { href } : {}),
    ...(title ? { title } : {}),
    ...(excerpt ? { excerpt } : {}),
    ...(ctaLabel ? { ctaLabel } : {}),
  };
}

function refTile(key, id, fields = {}) {
  const excerpt = text(fields.excerpt);
  const title = text(fields.title);
  const ctaLabel = text(fields.ctaLabel);
  return {
    _key: key,
    _type: "contentTile",
    target: "reference",
    page: { _type: "reference", _ref: id },
    ...(title ? { title } : {}),
    ...(excerpt ? { excerpt } : {}),
    ...(ctaLabel ? { ctaLabel } : {}),
  };
}

function buildSections(homepage, featuredId, czytelniaId) {
  const about = homepage?.about ?? {};
  const methods = homepage?.methods ?? {};
  const featured = homepage?.featured ?? {};
  const czytelnia = homepage?.czytelnia ?? {};

  const sections = [
    { _key: "news", _type: "newsFeedModule" },
  ];

  const aboutTiles = [
    pathTile("tile-about", {
      title: about.heading,
      excerpt: about.lead,
      ctaLabel: about.ctaLabel,
      href: about.ctaHref,
    }),
    pathTile("tile-methods", {
      title: methods.heading,
      excerpt: methods.lead,
      ctaLabel: methods.ctaLabel,
      href: methods.ctaHref,
    }),
  ].filter(Boolean);

  const image = imageValue(about.image);
  if (aboutTiles.length > 0) {
    sections.push({
      _key: "about-methods",
      _type: "contentModule",
      textLayout: "list",
      ...(image ? { image } : {}),
      tiles: aboutTiles,
    });
  }

  const listTiles = [];
  if (featuredId) {
    listTiles.push(refTile("tile-featured", featuredId, { excerpt: featured.lead }));
  } else {
    const fallback = pathTile("tile-featured", {
      title: featured.label,
      excerpt: featured.lead,
      href: featured.ctaHref,
    });
    if (fallback) listTiles.push(fallback);
  }

  if (czytelniaId) {
    listTiles.push(
      refTile("tile-czytelnia", czytelniaId, {
        title: czytelnia.heading,
        excerpt: czytelnia.lead,
        ctaLabel: czytelnia.ctaLabel,
      }),
    );
  } else {
    const fallback = pathTile("tile-czytelnia", {
      title: czytelnia.heading,
      excerpt: czytelnia.lead,
      ctaLabel: czytelnia.ctaLabel,
      href: czytelnia.ctaHref || "/czytelnia",
    });
    if (fallback && (text(czytelnia.heading) || text(czytelnia.lead) || text(czytelnia.ctaLabel))) {
      listTiles.push(fallback);
    }
  }

  if (listTiles.length > 0) {
    sections.push({
      _key: "featured-list",
      _type: "contentModule",
      textLayout: "list",
      tiles: listTiles,
    });
  }

  return sections;
}

const snapshot = await client.fetch(
  `{
    "settings": *[_type == "siteSettings"]{
      _id,
      homepage,
      homepageSections
    },
    "featuredId": *[_type == "project" && featured == true && !(_id in path("drafts.**"))][0]._id,
    "czytelniaId": *[_id == "landing-czytelnia"][0]._id
  }`,
);

let patched = 0;
for (const doc of snapshot.settings ?? []) {
  const moved = doc.homepage?.sections;
  const current = doc.homepageSections;
  if (Array.isArray(current) && current.length > 0) {
    if (doc.homepage) {
      await client.patch(doc._id).unset(["homepage"]).commit();
      console.log(`unset leftover homepage on ${doc._id}`);
    } else {
      console.log(`skip ${doc._id} (sections already set)`);
    }
    continue;
  }
  const sections =
    Array.isArray(moved) && moved.length > 0
      ? moved
      : buildSections(doc.homepage, snapshot.featuredId, snapshot.czytelniaId);
  await client
    .patch(doc._id)
    .set({ homepageSections: sections })
    .unset(["homepage"])
    .commit();
  patched += 1;
  console.log(`patched ${doc._id} (${sections.length} sections)`);
}

if ((snapshot.settings ?? []).length === 0) {
  console.error("No siteSettings document");
  process.exit(1);
}

console.log(`Done. Patched ${patched}.`);
