import assert from "node:assert/strict";
import test from "node:test";
import { blockAlign, embedSize } from "../../apps/web/src/lib/body-frame.ts";

test("empty alignment sits on the left", () => {
  assert.equal(blockAlign(undefined), "left");
  assert.equal(blockAlign(""), "left");
  assert.equal(blockAlign("left"), "left");
  assert.equal(blockAlign("center"), "center");
  assert.equal(blockAlign("right"), "right");
  assert.equal(blockAlign("elsewhere"), "left");
});

test("a film is medium unless the editor chose full width", () => {
  assert.equal(embedSize(undefined), "medium");
  assert.equal(embedSize("medium"), "medium");
  assert.equal(embedSize("wide"), "medium");
  assert.equal(embedSize("full"), "full");
});
