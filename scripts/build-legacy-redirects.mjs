/**
 * Build the certain 301 map and the leftover paths for the 404 page.
 *
 * Reads private/dumps/drama_mfund_*.sql (not committed) and the public
 * Sanity dataset. Does not write to Sanity.
 *
 *   pnpm build:redirects
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  assembleLegacyMaps,
  collectFileLinks,
  legacyReport,
  readDrupalLegacy,
} from "./lib/legacy-redirect-build.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dumpsDir = path.join(root, "private", "dumps");
const dataDir = path.join(root, "apps", "web", "src", "data");
const reportPath = path.join(root, "docs", "migration", "redirects-report.md");

function findDump() {
  let names = [];
  try {
    names = readdirSync(dumpsDir);
  } catch {
    names = [];
  }
  const candidates = names
    .filter((name) => /^drama_mfund_.*\.sql(\.gz)?$/.test(name))
    .sort();
  return candidates.length
    ? path.join(dumpsDir, candidates[candidates.length - 1])
    : null;
}

function readDump(file) {
  const bytes = readFileSync(file);
  if (file.endsWith(".gz")) return gunzipSync(bytes).toString("utf8");
  return bytes.toString("utf8");
}

async function sanityQuery(query) {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "tr2qdg9j";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const endpoint = `https://${projectId}.api.sanity.io/v2025-01-01/data/query/${dataset}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  if (!response.ok) {
    throw new Error(`Sanity query failed (${response.status})`);
  }
  const payload = await response.json();
  return payload.result || [];
}

function drupalFromSanityNids(documents) {
  const nodes = [];
  for (const doc of documents) {
    const id = String(doc._id || "");
    if (doc._type === "publication") continue;
    const fromId = id.match(/^(?:page|news|person|project)-drupal-(\d+)$/);
    const newsId = id.match(/^news-(\d+)$/);
    const nid =
      typeof doc.nid === "number"
        ? doc.nid
        : fromId
          ? Number(fromId[1])
          : newsId
            ? Number(newsId[1])
            : null;
    if (nid == null) continue;
    const type =
      doc._type === "news"
        ? "aktualnosc"
        : doc._type === "person"
          ? "czlonek_zespolu"
          : "page";
    nodes.push({ nid, type, title: doc.title || "" });
  }
  return { nodes, aliases: [], redirects: [], files: [] };
}

async function main() {
  const dumpPath = findDump();
  let drupal;
  let dumpNote = "";
  if (dumpPath) {
    console.log(`Reading ${dumpPath}`);
    drupal = readDrupalLegacy(readDump(dumpPath));
    console.log(
      `Dump: ${drupal.nodes.length} published nodes, ${drupal.aliases.length} aliases, ${drupal.redirects.length} redirects, ${drupal.files.length} files`,
    );
  } else {
    dumpNote =
      "Zrzutu `private/dumps/drama_mfund_*.sql` nie było w tym środowisku, więc aliasy, łańcuchy `redirect` i pliki nie weszły do mapy. Zostały tylko adresy `/node/{nid}` dokumentów, które mają numer w `_id` albo w polu `nid`. Uruchom `pnpm build:redirects` tam, gdzie leży zrzut, żeby dopisać resztę.";
    console.warn(dumpNote);
  }

  const documents = await sanityQuery(`*[
    _type in ["page", "news", "person", "project", "publication", "aboutPage"] &&
    !(_id in path("drafts.**"))
  ]{
    _id,
    _type,
    "title": coalesce(title, name, ""),
    "name": name,
    "slug": slug.current,
    nid,
    "excerpt": coalesce(excerpt, summary, ""),
    body,
    sections,
    sectionsAfterBody,
    sectionsBeforeEditions,
    afterword,
    bio
  }`);
  const assets = await sanityQuery(`*[
    _type in ["sanity.fileAsset", "sanity.imageAsset"] &&
    defined(originalFilename)
  ]{ originalFilename, url }`);

  const routed = documents.filter((doc) =>
    ["page", "news", "person", "project", "publication"].includes(doc._type),
  );
  if (!drupal) drupal = drupalFromSanityNids(routed);
  const { redirects, paths } = assembleLegacyMaps(drupal, routed, assets);
  const fileLinks = collectFileLinks(documents, redirects);

  mkdirSync(dataDir, { recursive: true });
  writeFileSync(
    path.join(dataDir, "legacy-redirects.json"),
    `${JSON.stringify(redirects, null, 2)}\n`,
  );
  writeFileSync(
    path.join(dataDir, "legacy-paths.json"),
    `${JSON.stringify(paths, null, 2)}\n`,
  );
  writeFileSync(
    reportPath,
    legacyReport({ redirects, paths, fileLinks, note: dumpNote }),
  );
  console.log(
    `Wrote ${Object.keys(redirects).length} redirects and ${paths.length} leftover paths`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
