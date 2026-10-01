import assert from "node:assert/strict";
import { test } from "node:test";
import {
  resolveHeroSlider,
  resolveHeroSlides,
} from "../../apps/web/src/lib/hero-slides.ts";

const asset = { _ref: "image-abc" };

test("zero assets means no stills", () => {
  assert.deepEqual(resolveHeroSlides(null, "Tytuł"), []);
  assert.deepEqual(resolveHeroSlides([], "Tytuł"), []);
  assert.deepEqual(resolveHeroSlides([{ _key: "empty", alt: "Nie" }], "Tytuł"), []);
});

test("one asset is one still and a missing key is filled", () => {
  const slides = resolveHeroSlides([{ asset, alt: "Kadr" }], "Fundacja");
  assert.equal(slides.length, 1);
  assert.equal(slides[0]._key, "slide-0");
  assert.equal(slides[0].alt, "Kadr");
  assert.equal(slides[0].caption, null);
});

test("an empty alt uses the fallback title", () => {
  const slides = resolveHeroSlides([{ _key: "a", asset, alt: "  " }], "Tytuł");
  assert.equal(slides.length, 1);
  assert.equal(slides[0].alt, "Tytuł");
  assert.equal(slides[0].caption, null);
});

test("the list caps at five", () => {
  const many = Array.from({ length: 6 }, (_, index) => ({
    _key: `k${index}`,
    asset,
    alt: index === 0 ? "" : `Alt ${index}`,
  }));
  const slides = resolveHeroSlides(many, "Fallback");
  assert.equal(slides.length, 5);
  assert.equal(slides[0]._key, "k0");
  assert.equal(slides[0].alt, "Fallback");
  assert.equal(slides[1].alt, "Alt 1");
  assert.equal(slides[4]._key, "k4");
});

test("a caption passes through when it is present", () => {
  const slides = resolveHeroSlides(
    [{ _key: "ok", asset, alt: "Tak", caption: "  Finał  " }],
    "Fallback",
  );
  assert.equal(slides.length, 1);
  assert.equal(slides[0].alt, "Tak");
  assert.equal(slides[0].caption, "Finał");
});

test("slides without an asset are skipped", () => {
  const slides = resolveHeroSlides(
    [
      { _key: "empty", alt: "Nie" },
      { _key: "ok", asset, alt: "Tak", caption: "" },
    ],
    "Fallback",
  );
  assert.equal(slides.length, 1);
  assert.equal(slides[0]._key, "ok");
  assert.equal(slides[0].alt, "Tak");
  assert.equal(slides[0].caption, null);
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
