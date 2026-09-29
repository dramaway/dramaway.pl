import assert from "node:assert/strict";
import { test } from "node:test";
import { publicPathForPage } from "../../apps/web/src/lib/routes.ts";

test("news prefix stays flat and ignores section", () => {
  assert.equal(
    publicPathForPage({
      slug: "aktualnosc-harmonia-artgeneracje",
      section: "projekty",
      isNews: true,
    }),
    "/harmonia-artgeneracje",
  );
});

test("section picks the prefix; a missing section is the site root", () => {
  assert.equal(publicPathForPage({ slug: "statut", section: "fundacja" }), "/fundacja/statut");
  assert.equal(
    publicPathForPage({ slug: "projekty-zakonczone", section: "projekty" }),
    "/projekty/projekty-zakonczone",
  );
  assert.equal(publicPathForPage({ slug: "wydawnictwo", section: "root" }), "/wydawnictwo");
  assert.equal(publicPathForPage({ slug: "wydawnictwo" }), "/wydawnictwo");
});
