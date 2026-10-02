import assert from "node:assert/strict";
import { test } from "node:test";
import {
  HISTORY_COLLAPSE_HOLD_MS,
  historyCollapseHold,
  historyDampOpenness,
  historyHeldOpenness,
  historyMergeOpenness,
  historyOpenness,
  historyPinProgress,
  historyPinSpan,
  historyTrackOffset,
  historyWaveFactor,
  historyWavePath,
  resolveHistoryLayout,
} from "../../apps/web/src/lib/history-timeline.ts";

test("missing layout stays vertical", () => {
  assert.equal(resolveHistoryLayout(undefined), "vertical");
  assert.equal(resolveHistoryLayout(null), "vertical");
  assert.equal(resolveHistoryLayout(""), "vertical");
  assert.equal(resolveHistoryLayout("sideways"), "vertical");
  assert.equal(resolveHistoryLayout("horizontal"), "horizontal");
});

test("the wave starts on the left edge and stays inside 0…1", () => {
  assert.equal(historyWaveFactor(0), 0);
  for (let index = 0; index < 12; index += 1) {
    const factor = historyWaveFactor(index);
    assert.ok(factor >= 0 && factor <= 1, `index ${index} → ${factor}`);
  }
  assert.notEqual(historyWaveFactor(2), historyWaveFactor(3));
});

test("the connector is a cubic in a 100-unit box", () => {
  assert.equal(historyWavePath(0, 0), "M 0 0 C 0 50 0 50 0 100");
  assert.equal(historyWavePath(0, 1), "M 0 0 C 0 50 100 50 100 100");
  assert.equal(historyWavePath(1, 0), "M 0 0 C 0 50 -100 50 -100 100");
});

test("pin span is one viewport plus the leftover track", () => {
  assert.equal(historyPinSpan(800, 1000), 1800);
  assert.equal(historyPinSpan(800, 0), 800);
  assert.equal(historyPinSpan(800, -40), 800);
});

test("track offset follows vertical progress from right to left", () => {
  assert.equal(historyTrackOffset(0, 1000), 0);
  assert.equal(historyTrackOffset(0.5, 1000), -500);
  assert.equal(historyTrackOffset(1, 1000), -1000);
  assert.equal(historyTrackOffset(-2, 1000), 0);
  assert.equal(historyTrackOffset(3, 1000), -1000);
});

test("pin progress is 0 at the top edge and 1 after the extra travel", () => {
  assert.equal(historyPinProgress(0, 1800, 800), 0);
  assert.equal(historyPinProgress(-500, 1800, 800), 0.5);
  assert.equal(historyPinProgress(-1000, 1800, 800), 1);
  assert.equal(historyPinProgress(120, 1800, 800), 0);
  assert.equal(historyPinProgress(-10, 800, 800), 0);
});

test("only the markers closest to the focal point open", () => {
  const open = historyOpenness([0, 10, 20], 10, 20, 3);
  assert.equal(open[1], 1);
  assert.ok(Math.abs(open[0] - 0.5) < 1e-9);
  assert.ok(Math.abs(open[2] - 0.5) < 1e-9);

  const nearest = historyOpenness([0, 10, 20, 30], 10, 100, 1);
  assert.deepEqual(nearest, [0, 1, 0, 0]);

  assert.deepEqual(historyOpenness([0, 10], 0, 0, 3), [0, 0]);
});

test("a forced year overrides the scroll value", () => {
  assert.deepEqual(historyMergeOpenness([0.2, 0.8, 0], [null, 0, 1]), [
    0.2, 0, 1,
  ]);
});

test("collapse pauses once, then follows the lower scroll target", () => {
  assert.deepEqual(historyCollapseHold(0.4, 0.9, 1000, 500), {
    hold: false,
    until: 0,
  });
  assert.deepEqual(historyCollapseHold(0.2, 0, 1000, 0), {
    hold: false,
    until: 0,
  });

  const started = historyCollapseHold(1, 0.4, 1000, 0);
  assert.equal(started.hold, true);
  assert.equal(started.until, 1000 + HISTORY_COLLAPSE_HOLD_MS);
  const pending = historyCollapseHold(1, 0, started.until - 50, started.until);
  assert.equal(pending.hold, true);
  assert.equal(pending.until, started.until);
  assert.deepEqual(historyCollapseHold(1, 0, pending.until, pending.until), {
    hold: false,
    until: -1,
  });
  assert.deepEqual(historyCollapseHold(0.9, 0, pending.until + 50, -1), {
    hold: false,
    until: -1,
  });
  assert.deepEqual(historyCollapseHold(0.94, 0.92, 5000, -1), {
    hold: false,
    until: 0,
  });
});

test("a hold keeps the openness scroll already reached", () => {
  assert.equal(historyHeldOpenness(0.62, 0.1, true), 0.62);
  assert.equal(historyHeldOpenness(0.62, 0.9, true), 0.9);
  assert.equal(historyHeldOpenness(0.62, 0.1, false), 0.1);
});

test("damping eases toward the target and then snaps", () => {
  const once = historyDampOpenness([0, 0], [1, 0], 0.5);
  assert.equal(once[0], 0.5);
  assert.equal(once[1], 0);
  assert.deepEqual(historyDampOpenness([0.995, 0], [1, 0], 0.5), [1, 0]);
});
