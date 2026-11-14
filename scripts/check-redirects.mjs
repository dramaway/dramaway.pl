/**
 * Check every certain legacy redirect against a running site.
 *
 *   node scripts/check-redirects.mjs http://127.0.0.1:3010
 *
 * The server must be started without COVER_MODE. A 301 must point at the
 * mapped target, and that target must answer 200.
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const origin = process.argv[2]?.replace(/\/+$/, "");
if (!origin) {
  console.error("Usage: node scripts/check-redirects.mjs <origin>");
  process.exit(1);
}

const mapPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../apps/web/src/data/legacy-redirects.json",
);
const redirects = JSON.parse(readFileSync(mapPath, "utf8"));
const entries = Object.entries(redirects);

function sameTarget(location, target) {
  if (!location) return false;
  if (/^https?:\/\//i.test(target)) {
    return location.split("?")[0] === target.split("?")[0];
  }
  try {
    const url = new URL(location, origin);
    const expected = new URL(target, origin);
    return url.pathname.replace(/\/+$/, "") === expected.pathname.replace(/\/+$/, "");
  } catch {
    return false;
  }
}

let failed = 0;
const problems = [];

for (const [from, target] of entries) {
  const source = new URL(from, origin);
  let redirect;
  try {
    redirect = await fetch(source, { redirect: "manual" });
  } catch (error) {
    failed += 1;
    problems.push(`${from} request failed: ${error.message}`);
    continue;
  }
  const location = redirect.headers.get("location");
  if (redirect.status !== 301 || !sameTarget(location, target)) {
    failed += 1;
    problems.push(`${from} → ${redirect.status} ${location || "(no location)"} expected 301 ${target}`);
    continue;
  }
  const destination = new URL(location, origin);
  let landed;
  try {
    landed = await fetch(destination, { redirect: "follow" });
  } catch (error) {
    failed += 1;
    problems.push(`${target} request failed: ${error.message}`);
    continue;
  }
  if (landed.status !== 200) {
    failed += 1;
    problems.push(`${target} → ${landed.status}, expected 200`);
  }
}

console.log(
  `Checked ${entries.length} redirects against ${origin}. Failed: ${failed}.`,
);
for (const line of problems) console.log(line);
process.exit(failed === 0 ? 0 : 1);
