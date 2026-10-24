import assert from "node:assert/strict";
import { test } from "node:test";
import {
  UNCATEGORIZED_CATEGORY_SLUG,
  czytelniaCategoryHeadingId,
  czytelniaFilterHref,
  firstSearchParam,
  resolvePublicationCategory,
  resolvePublicationFormat,
} from "../../apps/web/src/lib/czytelnia-filters.ts";

test("firstSearchParam takes the first trimmed value", () => {
  assert.equal(firstSearchParam(undefined), undefined);
  assert.equal(firstSearchParam("  "), undefined);
  assert.equal(firstSearchParam("teatr-forum"), "teatr-forum");
  assert.equal(firstSearchParam(["", "teatr-forum"]), undefined);
  assert.equal(firstSearchParam(["teatr-forum", "drama"]), "teatr-forum");
});

test("czytelniaFilterHref omits the default format and encodes both axes", () => {
  assert.equal(czytelniaFilterHref(), "/baza-wiedzy");
  assert.equal(czytelniaFilterHref({ rodzaj: "articles" }), "/baza-wiedzy");
  assert.equal(
    czytelniaFilterHref({ rodzaj: "books" }),
    "/baza-wiedzy?rodzaj=books",
  );
  assert.equal(
    czytelniaFilterHref({ kategoria: "teatr-forum" }),
    "/baza-wiedzy?kategoria=teatr-forum",
  );
  assert.equal(
    czytelniaFilterHref({
      rodzaj: "scripts",
      kategoria: "teatr-w-edukacji",
    }),
    "/baza-wiedzy?rodzaj=scripts&kategoria=teatr-w-edukacji",
  );
  assert.equal(
    czytelniaFilterHref({
      rodzaj: "articles",
      kategoria: UNCATEGORIZED_CATEGORY_SLUG,
    }),
    "/baza-wiedzy?kategoria=pozostale",
  );
});

test("resolvePublicationCategory only accepts slugs from the listing", () => {
  const slugs = ["drama", "teatr-forum", UNCATEGORIZED_CATEGORY_SLUG];
  assert.equal(resolvePublicationCategory("teatr-forum", slugs), "teatr-forum");
  assert.equal(resolvePublicationCategory("nie-ma", slugs), undefined);
  assert.equal(resolvePublicationCategory(undefined, slugs), undefined);
});

test("resolvePublicationFormat still prefers articles when present", () => {
  assert.equal(
    resolvePublicationFormat("books", ["articles", "books"]),
    "books",
  );
  assert.equal(
    resolvePublicationFormat("nope", ["articles", "books"]),
    "articles",
  );
});

test("czytelniaCategoryHeadingId is stable for URL hashes", () => {
  assert.equal(
    czytelniaCategoryHeadingId("teatr-ze-spolecznoscia"),
    "czytelnia-teatr-ze-spolecznoscia",
  );
});

test("essay headwords share the tone of their category", async () => {
  const { categoryToneForSlug, categoryToneForTerm } = await import(
    "../../apps/web/src/lib/category-tones.ts"
  );
  assert.equal(
    categoryToneForTerm("Teatr w Edukacji (TIE)"),
    categoryToneForSlug("teatr-w-edukacji"),
  );
  assert.equal(
    categoryToneForTerm("Teatr zaangażowany społecznie"),
    categoryToneForSlug("teatr-zaangazowany-spolecznie"),
  );
  assert.equal(
    categoryToneForTerm("Drama edukacyjna"),
    categoryToneForSlug("drama"),
  );
  assert.equal(categoryToneForTerm("Coś innego"), null);
});
