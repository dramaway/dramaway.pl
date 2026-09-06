import assert from "node:assert/strict";
import { test } from "node:test";
import {
  repairBlocks,
  splitInlineLinks,
  splitParenLinks,
  toPublicHref,
  decodeHtmlEntities,
  cleanPlainString,
  cleanRichText,
  findTruncatedUrls,
} from "./portable-text-repair.mjs";

test("toPublicHref keeps team paths and remaps legacy PDFs", () => {
  assert.equal(toPublicHref("/zespol/weronika-braczek"), "/zespol/weronika-braczek");
  assert.equal(
    toPublicHref("/sites/fundacja/files/sprawozdanie_2018.pdf"),
    "https://www.fundacja.dramaway.pl/sites/fundacja/files/sprawozdanie_2018.pdf",
  );
  assert.equal(
    toPublicHref("https://www.fundacja.dramaway.pl/projekty/teatr-codzienny"),
    "/projekty/teatr-codzienny",
  );
  assert.equal(toPublicHref("https://app.evently.pl/.../13451"), "");
});

test("splitParenLinks turns Name (/zespol/…) into a real href and drops the path", () => {
  const parts = splitParenLinks("Weroniką Brączek (/zespol/weronika-braczek)");
  assert.deepEqual(parts, [
    { text: "Weroniką Brączek", href: "/zespol/weronika-braczek" },
  ]);
});

test("splitParenLinks does not treat osoby/grupy as a URL", () => {
  const text = "Zainteresowane osoby/grupy prosimy o kontakt";
  const parts = splitParenLinks(text);
  assert.deepEqual(parts, [{ text }]);
});

test("splitParenLinks unwraps nested (email (mailto:email))", () => {
  const parts = splitParenLinks(
    "aldona.kudelska@dramaway.pl (mailto:aldona.kudelska@dramaway.pl)",
  );
  assert.equal(parts.length, 1);
  assert.equal(parts[0].text, "aldona.kudelska@dramaway.pl");
  assert.equal(parts[0].href, "mailto:aldona.kudelska@dramaway.pl");
});

test("splitInlineLinks linkifies a leftover www fundacja URL to an internal path", () => {
  const parts = splitInlineLinks(
    "więcej o kursie: www.fundacja.dramaway.pl/projekty/teatr-codzienny",
  );
  const linked = parts.find((p) => p.href);
  assert.equal(linked?.href, "/projekty/teatr-codzienny");
  assert.match(linked.text, /fundacja\.dramaway\.pl\/projekty\/teatr-codzienny/);
});

test("repairBlocks keeps strong and an existing link on sibling spans", () => {
  const key = "existing";
  const { blocks, stats } = repairBlocks([
    {
      _type: "block",
      _key: "b1",
      markDefs: [{ _type: "link", _key: key, href: "https://example.com/play" }],
      children: [
        { _type: "span", _key: "s1", text: "MARZENIA", marks: [key] },
        { _type: "span", _key: "s2", text: "\n", marks: [] },
        {
          _type: "span",
          _key: "s3",
          text: "Jarosław Rebeliński (/zespol/jaroslaw-rebelinski)",
          marks: ["strong"],
        },
      ],
    },
  ]);
  assert.equal(stats.links, 1);
  const block = blocks[0];
  const marzenia = block.children.find((c) => c.text === "MARZENIA");
  assert.deepEqual(marzenia.marks, [key]);
  const name = block.children.find((c) => c.text === "Jarosław Rebeliński");
  assert.ok(name.marks.includes("strong"));
  const def = block.markDefs.find((d) => d._key === name.marks.find((m) => m !== "strong"));
  assert.equal(def.href, "/zespol/jaroslaw-rebelinski");
  assert.equal(
    block.children.map((c) => c.text).join(""),
    "MARZENIA\nJarosław Rebeliński",
  );
});

test("decodeHtmlEntities unfolds nested &amp;nbsp;", () => {
  assert.equal(decodeHtmlEntities("a&nbsp;b"), "a\u00A0b");
  assert.equal(decodeHtmlEntities("a&amp;nbsp;b"), "a\u00A0b");
  assert.equal(decodeHtmlEntities("&#160;"), "\u00A0");
  assert.equal(decodeHtmlEntities("kończy się na&nbsp"), "kończy się na\u00A0");
});

test("cleanPlainString turns leftover entities into regular spaces", () => {
  assert.equal(cleanPlainString("Teatr&nbsp;Forum"), "Teatr Forum");
  assert.equal(cleanPlainString("a\u00A0\u00A0b"), "a b");
  assert.equal(cleanPlainString("ok\u0000end"), "okend");
  assert.equal(cleanPlainString("kończy się na&nbsp"), "kończy się na ");
});

test("cleanRichText keeps a single nbsp and collapses runs", () => {
  assert.equal(cleanRichText("w\u00A0grupie"), "w\u00A0grupie");
  assert.equal(cleanRichText("a\u00A0\u00A0b"), "a\u00A0b");
  assert.equal(cleanRichText("Teatr&nbsp;Forum"), "Teatr\u00A0Forum");
});

test("findTruncatedUrls reports ellipsis leftovers, does not invent hrefs", () => {
  const urls = findTruncatedUrls(
    "bilety: https://app.evently.pl/.../13451 i dalej",
  );
  assert.deepEqual(urls, ["https://app.evently.pl/.../13451"]);
});

test("repairBlocks decodes leftover &nbsp; in a span and keeps strong", () => {
  const { blocks, stats } = repairBlocks([
    {
      _type: "block",
      _key: "b1",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: "s1",
          text: "Teatr&nbsp;Forum",
          marks: ["strong"],
        },
      ],
    },
  ]);
  assert.equal(stats.text, 1);
  assert.equal(stats.links, 0);
  assert.equal(blocks[0].children[0].text, "Teatr\u00A0Forum");
  assert.deepEqual(blocks[0].children[0].marks, ["strong"]);
});
