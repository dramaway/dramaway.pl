import { normalizeLegacyPath } from "../../apps/web/src/lib/legacy-redirects.ts";
import { columnIndex, readInsert, splitSqlRows, tableColumns } from "./sql-inserts.mjs";

const FILE_PREFIXES = ["/sites/fundacja/files/", "/sites/default/files/"];

/**
 * Published nodes, aliases, redirect rows and public files from a fundacja dump.
 * Column order follows CREATE TABLE when the dump has it, otherwise Drupal 7.
 */
export function readDrupalLegacy(sqlText) {
  const nodeCols = tableColumns(sqlText, "node");
  const aliasCols = tableColumns(sqlText, "url_alias");
  const redirectCols = tableColumns(sqlText, "redirect");
  const fileCols = tableColumns(sqlText, "file_managed");

  const nidAt = columnIndex(nodeCols, "nid", 0);
  const typeAt = columnIndex(nodeCols, "type", 2);
  const titleAt = columnIndex(nodeCols, "title", 4);
  const statusAt = columnIndex(nodeCols, "status", 6);

  const sourceAt = columnIndex(aliasCols, "source", 1);
  const aliasAt = columnIndex(aliasCols, "alias", 2);

  const redirectSourceAt = columnIndex(redirectCols, "source", 4);
  const redirectTargetAt = columnIndex(redirectCols, "redirect", 6);

  const fidAt = columnIndex(fileCols, "fid", 0);
  const filenameAt = columnIndex(fileCols, "filename", 2);
  const uriAt = columnIndex(fileCols, "uri", 3);

  const nodes = [];
  for (const row of splitSqlRows(readInsert(sqlText, "node"))) {
    if (row[statusAt] !== "1") continue;
    const nid = Number(row[nidAt]);
    if (!Number.isInteger(nid)) continue;
    nodes.push({
      nid,
      type: String(row[typeAt] || ""),
      title: String(row[titleAt] || "").trim(),
    });
  }

  const aliases = [];
  for (const row of splitSqlRows(readInsert(sqlText, "url_alias"))) {
    const source = String(row[sourceAt] || "");
    const alias = String(row[aliasAt] || "");
    if (!source || !alias) continue;
    aliases.push({ source, alias });
  }

  const redirects = [];
  for (const row of splitSqlRows(readInsert(sqlText, "redirect"))) {
    const source = String(row[redirectSourceAt] || "");
    const target = String(row[redirectTargetAt] || "");
    if (!source || !target) continue;
    redirects.push({ source, target });
  }

  const files = [];
  for (const row of splitSqlRows(readInsert(sqlText, "file_managed"))) {
    const uri = String(row[uriAt] || "");
    const filename = String(row[filenameAt] || "");
    const relative = uri.startsWith("public://")
      ? uri.slice("public://".length)
      : filename;
    if (!relative) continue;
    const clean = relative.replace(/^\/+/, "");
    files.push({
      fid: String(row[fidAt] || ""),
      filename: filename || clean.split("/").pop() || clean,
      paths: FILE_PREFIXES.map((prefix) => `${prefix}${clean}`),
    });
  }

  return { nodes, aliases, redirects, files };
}

function nidFromDocument(doc) {
  // Publication nids come from the czytelnia database, not fundacja nodes.
  // Only ids written by the fundacja migration count as a node number.
  if (doc._type === "publication") return null;
  const fromId = String(doc._id || "").match(
    /^(?:page|news|person|project)-drupal-(\d+)$/,
  );
  if (fromId) return Number(fromId[1]);
  const newsId = String(doc._id || "").match(/^news-(\d+)$/);
  if (newsId) return Number(newsId[1]);
  if (doc._type !== "page" && doc._type !== "news" && doc._type !== "person" && doc._type !== "project") {
    return null;
  }
  if (typeof doc.nid === "number" && Number.isInteger(doc.nid)) return doc.nid;
  if (typeof doc.nid === "string" && /^\d+$/.test(doc.nid)) return Number(doc.nid);
  return null;
}

function publicPath(doc, projectSlugs) {
  const slug = String(doc.slug || "").trim();
  if (!slug || slug === "metody-tzs") return null;
  if (doc._type === "project") return `/projekty/${slug}`;
  if (doc._type === "person") return `/zespol/${slug}`;
  if (doc._type === "publication") return `/czytelnia/${slug}`;
  const newsSlug = slug.startsWith("aktualnosc-") ? slug.slice("aktualnosc-".length) : slug;
  if (doc._type === "news" || slug.startsWith("aktualnosc-")) {
    return newsSlug ? `/${newsSlug}` : null;
  }
  if (slug === "metody") return "/baza-wiedzy";
  if (projectSlugs.has(slug)) return `/projekty/${slug}`;
  return `/${slug}`;
}

function pathType(node, aliasPath) {
  if (node?.type === "aktualnosc") return "aktualność";
  if (aliasPath.startsWith("/projekty/") || aliasPath === "/projekty") return "projekt";
  return "strona";
}

function resolveChain(start, hops) {
  let current = normalizeLegacyPath(start.startsWith("/") ? start : `/${start}`);
  const seen = new Set();
  while (hops.has(current) && !seen.has(current)) {
    seen.add(current);
    current = hops.get(current);
  }
  return current;
}

/**
 * Certain redirects and the leftover paths used by the 404 page.
 * A node matches only by nid. A file matches only when one Sanity asset
 * has the same original filename.
 */
export function assembleLegacyMaps(drupal, documents, assets) {
  const projectSlugs = new Set(
    documents.filter((doc) => doc._type === "project" && doc.slug).map((doc) => doc.slug),
  );
  const byNid = new Map();
  for (const doc of documents) {
    const nid = nidFromDocument(doc);
    const target = publicPath(doc, projectSlugs);
    if (nid == null || !target) continue;
    const list = byNid.get(nid) || [];
    list.push({ doc, target });
    byNid.set(nid, list);
  }

  const certainByNid = new Map();
  for (const [nid, list] of byNid) {
    const targets = [...new Set(list.map((item) => item.target))];
    if (targets.length === 1) certainByNid.set(nid, targets[0]);
  }

  const assetsByName = new Map();
  for (const asset of assets) {
    const name = String(asset.originalFilename || "")
      .split(/[/\\]/)
      .pop()
      ?.toLowerCase();
    const url = String(asset.url || "");
    if (!name || !url) continue;
    const list = assetsByName.get(name) || [];
    if (!list.includes(url)) list.push(url);
    assetsByName.set(name, list);
  }

  const fileTarget = new Map();
  for (const file of drupal.files) {
    const urls = uniqueAssetUrls(file, assetsByName);
    if (urls.length !== 1) continue;
    for (const path of file.paths) fileTarget.set(normalizeLegacyPath(path), urls[0]);
  }

  const nodeById = new Map(drupal.nodes.map((node) => [node.nid, node]));
  const aliasByNid = new Map();
  const nidByAlias = new Map();
  for (const row of drupal.aliases) {
    const match = String(row.source).match(/^node\/(\d+)$/);
    if (!match) continue;
    const nid = Number(match[1]);
    aliasByNid.set(nid, row.alias);
    const aliasPath = normalizeLegacyPath(
      row.alias.startsWith("/") ? row.alias : `/${row.alias}`,
    );
    nidByAlias.set(aliasPath, nid);
  }

  const hops = new Map();
  for (const row of drupal.redirects) {
    const source = normalizeLegacyPath(row.source.startsWith("/") ? row.source : `/${row.source}`);
    const target = /^https?:\/\//i.test(row.target)
      ? row.target
      : normalizeLegacyPath(row.target.startsWith("/") ? row.target : `/${row.target}`);
    hops.set(source, target);
  }

  const redirects = {};
  const paths = [];
  const seenPaths = new Set();

  function addRedirect(rawPath, target) {
    const path = normalizeLegacyPath(rawPath.startsWith("/") ? rawPath : `/${rawPath}`);
    if (!path || path === "/" || path === target) return;
    if (redirects[path] && redirects[path] !== target) return;
    redirects[path] = target;
  }

  function addPath(rawPath, title, type) {
    const path = normalizeLegacyPath(rawPath.startsWith("/") ? rawPath : `/${rawPath}`);
    if (!path || path === "/" || redirects[path] || seenPaths.has(path)) return;
    seenPaths.add(path);
    paths.push({ path, title: title || path, type });
  }

  for (const node of drupal.nodes) {
    const target = certainByNid.get(node.nid) || null;
    const alias = aliasByNid.get(node.nid);
    const aliasPath = alias ? normalizeLegacyPath(alias.startsWith("/") ? alias : `/${alias}`) : "";
    const sources = [`/node/${node.nid}`];
    if (aliasPath) sources.push(aliasPath);
    if (target) {
      for (const source of sources) addRedirect(source, target);
    } else {
      for (const source of sources) {
        addPath(source, node.title, pathType(node, aliasPath || source));
      }
    }
  }

  for (const row of drupal.redirects) {
    const source = normalizeLegacyPath(
      row.source.startsWith("/") ? row.source : `/${row.source}`,
    );
    const finalPath = resolveChain(source, hops);
    const nodeMatch = finalPath.match(/^\/node\/(\d+)$/);
    const nid = nodeMatch ? Number(nodeMatch[1]) : nidByAlias.get(finalPath) ?? null;
    const node = nid != null ? nodeById.get(nid) : null;
    const target =
      (nid != null ? certainByNid.get(nid) : null) || fileTarget.get(finalPath) || null;
    if (target) addRedirect(source, target);
    else if (node) addPath(source, node.title, pathType(node, finalPath));
  }

  for (const file of drupal.files) {
    const urls = uniqueAssetUrls(file, assetsByName);
    for (const raw of file.paths) {
      const path = normalizeLegacyPath(raw);
      if (urls.length === 1) addRedirect(path, urls[0]);
      else addPath(path, file.filename, "plik");
    }
  }

  const redirectEntries = Object.fromEntries(
    Object.entries(redirects).sort(([a], [b]) => a.localeCompare(b, "pl")),
  );
  const leftover = paths
    .filter((row) => !redirectEntries[row.path])
    .sort((a, b) => a.path.localeCompare(b.path, "pl"));
  return { redirects: redirectEntries, paths: leftover };
}

function uniqueAssetUrls(file, assetsByName) {
  const names = new Set(
    [file.filename, ...file.paths.map((path) => path.split("/").pop() || "")]
      .map((name) => name.toLowerCase())
      .filter(Boolean),
  );
  const urls = new Set();
  for (const name of names) {
    for (const url of assetsByName.get(name) || []) urls.add(url);
  }
  return [...urls];
}

export function legacyReport({ redirects, paths, fileLinks, note = "" }) {
  const redirectList = Object.entries(redirects);
  const sample = (rows) => rows.slice(0, 8);
  const lines = [
    "# Mapa starych adresów",
    "",
    `Pewne przekierowania: **${redirectList.length}**. Bez pewnego celu: **${paths.length}**.`,
    "",
    "Pewne oznacza numer noda zapisany w dokumencie Sanity albo jedną nazwę pliku w assetach. Reszta zostaje na stronie „nie znaleziono”.",
    "",
    ...(note ? [note, ""] : []),
    "## Przykłady pewnych",
    "",
    ...(redirectList.length
      ? sample(redirectList).map(([path, target]) => `- \`${path}\` → \`${target}\``)
      : ["Brak."]),
    "",
    "## Przykłady bez celu",
    "",
    ...(paths.length
      ? sample(paths).map((row) => `- \`${row.path}\` (${row.type}) ${row.title}`)
      : ["Brak. Każdy numer noda z migracji fundacji ma cel."]),
    "",
    "## Linki w treści do starych plików",
    "",
    "Treści w Sanity nie były zmieniane.",
    "",
  ];
  if (!fileLinks.length) {
    lines.push("Brak linków wskazujących na `/sites/…/files/`.");
  } else {
    for (const link of fileLinks) {
      const proposal = link.proposed
        ? `Proponowany adres: \`${link.proposed}\`.`
        : "Brak jednego pliku o tej nazwie w Sanity.";
      lines.push(
        `- ${link.title || link.id}: \`${link.href}\`. ${proposal}`,
      );
    }
  }
  lines.push("");
  return lines.join("\n");
}

export function collectFileLinks(documents, redirects) {
  const links = [];
  const seen = new Set();
  for (const doc of documents) {
    for (const href of walkHrefs(doc)) {
      if (!href.includes("/sites/") || !href.includes("/files/")) continue;
      const key = `${doc._id}|${href}`;
      if (seen.has(key)) continue;
      seen.add(key);
      let path = href;
      try {
        const url = new URL(href, "https://fundacja.dramaway.pl");
        path = url.pathname;
      } catch {
        // Keep the raw href.
      }
      const normalized = normalizeLegacyPath(path);
      links.push({
        id: doc._id,
        title: doc.title || doc.name || doc._id,
        href,
        proposed: redirects[normalized] && /^https?:\/\//.test(redirects[normalized])
          ? redirects[normalized]
          : null,
      });
    }
  }
  return links;
}

function walkHrefs(value, out = []) {
  if (!value || typeof value !== "object") return out;
  if (Array.isArray(value)) {
    for (const item of value) walkHrefs(item, out);
    return out;
  }
  if (typeof value.href === "string") out.push(value.href);
  for (const child of Object.values(value)) {
    if (child && typeof child === "object") walkHrefs(child, out);
  }
  return out;
}
