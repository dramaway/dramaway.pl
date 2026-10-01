/**
 * Copy a legacy single hero still into `heroImages` when that list is empty.
 *
 * Sources:
 *   siteSettings.heroImage
 *   page.heroImage
 *   landingPage.image
 *   aboutPage.image
 *
 * A list that already has an asset is left alone. Legacy fields stay in the
 * document unless `--unset-legacy` is passed. Do not pass that flag until the
 * frontend that only reads `heroImages` is what Netlify is serving — `main`
 * still renders the old fields.
 *
 * Usage (from repo root):
 *   pnpm patch:hero-images -- --dry-run
 *   pnpm patch:hero-images
 *   pnpm patch:hero-images -- --unset-legacy
 */

import { randomBytes } from "node:crypto";
import { createClient } from "@sanity/client";

const SOURCES = [
  { type: "siteSettings", field: "heroImage" },
  { type: "page", field: "heroImage" },
  { type: "landingPage", field: "image" },
  { type: "aboutPage", field: "image" },
];

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
const dryRun = process.argv.includes("--dry-run");
const unsetLegacy = process.argv.includes("--unset-legacy");

if (!projectId) {
  console.error("Missing SANITY_STUDIO_PROJECT_ID");
  process.exit(1);
}
if (!dryRun && !token) {
  console.error("Missing SANITY_API_WRITE_TOKEN (needed unless --dry-run)");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token: token || undefined,
  useCdn: false,
  perspective: "raw",
});

function assetRef(image) {
  const ref = image?.asset?._ref;
  return typeof ref === "string" && ref.trim() ? ref : null;
}

function filledSlides(list) {
  return (Array.isArray(list) ? list : []).filter((slide) => assetRef(slide));
}

function slideKey() {
  return randomBytes(6).toString("hex");
}

/** Keep the asset, hotspot, crop, and alt. Array items need a `_key`. */
function toSlide(image) {
  const key =
    typeof image._key === "string" && image._key.trim()
      ? image._key.trim()
      : slideKey();
  const slide = {
    _key: key,
    _type: "image",
    asset: image.asset,
  };
  if (image.hotspot) slide.hotspot = image.hotspot;
  if (image.crop) slide.crop = image.crop;
  if (typeof image.alt === "string") slide.alt = image.alt;
  return slide;
}

const fieldByType = Object.fromEntries(
  SOURCES.map((source) => [source.type, source.field]),
);
const types = SOURCES.map((source) => source.type);

const rows = await client.fetch(
  `*[_type in $types]{
    _id,
    _type,
    "slug": slug.current,
    heroImages,
    heroImage,
    image
  }`,
  { types },
);

const plans = [];

for (const row of rows) {
  const field = fieldByType[row._type];
  const legacy = row[field];
  const legacyRef = assetRef(legacy);
  const existing = filledSlides(row.heroImages);

  if (existing.length > 0) {
    plans.push({
      action: "keep",
      id: row._id,
      type: row._type,
      slug: row.slug ?? "",
      slides: existing.length,
      legacyRef,
      unset: Boolean(unsetLegacy && legacyRef),
    });
    continue;
  }

  if (!legacyRef) continue;

  plans.push({
    action: "copy",
    id: row._id,
    type: row._type,
    slug: row.slug ?? "",
    field,
    legacyRef,
    slide: toSlide(legacy),
    unset: unsetLegacy,
  });
}

if (plans.length === 0) {
  console.log("Nothing to patch — no empty hero list still has a legacy still.");
  process.exit(0);
}

for (const plan of plans) {
  const where = [plan.type, plan.id, plan.slug].filter(Boolean).join("  ");
  if (plan.action === "keep") {
    const legacyNote = plan.legacyRef
      ? `legacy ${plan.legacyRef}${plan.unset ? " would be unset" : " left in place"}`
      : "no legacy still";
    console.log(
      `${dryRun ? "Would keep" : "Keeping"} ${where}  (${plan.slides} slides; ${legacyNote})`,
    );
    continue;
  }
  const flags = [
    plan.slide.hotspot ? "hotspot" : null,
    plan.slide.crop ? "crop" : null,
    typeof plan.slide.alt === "string" ? "alt" : null,
  ]
    .filter(Boolean)
    .join(", ");
  console.log(
    `${dryRun ? "Would copy" : "Copying"} ${where}  ${plan.field} → heroImages[0]  ${plan.legacyRef}${flags ? `  (${flags})` : ""}${plan.unset ? "  + unset " + plan.field : ""}`,
  );
}

const writes = plans.filter(
  (plan) => plan.action === "copy" || (plan.action === "keep" && plan.unset),
);

if (writes.length === 0) {
  console.log("Nothing to write.");
  process.exit(0);
}

if (dryRun) {
  console.log(`Dry run: ${writes.length} document(s) would change.`);
  process.exit(0);
}

let tx = client.transaction();
for (const plan of writes) {
  if (plan.action === "copy") {
    const patch = { set: { heroImages: [plan.slide] } };
    if (plan.unset) patch.unset = [plan.field];
    tx = tx.patch(plan.id, patch);
    continue;
  }
  tx = tx.patch(plan.id, { unset: [fieldByType[plan.type]] });
}
await tx.commit();
console.log(`Patched ${writes.length} document(s).`);
