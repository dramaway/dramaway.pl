import assert from "node:assert/strict";
import test from "node:test";
import { projectEditionHeading } from "../../apps/web/src/lib/edition-label.ts";

test("Teatr Codzienny uses its edition title on the listing and edition page", () => {
  const edition = {
    title:
      "2017: KIEDYŚ BĘDZIE TU SANATORIUM — TEATR ZE SPOŁECZNOŚCIĄ",
    theme: "Teatr ze Społecznością",
    year: 2017,
    years: null,
  };

  assert.equal(
    projectEditionHeading("teatr-codzienny", edition),
    edition.title,
  );
});

test("other projects keep the year and theme edition heading", () => {
  assert.equal(
    projectEditionHeading("art-generacje", {
      title: "Edycja IX",
      theme: "Wspólnota",
      year: 2024,
      years: null,
    }),
    "2024: Wspólnota",
  );
});
