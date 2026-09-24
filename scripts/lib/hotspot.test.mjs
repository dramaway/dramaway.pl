import assert from "node:assert/strict";
import { test } from "node:test";
import { objectPositionFromHotspot } from "../../apps/web/src/lib/sanity/hotspot.ts";

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

test("hotspot is remapped into the cropped rectangle", () => {
  assert.equal(
    objectPositionFromHotspot({
      hotspot: { x: 0.5, y: 0.25 },
      crop: { top: 0.2, bottom: 0.2, left: 0, right: 0 },
    }),
    "50% 8.33333333333333%",
  );
});
