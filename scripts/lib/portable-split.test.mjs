import assert from "node:assert/strict";
import { test } from "node:test";
import { splitPortableByTerm } from "../../apps/web/src/lib/portable-split.ts";

const block = (key, style, text) => ({
  _type: "block",
  _key: key,
  style,
  children: [{ _type: "span", text }],
});

test("groups term headings with text and keeps embedded items in order", () => {
  const intro = block("intro", "normal", "Wprowadzenie");
  const heading = block("term-1", "term", "  Pierwszy temat  ");
  const copy = block("copy-1", "normal", "Opis tematu");
  const video = { _type: "youtube", _key: "video" };
  const nextHeading = block("term-2", "term", "Drugi temat");
  const nextCopy = block("copy-2", "normal", "Drugi opis");

  assert.deepEqual(splitPortableByTerm([
    intro,
    heading,
    copy,
    video,
    nextHeading,
    nextCopy,
  ]), [
    { kind: "blocks", blocks: [intro] },
    { kind: "term", title: "Pierwszy temat", blocks: [copy] },
    { kind: "blocks", blocks: [video] },
    { kind: "term", title: "Drugi temat", blocks: [nextCopy] },
  ]);
});

test("keeps an empty term block as ordinary content", () => {
  const emptyHeading = block("term-empty", "term", " ");
  const copy = block("copy", "normal", "Treść");

  assert.deepEqual(splitPortableByTerm([emptyHeading, copy]), [
    { kind: "blocks", blocks: [emptyHeading, copy] },
  ]);
});
