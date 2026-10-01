import assert from "node:assert/strict";
import { test } from "node:test";
import {
  focalThumbRect,
  objectPositionFromHotspot,
} from "../../apps/web/src/lib/sanity/hotspot.ts";

test("missing hotspot stays at the default centre", () => {
  assert.equal(objectPositionFromHotspot(null), undefined);
  assert.equal(objectPositionFromHotspot({}), undefined);
});

test("hotspot fractions become object-position percentages", () => {
  assert.equal(
    objectPositionFromHotspot({ hotspot: { x: 0.5, y: 0.2 } }),
    "50% 20%",
  );
});

test("a full-frame hotspot zooms to a square on the focal point", () => {
  const rect = focalThumbRect({
    asset: { _ref: "image-abc-1000x600-jpg" },
    hotspot: { x: 0.5, y: 0.5, width: 1, height: 1 },
  });
  assert.deepEqual(rect, { left: 374, top: 174, width: 252, height: 252 });
});

test("an explicit hotspot rectangle fills the thumbnail", () => {
  const rect = focalThumbRect({
    asset: { _ref: "image-abc-1000x600-jpg" },
    hotspot: { x: 0.2, y: 0.4, width: 0.2, height: 0.1 },
  });
  assert.deepEqual(rect, { left: 88, top: 128, width: 224, height: 224 });
});

test("a corner hotspot stays inside the crop", () => {
  const rect = focalThumbRect({
    asset: { _ref: "image-abc-1000x600-jpg" },
    crop: { top: 0.1, bottom: 0, left: 0, right: 0 },
    hotspot: { x: 0.02, y: 0.12, width: 0.1, height: 0.1 },
  });
  assert.ok(rect);
  assert.equal(rect.top >= 60, true);
  assert.equal(rect.left >= 0, true);
  assert.equal(rect.left + rect.width <= 1000, true);
  assert.equal(rect.top + rect.height <= 600, true);
  assert.equal(rect.width, rect.height);
});

test("hotspot is remapped into the cropped rectangle", () => {
  assert.equal(
    objectPositionFromHotspot({
      hotspot: { x: 0.5, y: 0.25 },
      crop: { top: 0.2, bottom: 0.2, left: 0, right: 0 },
    }),
    "50% 8.33333333333333%",
  );
});
