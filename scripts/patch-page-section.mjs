/**
 * One-shot: set `page.section` from the slug lists that used to live in
 * `apps/web/src/lib/routes.ts`. Skips documents that already have a section.
 * Do not re-run after editors move pages — it will not overwrite a set value.
 *
 * Wydawnictwo (`page-drupal-38`) is root: `/wydawnictwo`.
 * The empty duplicate `wydawnictwo-1` is unpublished (draft kept).
 *
 * Usage (from repo root):
 *   pnpm patch:page-section            # write
 *   pnpm patch:page-section -- --dry-run
 */

import { createClient } from "@sanity/client";

const FUNDACJA = new Set([
  "zarzad-i-fundatorzy",
  "statut",
  "sprawozdania",
  "jak-nas-wesprzec",
]);

/** Leftover section pages and pages copied onto a `project` document. */
const PROJEKTY = new Set([
  "projekty-zakonczone",
  "portal-wiedzy",
  "szkolenia",
  "art-generacje-0",
  "art-generacje",
  "teatr-codzienny",
  "to-mi-gra",
  "boal-practice",
]);

const EMPTY_DUPLICATE_SLUG = "wydawnictwo-1";
const WYDAWNICTWO_ID = "page-drupal-38";
const SECTIONS = new Set(["root", "projekty", "fundacja"]);

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
const dryRun = process.argv.includes("--dry-run");

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
  token: dryRun ? token || undefined : token,
  useCdn: false,
});

function desiredSection(slug) {
  if (FUNDACJA.has(slug)) return "fundacja";
  if (PROJEKTY.has(slug)) return "projekty";
  return "root";
}

const rows = await client.fetch(
  `*[_type == "page" && defined(slug.current) && !(_id in path("drafts.**"))]{
    _id,
    "slug": slug.current,
    section,
    "bodyLen": length(pt::text(body))
  }`,
);

const pending = rows.filter((row) => !SECTIONS.has(row.section));

for (const row of pending) {
  const section = desiredSection(row.slug);
  console.log(
    `${dryRun ? "Would set" : "Setting"} ${row._id}  ${row.slug}  → ${section}`,
  );
  row.next = section;
}

if (!dryRun && pending.length > 0) {
  let tx = client.transaction();
  for (const row of pending) {
    tx = tx.patch(row._id, { set: { section: row.next } });
  }
  await tx.commit();
}

console.log(
  pending.length === 0
    ? "Section: nothing to patch."
    : `${dryRun ? "Dry run:" : "Wrote"} section on ${pending.length} of ${rows.length} pages.`,
);

function retarget(node, fromId, toId) {
  if (!node || typeof node !== "object") return 0;
  let count = 0;
  if (node._ref === fromId) {
    node._ref = toId;
    count += 1;
  }
  const values = Array.isArray(node) ? node : Object.values(node);
  for (const value of values) count += retarget(value, fromId, toId);
  return count;
}

const duplicate = rows.find((row) => row.slug === EMPTY_DUPLICATE_SLUG);
if (!duplicate) {
  console.log(`No published page with slug ${EMPTY_DUPLICATE_SLUG}.`);
} else if ((duplicate.bodyLen ?? 0) > 40) {
  console.warn(
    `Leaving ${duplicate._id} published — body is ${duplicate.bodyLen} characters, not the empty duplicate.`,
  );
} else if (dryRun) {
  console.log(
    `Would point siteSettings references from ${duplicate._id} to ${WYDAWNICTWO_ID}, then unpublish the duplicate.`,
  );
} else {
  const settings = await client.getDocument("siteSettings");
  const moved = settings
    ? retarget(settings, duplicate._id, WYDAWNICTWO_ID)
    : 0;
  if (moved > 0) {
    await client
      .patch("siteSettings")
      .set({
        navigation: settings.navigation,
        homepageSections: settings.homepageSections,
      })
      .commit();
    console.log(
      `Retargeted ${moved} siteSettings reference(s) to ${WYDAWNICTWO_ID}.`,
    );
  }

  const published = await client.getDocument(duplicate._id);
  if (!published) {
    console.log(`${duplicate._id} is already unpublished.`);
  } else {
    const { _id, _rev, ...rest } = published;
    await client.createOrReplace({
      ...rest,
      _id: `drafts.${_id}`,
      section: rest.section ?? "root",
    });
    await client.delete(_id);
    console.log(`Unpublished ${_id}; draft kept at drafts.${_id}.`);
  }
}
