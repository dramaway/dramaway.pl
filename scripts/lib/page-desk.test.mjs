import assert from "node:assert/strict";
import { test } from "node:test";
import { pageDeskFolder, pageDeskIds } from "../../apps/studio/page-desk.ts";

const pinned = ["page-baza-wiedzy", "page-kontakt"];

test("drupal leftovers win over a menu pin and over news", () => {
  assert.equal(
    pageDeskFolder({ id: "page-drupal-37", slug: "szkolenia" }, pinned),
    "drupal",
  );
  assert.equal(
    pageDeskFolder({ id: "page-drupal-34", slug: "teatr-codzienny" }, ["page-drupal-34"]),
    "drupal",
  );
});

test("news and menu pins stay out of the leftover folder", () => {
  assert.equal(
    pageDeskFolder(
      { id: "news-drupal-70", slug: "aktualnosc-harmonia-artgeneracje" },
      pinned,
    ),
    "news",
  );
  assert.equal(
    pageDeskFolder({ id: "drafts.page-kontakt", slug: "kontakt" }, pinned),
    "menu",
  );
  assert.equal(
    pageDeskFolder({ id: "page-drupal-38", slug: "wydawnictwo" }, pinned),
    "rest",
  );
  assert.equal(
    pageDeskFolder({ id: "page-drupal-43", slug: "statut" }, pinned),
    "rest",
  );
});

test("desk ids include the published document and its draft", () => {
  assert.deepEqual(pageDeskIds(["drafts.page-kontakt", ""]), [
    "page-kontakt",
    "drafts.page-kontakt",
  ]);
});
