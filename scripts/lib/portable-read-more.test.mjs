import assert from "node:assert/strict";
import { test } from "node:test";
import {
  isSubstantivePortableBlock,
  splitPortableAtReadMore,
} from "../../apps/web/src/lib/portable-read-more.ts";
import { validateReadMoreBreaks } from "../../apps/studio/schemaTypes/readMoreValidation.ts";

function paragraph(text) {
  return {
    _type: "block",
    style: "normal",
    children: [{ _type: "span", text }],
  };
}

function marker() {
  return { _type: "readMoreBreak", _key: "rm1" };
}

test("splitPortableAtReadMore splits at a single marker", () => {
  const body = [paragraph("Lead"), marker(), paragraph("Rest")];
  const split = splitPortableAtReadMore(body);
  assert.ok(split);
  assert.equal(split.before.length, 1);
  assert.equal(split.after.length, 1);
});

test("splitPortableAtReadMore returns null without marker", () => {
  assert.equal(splitPortableAtReadMore([paragraph("Only")]), null);
});

test("splitPortableAtReadMore fails open with multiple markers", () => {
  const body = [paragraph("A"), marker(), paragraph("B"), marker(), paragraph("C")];
  assert.equal(splitPortableAtReadMore(body), null);
});

test("isSubstantivePortableBlock ignores empty blocks and markers", () => {
  assert.equal(isSubstantivePortableBlock(paragraph("   ")), false);
  assert.equal(isSubstantivePortableBlock(marker()), false);
  assert.equal(isSubstantivePortableBlock(paragraph("Tekst")), true);
});

test("validateReadMoreBreaks enforces position and substance", () => {
  assert.equal(validateReadMoreBreaks([]), true);
  assert.equal(
    validateReadMoreBreaks([marker(), paragraph("x")]),
    "Separator nie może być na początku treści — wstaw go w środku artykułu.",
  );
  assert.equal(
    validateReadMoreBreaks([paragraph("x"), marker()]),
    "Separator nie może być na końcu treści — poniżej musi zostać ukryta część.",
  );
  assert.match(
    validateReadMoreBreaks([paragraph("x"), marker(), marker(), paragraph("y")]),
    /tylko jeden/,
  );
  assert.equal(
    validateReadMoreBreaks([marker(), marker()]),
    "Można dodać tylko jeden separator „Czytaj więcej” w treści.",
  );
});
