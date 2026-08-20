/**
 * Build Sanity `project` docs from already-migrated fundacja pages.
 *
 * Art Generacje: split page-drupal-35 Portable Text into intro + editions I–XI + afterword.
 * Archive projects: copy Teatr Codzienny / TO MI GRA / BOAL body onto `project`.
 *
 * Does not delete source `page` documents.
 *
 * Usage (from repo root):
 *   pnpm migrate:art-generacje
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

const writeClient = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

/** Dataset is public — read without the write token so a stale token still lets us inspect pages. */
const readClient = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  useCdn: false,
});

const ARCHIVE_SLUGS = ["teatr-codzienny", "to-mi-gra", "boal-practice"];

const EDITION_HEADING = /^(edycja)\b/i;
const CLOSING_HEADING =
  /^(autorki|współpraca|wspolpraca|artykuły|artykuly|dziękujemy|dziekujemy|partnerzy|sponsorzy)\b/i;

function key() {
  return randomBytes(6).toString("hex");
}

function slugify(title) {
  const repl = {
    ą: "a",
    ć: "c",
    ę: "e",
    ł: "l",
    ń: "n",
    ó: "o",
    ś: "s",
    ź: "z",
    ż: "z",
  };
  let s = (title || "").toLowerCase();
  for (const [a, b] of Object.entries(repl)) s = s.replaceAll(a, b);
  s = s.replace(/https?:\/\/\S+/g, "");
  s = s.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return s || "edition";
}

function blockText(block) {
  if (!block || block._type !== "block") return "";
  return (block.children || []).map((c) => c.text || "").join("");
}

function parseYear(title) {
  const m = title.match(/(?:19|20)\d{2}/);
  return m ? Number(m[0]) : undefined;
}

function parseYears(title) {
  const years = [...title.matchAll(/(?:19|20)\d{2}/g)].map((m) => m[0]);
  if (years.length >= 2) return `${years[0]}–${years[1]}`;
  return years[0] || "";
}

function isImage(block) {
  return block && block._type === "image";
}

function firstParagraph(blocks) {
  for (const b of blocks) {
    const t = blockText(b).trim();
    if (t) return t.slice(0, 400);
  }
  return "";
}

function splitCommaList(text) {
  return text
    .split(/[,;]|\n/)
    .map((s) => s.replace(/\s+/g, " ").trim())
    .filter((s) => s.length > 2 && !s.includes("[[SANITY_IMAGE"));
}

function splitArtGeneracje(body) {
  const intro = [];
  const editions = [];
  const afterword = [];
  let mode = "intro";
  let current = null;

  for (const block of body || []) {
    const text = blockText(block).trim();
    const heading = block._type === "block" && block.style === "h2";

    if (heading && EDITION_HEADING.test(text)) {
      if (current) editions.push(current);
      current = {
        title: text
          .replace(/https?:\/\/\S+/g, "")
          .replace(/[()]/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .replace(/[-–—]+$/, "")
          .trim(),
        blocks: [],
      };
      mode = "edition";
      continue;
    }
    if (heading && CLOSING_HEADING.test(text)) {
      if (current) {
        editions.push(current);
        current = null;
      }
      mode = "afterword";
    }

    if (mode === "intro") intro.push(block);
    else if (mode === "edition" && current) current.blocks.push(block);
    else afterword.push(block);
  }
  if (current) editions.push(current);

  return { intro, editions, afterword };
}

function editionDoc(entry) {
  const years = parseYears(entry.title);
  const year = parseYear(entry.title);
  const slug = slugify(`${entry.title}`);
  const gallery = entry.blocks.filter(isImage).map((img) => ({
    ...img,
    _key: key(),
  }));
  return {
    _type: "edition",
    _key: key(),
    title: entry.title,
    slug: { _type: "slug", current: slug },
    ...(year ? { year } : {}),
    ...(years ? { years } : {}),
    summary: firstParagraph(entry.blocks),
    body: entry.blocks,
    ...(gallery.length ? { gallery } : {}),
  };
}

async function migrateArtGeneracje() {
  const page = await readClient.fetch(
    `*[_type == "page" && slug.current == "art-generacje"][0]{ _id, title, body }`,
  );
  if (!page?.body?.length) {
    throw new Error("Missing page slug=art-generacje — run pnpm migrate:fundacja first");
  }

  const { intro, editions, afterword } = splitArtGeneracje(page.body);
  if (editions.length === 0) {
    throw new Error("No edition headings found on art-generacje page");
  }

  const partnerHeading = afterword.findIndex(
    (b) => b.style === "h2" && /^partnerzy\b/i.test(blockText(b)),
  );
  const sponsorHeading = afterword.findIndex(
    (b) => b.style === "h2" && /^sponsorzy\b/i.test(blockText(b)),
  );

  const partners =
    partnerHeading >= 0
      ? splitCommaList(blockText(afterword[partnerHeading + 1] || {}))
      : [];
  const sponsors =
    sponsorHeading >= 0
      ? splitCommaList(blockText(afterword[sponsorHeading + 1] || {}))
      : [];

  const doc = {
    _id: "project-art-generacje",
    _type: "project",
    title: "Art Generacje",
    slug: { _type: "slug", current: "art-generacje" },
    status: "active",
    featured: true,
    summary: firstParagraph(intro),
    body: intro,
    editions: editions.map(editionDoc),
    afterword,
    ...(partners.length ? { partners } : {}),
    ...(sponsors.length ? { sponsors } : {}),
  };

  await writeClient.createOrReplace(doc);
  console.log(
    `✓ project Art Generacje — ${editions.length} editions (source ${page._id})`,
  );
  for (const e of doc.editions) {
    console.log(`    ${e.years || "?"}  ${e.title}  /${e.slug.current}`);
  }
}

async function migrateArchiveProject(slug) {
  const page = await readClient.fetch(
    `*[_type == "page" && slug.current == $slug][0]{ _id, title, body }`,
    { slug },
  );
  if (!page) {
    console.warn(`  skip archive ${slug} — no page`);
    return;
  }
  await writeClient.createOrReplace({
    _id: `project-${slug}`,
    _type: "project",
    title: page.title,
    slug: { _type: "slug", current: slug },
    status: "archive",
    featured: false,
    summary: firstParagraph(page.body || []),
    body: page.body || [],
  });
  console.log(`✓ project ${page.title} (archive, source ${page._id})`);
}

async function main() {
  console.log(`Projects → ${projectId}/${dataset} …`);
  await migrateArtGeneracje();
  for (const slug of ARCHIVE_SLUGS) await migrateArchiveProject(slug);
  console.log("Done.");
}

main().catch((err) => {
  const code = err?.response?.body?.errorCode || err?.statusCode;
  if (code === "SIO-401-ANF" || err?.statusCode === 401) {
    console.error(
      "Write token rejected by Sanity (Session not found).\n" +
        "Create a new API token (Editor) at https://www.sanity.io/manage/project/tr2qdg9j/api#tokens\n" +
        "and replace SANITY_API_WRITE_TOKEN in apps/studio/.env — do not paste it into chat.",
    );
  } else {
    console.error(err);
  }
  process.exit(1);
});
