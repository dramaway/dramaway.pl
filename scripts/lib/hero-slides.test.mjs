import assert from "node:assert/strict";
import { test } from "node:test";
import {
  resolveHeroSlider,
  resolveHeroSlides,
} from "../../apps/web/src/lib/hero-slides.ts";

const asset = { _ref: "image-abc" };

test("a single legacy image stays one still", () => {
  const slides = resolveHeroSlides(null, { asset, alt: "Kadr" }, "Fundacja");
  assert.equal(slides.length, 1);
  assert.equal(slides[0]._key, "legacy");
  assert.equal(slides[0].alt, "Kadr");
});

test("an empty list falls back to the legacy still", () => {
  const slides = resolveHeroSlides([], { asset, alt: "" }, "Tytuł");
  assert.equal(slides.length, 1);
  assert.equal(slides[0].alt, "Tytuł");
});

test("a non-empty list replaces the legacy still and caps at five", () => {
  const many = Array.from({ length: 6 }, (_, index) => ({
    _key: `k${index}`,
    asset,
    alt: index === 0 ? "" : `Alt ${index}`,
  }));
  const slides = resolveHeroSlides(many, { asset, alt: "Stare" }, "Fallback");
  assert.equal(slides.length, 5);
  assert.equal(slides[0]._key, "k0");
  assert.equal(slides[0].alt, "Fallback");
  assert.equal(slides[1].alt, "Alt 1");
  assert.equal(slides.some((slide) => slide.alt === "Stare"), false);
});

test("slides without an asset are skipped", () => {
  const slides = resolveHeroSlides(
    [{ _key: "empty", alt: "Nie" }, { _key: "ok", asset, alt: "Tak" }],
    { asset, alt: "Stare" },
    "Fallback",
  );
  assert.equal(slides.length, 1);
  assert.equal(slides[0]._key, "ok");
  assert.equal(slides[0].alt, "Tak");
});

test("no assets means no stills", () => {
  assert.deepEqual(resolveHeroSlides([], null, "Tytuł"), []);
});

test("slider settings clamp and default", () => {
  assert.deepEqual(resolveHeroSlider(null), { interval: 7, autoplay: true });
  assert.deepEqual(resolveHeroSlider({}), { interval: 7, autoplay: true });
  assert.deepEqual(resolveHeroSlider({ interval: 2, autoplay: false }), {
    interval: 4,
    autoplay: false,
  });
  assert.deepEqual(resolveHeroSlider({ interval: 99.2 }), {
    interval: 20,
    autoplay: true,
  });
  assert.deepEqual(resolveHeroSlider({ interval: 8.6, autoplay: true }), {
    interval: 9,
    autoplay: true,
  });
});
