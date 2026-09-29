import assert from "node:assert/strict";
import { test } from "node:test";
import {
  newsSlugFromLegacy,
  newsTitleFromLegacy,
} from "./news-migrate.mjs";

test("legacy news slugs drop the prefix", () => {
  assert.equal(
    newsSlugFromLegacy("aktualnosc-harmonia-artgeneracje"),
    "harmonia-artgeneracje",
  );
  assert.equal(newsSlugFromLegacy("harmonia-artgeneracje"), "harmonia-artgeneracje");
});

test("legacy news titles drop the bracket prefix", () => {
  assert.equal(
    newsTitleFromLegacy("[Aktualność] Harmonia ArtGeneracje"),
    "Harmonia ArtGeneracje",
  );
  assert.equal(newsTitleFromLegacy("Już bez nawiasu"), "Już bez nawiasu");
});
