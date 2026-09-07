import assert from "node:assert/strict";
import { test } from "node:test";
import { safeHref } from "../../apps/web/src/lib/safe-url.ts";
import { youtubeEmbedSrc } from "../../apps/web/src/lib/sanity/youtube.ts";

test("safeHref allows http(s), mailto, hash, and root-relative paths", () => {
  assert.equal(safeHref("https://centrum.dramaway.pl")?.kind, "http");
  assert.equal(safeHref("http://example.com/a")?.kind, "http");
  assert.equal(safeHref("mailto:a@b.pl")?.kind, "mailto");
  assert.equal(safeHref("/projekty/art-generacje")?.kind, "path");
  assert.equal(safeHref("/czytelnia?rodzaj=books")?.kind, "path");
  assert.equal(safeHref("#edycje")?.kind, "hash");
});

test("safeHref rejects javascript, data, and protocol-relative hrefs", () => {
  assert.equal(safeHref("javascript:alert(1)"), null);
  assert.equal(safeHref("JAVASCRIPT:alert(1)"), null);
  assert.equal(safeHref("data:text/html,hi"), null);
  assert.equal(safeHref("//evil.example/phish"), null);
  assert.equal(safeHref("/\\evil.example"), null);
  assert.equal(safeHref("vbscript:msg"), null);
  assert.equal(safeHref("  javascript:alert(1)"), null);
});

test("youtubeEmbedSrc only embeds allowlisted hosts and 11-char ids", () => {
  assert.equal(
    youtubeEmbedSrc("https://youtu.be/dQw4w9wgGcQ"),
    "https://www.youtube-nocookie.com/embed/dQw4w9wgGcQ",
  );
  assert.equal(
    youtubeEmbedSrc("https://www.youtube.com/watch?v=dQw4w9wgGcQ"),
    "https://www.youtube-nocookie.com/embed/dQw4w9wgGcQ",
  );
  assert.equal(
    youtubeEmbedSrc("https://m.youtube.com/watch?v=dQw4w9wgGcQ&t=12"),
    "https://www.youtube-nocookie.com/embed/dQw4w9wgGcQ?start=12",
  );
  assert.equal(
    youtubeEmbedSrc("https://www.youtube-nocookie.com/embed/dQw4w9wgGcQ"),
    "https://www.youtube-nocookie.com/embed/dQw4w9wgGcQ",
  );
  assert.equal(
    youtubeEmbedSrc("https://evil.example/watch?v=dQw4w9wgGcQ"),
    null,
  );
  assert.equal(youtubeEmbedSrc("https://youtu.be.evil.example/dQw4w9wgGcQ"), null);
  assert.equal(youtubeEmbedSrc("https://youtu.be/short"), null);
  assert.equal(youtubeEmbedSrc("https://www.youtube.com/watch?v=../../x"), null);
});

test("youtubeEmbedSrc encodes playlist ids separately", () => {
  assert.equal(
    youtubeEmbedSrc("https://www.youtube.com/playlist?list=PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf"),
    "https://www.youtube-nocookie.com/embed/videoseries?list=PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf",
  );
  assert.equal(
    youtubeEmbedSrc("https://www.youtube.com/watch?list=PL<a>"),
    null,
  );
});
