import assert from "node:assert/strict";
import { test } from "node:test";
import { newsCta } from "../../apps/web/src/lib/news-cta.ts";

test("an empty CTA stays on the article", () => {
  assert.deepEqual(newsCta({ slug: "harmonia-artgeneracje" }), {
    articleHref: "/harmonia-artgeneracje",
    ctaHref: null,
    label: "czytaj więcej",
  });
});

test("a custom target without its own label is ignored", () => {
  assert.deepEqual(
    newsCta({
      slug: "harmonia-artgeneracje",
      ctaHref: "https://centrum.dramaway.pl",
    }),
    {
      articleHref: "/harmonia-artgeneracje",
      ctaHref: null,
      label: "czytaj więcej",
    },
  );
});

test("a custom target keeps its own label", () => {
  assert.deepEqual(
    newsCta({
      slug: "harmonia-artgeneracje",
      ctaHref: "https://centrum.dramaway.pl",
      ctaLabel: "zobacz w Centrum",
    }),
    {
      articleHref: "/harmonia-artgeneracje",
      ctaHref: "https://centrum.dramaway.pl/",
      label: "zobacz w Centrum",
    },
  );
});

test("a target that is the article itself stays the default button", () => {
  assert.equal(
    newsCta({
      slug: "harmonia-artgeneracje",
      ctaHref: "/harmonia-artgeneracje",
      ctaLabel: "czytaj gdzie indziej",
    }).ctaHref,
    null,
  );
});
