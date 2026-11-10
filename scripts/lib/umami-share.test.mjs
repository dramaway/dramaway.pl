import assert from "node:assert/strict";
import { test } from "node:test";
import {
  studioToolsWithStatistics,
  umamiShareUrl,
} from "../../apps/studio/umami-share.ts";

test("a missing share link hides the statistics tool", () => {
  assert.equal(umamiShareUrl(undefined), null);
  assert.equal(umamiShareUrl("   "), null);
  assert.deepEqual(
    studioToolsWithStatistics(["content"], undefined, (url) => url),
    ["content"],
  );
});

test("only an https share link is kept", () => {
  assert.equal(umamiShareUrl("http://cloud.umami.is/share/abc"), null);
  assert.equal(umamiShareUrl("javascript:alert(1)"), null);
  assert.equal(
    umamiShareUrl("https://user:secret@cloud.umami.is/share/abc"),
    null,
  );
  assert.equal(umamiShareUrl("not a url"), null);
  const share = "https://cloud.umami.is/analytics/eu/share/example";
  assert.equal(umamiShareUrl(`  ${share}  `), `${share}`);
  assert.deepEqual(
    studioToolsWithStatistics(["content"], share, (url) => `tool:${url}`),
    ["content", `tool:${share}`],
  );
});
