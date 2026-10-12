import assert from "node:assert/strict";
import { test } from "node:test";
import {
  blocksWordBag,
  creditsWordBag,
  findCreditRuns,
  groupForRole,
  missingWords,
  normalizeText,
  parseCreditLine,
  stampCreditKeys,
} from "./credits-parse.mjs";

let keySeed = 0;
function block(text, extra = {}) {
  keySeed += 1;
  return {
    _type: "block",
    _key: `k${keySeed}`,
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: `s${keySeed}`, text, marks: [] }],
    ...extra,
  };
}

test("normalizeText drops the &nbsp; leftovers from Drupal", () => {
  assert.equal(normalizeText("Anna Jędrzejewska  "), "Anna Jędrzejewska");
  assert.equal(normalizeText("rola:  Imię \n  Nazwisko"), "rola: Imię\nNazwisko");
});

test("parseCreditLine splits on the first colon", () => {
  assert.deepEqual(parseCreditLine("reżyseria: Adam Gąsecki"), {
    role: "reżyseria",
    note: null,
    people: "Adam Gąsecki",
    separator: "colon",
  });
});

test("parseCreditLine lifts a 'w tym' qualifier out of the role", () => {
  const parsed = parseCreditLine(
    "muzyka i oprawa dźwiękowa, w tym autorstwo i wykonanie w czasie spektaklu utworu “Gadatliwość drzew”: Anna Jędrzejewska",
  );
  assert.equal(parsed.role, "muzyka i oprawa dźwiękowa");
  assert.equal(
    parsed.note,
    "w tym autorstwo i wykonanie w czasie spektaklu utworu “Gadatliwość drzew”",
  );
  assert.equal(parsed.people, "Anna Jędrzejewska");
});

test("parseCreditLine keeps a role that quotes a title", () => {
  const parsed = parseCreditLine(
    "Oprawa oświetleniowa spektaklu „Tańczące z cieniami”: Jolanta Sikorska",
  );
  assert.equal(parsed.role, "Oprawa oświetleniowa spektaklu „Tańczące z cieniami”");
  assert.equal(parsed.people, "Jolanta Sikorska");
});

test("parseCreditLine refuses prose that happens to contain a colon", () => {
  assert.equal(
    parseCreditLine(
      'Spektakl "404: Los not found. Rozważania w garderobie świata" powstał jako efekt działań.',
    ),
    null,
  );
  assert.equal(
    parseCreditLine(
      "Zapraszamy do obejrzenia galerii zdjęć z warsztatów oraz spektakli: „Tańczące z cieniami” i „O-L-śnienia”",
    ),
    null,
  );
  assert.equal(parseCreditLine("Adam Gąsecki"), null);
});

test("parseCreditLine accepts a dash only before something name-shaped", () => {
  assert.deepEqual(parseCreditLine("Koordynator projektu – Aldona Żejmo-Kudelska"), {
    role: "Koordynator projektu",
    note: null,
    people: "Aldona Żejmo-Kudelska",
    separator: "dash",
  });
  // gallery links, not credits
  assert.equal(parseCreditLine("Bielany - etapy I i II prace warsztatowe"), null);
  // a title and its subtitle
  assert.equal(
    parseCreditLine('VII Edycja Art Generacje 2022 - „Splecione"'),
    null,
  );
});

test("groupForRole follows the page order", () => {
  assert.equal(groupForRole("koncepcja projektu i prowadzenie grupy"), "Autorstwo");
  assert.equal(groupForRole("reżyseria"), "Autorstwo");
  assert.equal(groupForRole("obsada - uczestnicy/czki projektu"), "Obsada");
  assert.equal(groupForRole("muzyka"), "Realizacja artystyczna");
  assert.equal(groupForRole("koordynacja projektu"), "Produkcja");
  assert.equal(groupForRole("partner projektu"), "Partnerzy");
});

test("findCreditRuns reads a bullet list and keeps the heading above it", () => {
  const blocks = [
    block("Tekst o edycji, zupełnie zwykły akapit bez wykazu."),
    block("VI Edycja Art Generacje 2021", {
      children: [
        { _type: "span", _key: "x", text: "VI Edycja Art Generacje 2021", marks: ["strong"] },
      ],
    }),
    block("Reżyseria: Adam Gąsecki", { listItem: "bullet" }),
    block("Muzyka: Piotr Pardela", { listItem: "bullet" }),
    block("Koordynacja projektu: Monika Zielińska", { listItem: "bullet" }),
  ];
  const runs = findCreditRuns(blocks);
  assert.equal(runs.length, 1);
  assert.equal(runs[0].credits.heading, "VI Edycja Art Generacje 2021");
  assert.equal(runs[0].replaceKeys.length, 4);
  assert.deepEqual(
    runs[0].credits.groups.map((group) => group.title),
    ["Autorstwo", "Realizacja artystyczna", "Produkcja"],
  );
});

test("findCreditRuns reads one paragraph with newlines, and the funding note", () => {
  const blocks = [
    block("Twórcy", { style: "h3" }),
    block(
      "reżyseria: Adam Gąsecki\nobsada: Alina, Aneta, Anna\npartner projektu: TR Warszawa",
    ),
    block(""),
    block("Projekt współfinansowany przez M.St Warszawa."),
  ];
  const runs = findCreditRuns(blocks);
  assert.equal(runs.length, 1);
  assert.equal(runs[0].credits.heading, "Twórcy");
  assert.equal(runs[0].credits.note, "Projekt współfinansowany przez M.St Warszawa.");
  const cast = runs[0].credits.groups.find((group) => group.title === "Obsada");
  assert.equal(cast.rows[0]._type, "creditNames");
  assert.equal(cast.rows[0].label, "obsada");
  for (const group of runs[0].credits.groups) {
    assert.equal(group._type, "creditGroup");
    assert.equal(typeof group._key, "string");
    assert.ok(group._key.length > 0);
    const rowKeys = new Set();
    for (const row of group.rows) {
      assert.ok(row._type === "creditRow" || row._type === "creditNames");
      assert.equal(typeof row._key, "string");
      assert.equal(rowKeys.has(row._key), false);
      rowKeys.add(row._key);
    }
  }
});

test("findCreditRuns leaves an h2 alone — it is an accordion title", () => {
  const blocks = [
    block("Zespół — Teatr Forum", { style: "h2" }),
    block("Maria Depta, Aldona Żejmo-Kudelska, Jarek Rebeliński"),
  ];
  assert.deepEqual(findCreditRuns(blocks), []);
});

test("stampCreditKeys fills missing keys and leaves a finished block alone", () => {
  const stamped = stampCreditKeys({
    _type: "credits",
    heading: "Twórcy",
    groups: [
      {
        title: "Autorstwo",
        rows: [
          { _type: "creditRow", role: "reżyseria", people: "Ada" },
          { _type: "creditRow", _key: "keep", role: "muzyka", people: "Ewa" },
        ],
      },
      {
        _key: "g",
        title: "Obsada",
        rows: [{ _key: "same", _type: "creditNames", label: "obsada", people: "Ala" }],
      },
      {
        _key: "g",
        _type: "creditGroup",
        title: "Partnerzy",
        rows: [
          { _key: "same", _type: "creditRow", role: "partner", people: "TR" },
          { _key: "same", _type: "creditRow", role: "sponsor", people: "Miasto" },
        ],
      },
    ],
  });

  assert.equal(stamped.heading, "Twórcy");
  assert.equal(stamped.groups[0]._type, "creditGroup");
  assert.equal(typeof stamped.groups[0]._key, "string");
  assert.equal(stamped.groups[0].rows[0].role, "reżyseria");
  assert.equal(stamped.groups[0].rows[1]._key, "keep");
  assert.notEqual(stamped.groups[0].rows[0]._key, "keep");
  assert.equal(stamped.groups[1]._key, "g");
  assert.equal(stamped.groups[1]._type, "creditGroup");
  assert.notEqual(stamped.groups[2]._key, "g");
  assert.equal(stamped.groups[2].rows[0]._key, "same");
  assert.notEqual(stamped.groups[2].rows[1]._key, "same");
  assert.equal(stampCreditKeys(stamped), stamped);
});

test("the word bag catches a dropped name", () => {
  const blocks = [block("reżyseria: Adam Gąsecki, Maria Depta")];
  const complete = {
    groups: [
      {
        rows: [
          { role: "reżyseria", people: "Adam Gąsecki, Maria Depta" },
        ],
      },
    ],
  };
  assert.deepEqual(missingWords(blocksWordBag(blocks), creditsWordBag(complete)), []);

  const lost = {
    groups: [{ rows: [{ role: "reżyseria", people: "Adam Gąsecki" }] }],
  };
  assert.deepEqual(missingWords(blocksWordBag(blocks), creditsWordBag(lost)), [
    "depta",
    "maria",
  ]);
});
