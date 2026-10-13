import assert from "node:assert/strict";
import { test } from "node:test";
import {
  groupRosterNameSpans,
  splitRosterLine,
  splitRosterNames,
  splitRosterSpanLine,
} from "../../apps/web/src/lib/roster-line.ts";

test("splitRosterLine splits on the first colon", () => {
  assert.deepEqual(
    splitRosterLine("komunikacja: Weronika Szmaja"),
    { role: "komunikacja", names: "Weronika Szmaja" },
  );
  assert.deepEqual(
    splitRosterLine(
      "Kierownictwo programowe i twórcze: Adam Gąsecki, Aldona Żejmo-Kudelska",
    ),
    {
      role: "Kierownictwo programowe i twórcze",
      names: "Adam Gąsecki, Aldona Żejmo-Kudelska",
    },
  );
});

test("splitRosterLine keeps extra colons in the names", () => {
  assert.deepEqual(splitRosterLine("czas: 18:00–20:00"), {
    role: "czas",
    names: "18:00–20:00",
  });
});

test("splitRosterLine treats a missing or leading colon as names-only", () => {
  assert.deepEqual(splitRosterLine("Adam Gąsecki"), {
    role: null,
    names: "Adam Gąsecki",
  });
  assert.deepEqual(splitRosterLine(": tylko imię"), {
    role: null,
    names: ": tylko imię",
  });
  assert.deepEqual(splitRosterLine("  "), {
    role: null,
    names: "",
  });
});

test("splitRosterSpanLine keeps a mailto on the address under the name", () => {
  const email = {
    _key: "mail",
    text: "aldona.kudelska@dramaway.pl",
    marks: ["link-aldona"],
  };
  const split = splitRosterSpanLine([
    { text: "członkini zarządu: Aldona Żejmo-Kudelska\n" },
    email,
  ]);
  assert.equal(split.role, "członkini zarządu");
  assert.deepEqual(groupRosterNameSpans(split.nameSpans), [
    [{ text: "Aldona Żejmo-Kudelska" }],
    [email],
  ]);
});

test("groupRosterNameSpans still splits a plain cast on commas", () => {
  const split = splitRosterSpanLine([
    { text: "kierownictwo: Adam Gąsecki, Aldona Żejmo-Kudelska" },
  ]);
  assert.equal(split.role, "kierownictwo");
  assert.deepEqual(
    groupRosterNameSpans(split.nameSpans).map((group) => group.map((span) => span.text).join("")),
    ["Adam Gąsecki", "Aldona Żejmo-Kudelska"],
  );
});

test("splitRosterNames returns one person per line", () => {
  assert.deepEqual(
    splitRosterNames("Adam Gąsecki, Aldona Żejmo-Kudelska,  Weronika Szmaja "),
    ["Adam Gąsecki", "Aldona Żejmo-Kudelska", "Weronika Szmaja"],
  );
  assert.deepEqual(splitRosterNames("Adam Gąsecki\nAldona Żejmo-Kudelska"), [
    "Adam Gąsecki",
    "Aldona Żejmo-Kudelska",
  ]);
  assert.deepEqual(splitRosterNames(""), []);
});
