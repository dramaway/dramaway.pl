import assert from "node:assert/strict";
import { test } from "node:test";
import { visibleNavCount } from "../../apps/web/src/lib/nav-overflow.ts";

test("keeps every item when the row is wide enough", () => {
  assert.equal(
    visibleNavCount({
      containerWidth: 400,
      itemWidths: [80, 90, 70],
      overflowWidth: 24,
      gap: 20,
    }),
    3,
  );
});

test("reserves the overflow control and hides trailing items", () => {
  assert.equal(
    visibleNavCount({
      containerWidth: 220,
      itemWidths: [80, 90, 70],
      overflowWidth: 24,
      gap: 20,
    }),
    1,
  );
});

test("can hide the whole row behind the overflow control", () => {
  assert.equal(
    visibleNavCount({
      containerWidth: 30,
      itemWidths: [80, 90],
      overflowWidth: 24,
      gap: 20,
    }),
    0,
  );
});
