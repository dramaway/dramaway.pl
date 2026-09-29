import assert from "node:assert/strict";
import { test } from "node:test";
import { publicPathForPage } from "../../apps/web/src/lib/routes.ts";

test("news prefix stays flat", () => {
  assert.equal(
    publicPathForPage({
      slug: "aktualnosc-harmonia-artgeneracje",
      isNews: true,
    }),
    "/harmonia-artgeneracje",
  );
});

test("a page lives at the site root", () => {
  assert.equal(publicPathForPage({ slug: "statut" }), "/statut");
  assert.equal(publicPathForPage({ slug: "wydawnictwo" }), "/wydawnictwo");
  assert.equal(publicPathForPage({ slug: "szkolenia" }), "/szkolenia");
});
