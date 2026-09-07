import assert from "node:assert/strict";
import { test } from "node:test";
import {
  blockText,
  boalIsFlat,
  findHeadingIndex,
  parseSpectacleRun,
  reshapeBoalPractice,
  reshapeTeatrCodzienny,
  reshapeToMiGra,
  reshapeWieloglos,
  softenTitle,
  spectaclesToEditions,
  splitConcatenatedSpectacle,
  sentenceHeading,
  teatrCodziennyIsFlat,
  unwrapDrupalLines,
  FORUM_TRACK,
  COMMUNITY_TRACK,
} from "./archive-project-reshape.mjs";

function span(text, marks = []) {
  return { _type: "span", _key: "s", marks, text };
}

function block(text, style = "normal", extra = {}) {
  return {
    _type: "block",
    _key: "b",
    style,
    markDefs: extra.markDefs || [],
    children: [span(text)],
    ...extra,
  };
}

function bullet(text) {
  return {
    _type: "block",
    _key: "b",
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [span(`\u00A0${text}`)],
  };
}

function image(id, alt) {
  return {
    _type: "image",
    _key: "i",
    alt,
    asset: { _ref: `image-${id}-960x640-jpg` },
  };
}

function youtube(url) {
  return { _type: "youtube", _key: "y", url };
}

test("softenTitle turns ALL CAPS poster titles into sentence case", () => {
  assert.equal(softenTitle("DŻANET"), "Dżanet");
  assert.equal(softenTitle("SZANUJ SIĘ DZIEWCZYNO!"), "Szanuj się dziewczyno!");
  assert.equal(softenTitle("Teatr Forum"), "Teatr Forum");
});

test("sentenceHeading maps Drupal caps to FoldList labels", () => {
  assert.equal(sentenceHeading("ZESPÓŁ PROJEKTOWY"), "Zespół");
  assert.equal(sentenceHeading("DZIĘKUJEMY"), "Dziękujemy");
  assert.equal(sentenceHeading("SPONSORZY"), "Sponsorzy");
});

test("unwrapDrupalLines joins dumped line breaks into a sentence", () => {
  const node = {
    _type: "block",
    style: "normal",
    children: [
      span("BOAL IN PRACTICE is a project which aims to make drama tools more accessible for youth workers in Poland, Czech Republic, Lithuania, North Macedonia, Slovenia, Bulgaria, France,"),
      span("\n"),
      span("Portugal, Spain, Germany, Italy and Estonia."),
    ],
  };
  assert.match(
    blockText(unwrapDrupalLines(node)),
    /France, Portugal/,
  );
  assert.doesNotMatch(blockText(unwrapDrupalLines(node)), /\n/);
});

test("splitConcatenatedSpectacle unpacks the MARZENIA block", () => {
  const split = splitConcatenatedSpectacle(
    "MARZENIA MARZENIAMI\nopieka reżyserska: Jarosław Rebeliński\npremiera 2014 rok\nSpektakl adresowany jest przede wszystkim do młodych kobiet.",
  );
  assert.equal(split.title, "MARZENIA MARZENIAMI");
  assert.deepEqual(split.creditLines, ["opieka reżyserska: Jarosław Rebeliński"]);
  assert.equal(split.year, 2014);
  assert.match(split.description, /^Spektakl adresowany/);
});

test("parseSpectacleRun groups image + title + credits + premiere + blurb", () => {
  const items = parseSpectacleRun(
    [
      image("a", "dżanet"),
      block("DŻANET"),
      block("reżyseria: Wojciech Faruga"),
      block("premiera: 2012 rok"),
      block("Spektakl ukazuje problemy młodej dziewczyny."),
      image("b"),
      block("SZANUJ SIĘ DZIEWCZYNO!"),
      block("reżyseria: Wojciech Faruga"),
      block("premiera: 2013 rok"),
      block("Przedstawienie kierowane jest w szczególności do młodzieży licealnej."),
    ],
    FORUM_TRACK,
  );
  assert.equal(items.length, 2);
  assert.equal(items[0].title, "DŻANET");
  assert.equal(items[0].year, 2012);
  assert.equal(items[0].track, FORUM_TRACK);
  assert.equal(items[1].year, 2013);
});

function forumSpectacle(id, title, year, blurb) {
  return [
    image(id),
    block(title),
    block("opieka reżyserska:"),
    block("Jarosław Rebeliński"),
    block(`premiera: ${year} rok`),
    block(blurb),
  ];
}

function communitySpectacle(id, title, year, blurb) {
  return [
    image(id),
    block(title),
    block(`premiera - ${year} rok`),
    block(blurb),
  ];
}

function teatrCodziennyFixture() {
  return [
    block(
      "Projekt Teatr Codzienny to projekt szkoleniowy. Każda z sześciu edycji projektu realizowanego w latach 2012 – 2017 proponowała uczestnikom dwa kursy.",
      "h3",
    ),
    {
      _type: "image",
      asset: { _ref: "image-banner-1693x582-jpg" },
    },
    block("Teatr Forum", "h2"),
    block("Teatr Forum jest interaktywną formą teatru."),
    block("Scenariusze spektakli wypracowanych przez uczestników poszczególnych edycji projektu:", "h3"),
    ...forumSpectacle("f12", "DŻANET", 2012, "Spektakl ukazuje problemy."),
    ...forumSpectacle("f13", "SZANUJ SIĘ DZIEWCZYNO!", 2013, "Przedstawienie kierowane jest do młodzieży."),
    ...forumSpectacle("f14a", "BARDZO SŁODKI KOMPOT", 2014, "Spektakl adresowany jest do młodzieży."),
    image("f14b"),
    {
      _type: "block",
      style: "normal",
      markDefs: [],
      children: [
        span("MARZENIA MARZENIAMI"),
        span("\n"),
        span("opieka reżyserska: Jarosław Rebeliński"),
        span("\n"),
        span("premiera 2014 rok"),
        span("\n"),
        span("Spektakl adresowany jest przede wszystkim do młodych kobiet."),
      ],
    },
    ...forumSpectacle("f14c", "KINGA", 2014, "Spektakl adresowany w szczególności do młodzieży."),
    ...forumSpectacle("f15a", "PRZEPRASZAM", 2015, "Spektakl adesowany do młodzieży."),
    ...forumSpectacle("f15b", "KOZAK", 2015, "Przestawienie kierowane jest do młodzieży."),
    ...forumSpectacle("f15c", "MEDYCYNA", 2015, "Spektakl adesowany do młodzieży."),
    ...forumSpectacle("f16a", "INKA", 2016, "Spektakl kierowany do młodzieży licealnej."),
    ...forumSpectacle("f16b", "WYBÓR", 2016, "Spektakl przeznaczony dla młodzieży."),
    ...forumSpectacle("f16c", "HYDRANT", 2016, "Spektakl kierowany jest do młodzieży."),
    ...forumSpectacle("f17a", "CHŁOPAKI NIE PŁACZĄ", 2017, "Adresatami spektaklu jest młodzież."),
    ...forumSpectacle("f17b", "SPÓŹNIENI KOCHANKOWIE", 2017, "Spektakl skierowany do seniorów."),
    ...forumSpectacle("f17c", "PIERWSZY DZIEŃ WOLNOŚCI", 2017, "Spektakl skierowany do osób osadzonych."),
    block("\u00A0", "h3"),
    block("ZESPÓŁ PROJEKTOWY", "h3"),
    block("Maria Depta, Aldona Żejmo-Kudelska"),
    youtube("https://www.youtube.com/watch?v=forum"),
    block("Teatr ze Społecznością", "h2"),
    block("Teatr ze Społecznością (ang. Community Theatre - TS) to interaktywna forma."),
    bullet("integracja danej społeczności"),
    block("Rezultatem TS jest zwykle przygotowanie spektaklu."),
    block("Działania zrealizowane podczas poszczególnych edycji:", "h3"),
    ...communitySpectacle("c12", "NIE BYŁO NAS A BYŁ LAS", 2012, "Spektakl eksplorujący historie."),
    ...communitySpectacle("c13", "PŁATKI WSPOMNIEŃ", 2013, "Spektakl odnoszący się do przemijania."),
    ...communitySpectacle("c14", "HISTORIA PISANA NA TKANINIE", 2014, "Spektakl inspirowany motywem rzeki."),
    ...communitySpectacle("c15", "SZEPTY PUSZCZY", 2015, "Spektakl na bazie opowieści z puszczy."),
    ...communitySpectacle("c16", "NIE WSZYSTKO ZWIAŁO", 2016, "Spektakl nawiązujący do wichury."),
    ...communitySpectacle("c17", "KIEDYŚ BĘDZIE TU SANATORIUM", 2017, "Etiuda o ludziach zauroczonych duchem Supraśla."),
    block("ZESPÓŁ PROJEKTOWY", "h3"),
    block("Maria Depta, Karol Smaczny"),
    youtube("https://www.youtube.com/watch?v=community"),
    {
      _type: "image",
      asset: { _ref: "image-strip-1024x301-jpg" },
    },
    block("DZIĘKUJEMY", "h2"),
    block("Dziękujemy mieszkańcom Supraśla za życzliwość i wsparcie naszych działań."),
    block("PARTNERZY", "h2"),
    block(
      "Cardboard Citizens, The Tale Valley Community Theatre, Pedagogium Wyższa Szkoła Nauk Społecznych w Warszawie, Centrum Kultury i Rekreacji w Supraślu",
    ),
    block("SPONSORZY", "h2"),
    image("s1"),
    image("s2"),
    image("s3"),
  ];
}

test("reshapeTeatrCodzienny builds 6 year editions and 20 outcomes", () => {
  const result = reshapeTeatrCodzienny(teatrCodziennyFixture());
  assert.equal(result.editions.length, 6);
  assert.deepEqual(
    result.editions.map((edition) => edition.year),
    [2012, 2013, 2014, 2015, 2016, 2017],
  );
  assert.equal(
    result.editions.reduce((n, edition) => n + edition.outcomes.length, 0),
    20,
  );
  const y2014 = result.editions.find((edition) => edition.year === 2014);
  assert.equal(y2014.outcomes.length, 4);
  assert.equal(
    y2014.outcomes.some((outcome) => outcome.title === "Marzenia marzeniami"),
    true,
  );
  assert.match(result.summary, /sześciu edycji/);
  assert.equal(result.body.some((block) => block._type === "youtube"), true);
  assert.equal(result.partners.length, 4);
  assert.equal(result.partners[0], "Cardboard Citizens");
  assert.equal(
    result.afterword.some((block) => normalizedHeading(block) === "Zespół — Teatr Forum"),
    true,
  );
  assert.equal(teatrCodziennyIsFlat(teatrCodziennyFixture()), true);
  assert.equal(teatrCodziennyIsFlat(result.body), false);
});

function normalizedHeading(block) {
  if (block?._type !== "block") return "";
  return blockText(block);
}

test("spectaclesToEditions keeps Forum results before Community in a year", () => {
  const editions = spectaclesToEditions([
    {
      track: COMMUNITY_TRACK,
      title: "LAS",
      year: 2012,
      creditLines: [],
      premiereLine: "premiera - 2012 rok",
      description: "Spektakl.",
    },
    {
      track: FORUM_TRACK,
      title: "DŻANET",
      year: 2012,
      creditLines: ["reżyseria: Wojciech Faruga"],
      premiereLine: "premiera: 2012 rok",
      description: "Spektakl.",
    },
  ]);
  // Input order is Community then Forum — editions should follow the
  // caller order (reshape concatenates Forum first).
  const mixed = spectaclesToEditions([
    {
      track: FORUM_TRACK,
      title: "DŻANET",
      year: 2012,
      creditLines: [],
      premiereLine: "premiera: 2012 rok",
      description: "Spektakl.",
    },
    {
      track: COMMUNITY_TRACK,
      title: "LAS",
      year: 2012,
      creditLines: [],
      premiereLine: "premiera - 2012 rok",
      description: "Spektakl.",
    },
  ]);
  assert.equal(mixed[0].outcomes[0].title, "Dżanet");
  assert.equal(mixed[0].outcomes[1].title, "Las");
  assert.match(mixed[0].outcomes[0].subtitle, /Teatr Forum/);
  assert.equal(editions[0].slug.current, "edycja-2012");
});

test("reshapeToMiGra moves team / thanks / sponsors into afterword", () => {
  const result = reshapeToMiGra([
    image("hero"),
    block('"TO MI GRA" to projekt.'),
    {
      _type: "block",
      style: "normal",
      markDefs: [],
      children: [span("\n"), span("W ramach projektu powstał spektakl „Madina”.")],
    },
    block("ZESPÓŁ PROJEKTOWY", "h2"),
    block("Adam Gąsecki, Aldona Żejmo-Kudelska"),
    block("DZIĘKUJEMY", "h2"),
    block("Młodzieżowemu Ośrodkowi Wychowawczemu nr 4 w Warszawie."),
    block("SPONSORZY", "h2"),
    block("Projekt jest współfinansowany ze środków FIO."),
  ]);
  assert.match(result.summary, /TO MI GRA/);
  assert.equal(
    result.body.some((item) => item.style === "h2"),
    false,
  );
  const madina = result.body.find((item) => /Madina/.test(blockText(item)));
  assert.ok(madina);
  assert.doesNotMatch(blockText(madina), /^\n/);
  assert.equal(blockText(result.afterword[0]), "Zespół");
  assert.equal(blockText(result.afterword[2]), "Dziękujemy");
  assert.equal(blockText(result.afterword[4]), "Sponsorzy");
});

test("reshapeBoalPractice puts PL and EN into Columns", () => {
  const result = reshapeBoalPractice([
    {
      _type: "image",
      asset: { _ref: "image-boal-1224x343-png" },
    },
    block("BOAL IN PRACTICE to międzynarodowy projekt szkoleniowy, którego celem jest rozpowszechnienie metod."),
    block("W trakcie kursu, w którym wezmą udział 24 osoby, będziemy pracować z zabawami."),
    block("Kurs przeznaczony jest dla osób pracujących z młodzieżą, którzy chcą:"),
    bullet("poznać i przećwiczyć gry i zabawy Augusto Boala;"),
    block("Projekt realizowany jest dzięki wsparciu programu Erasmus+ Młodzież."),
    block("[EN]"),
    {
      _type: "block",
      style: "normal",
      children: [
        span("BOAL IN PRACTICE is a project which aims to make drama tools more accessible for youth workers in Poland, Czech Republic, Lithuania, North Macedonia, Slovenia, Bulgaria, France,"),
        span("\n"),
        span("Portugal, Spain, Germany, Italy and Estonia."),
      ],
    },
    block("The training course will gather youth workers, with the objectives of:"),
    bullet("getting to know and experiencing the games of Augusto Boal;"),
    block("This project is being implemented with the support of the Erasmus+ Youth programme."),
  ]);
  assert.match(result.summary, /^BOAL IN PRACTICE to/);
  assert.equal(result.body[0]._type, "image");
  assert.equal(result.body[0].size, "wide");
  assert.equal(result.body[1]._type, "textColumns");
  assert.equal(result.body[1].columns.length, 2);
  assert.match(
    blockText(result.body[1].columns[0].body[0]),
    /międzynarodowy projekt/,
  );
  assert.equal(blockText(result.body[1].columns[1].body[0]), "English");
  assert.match(
    blockText(result.body[1].columns[1].body[1]),
    /France, Portugal/,
  );
  assert.equal(boalIsFlat([{ _type: "block", children: [span("[EN]")] }]), true);
  assert.equal(boalIsFlat(result.body), false);
});

test("reshapeWieloglos takes leftover listing copy without duplicating the H2 title", () => {
  const result = reshapeWieloglos([
    block("WIELOGŁOS – program profilaktyki alkoholowej", "h2"),
    image("w"),
    block('"Wielogłos" to projekt profilaktyczny wzorowany na formule Teatru w Edukacji.'),
    block('"Wielogłos" jest programem z zakresu profilaktyki alkoholowej.'),
    block("Tylko w roku 2012 programem zostało objętych 360 uczniów."),
    block("Koordynator projektu – Aldona Żejmo-Kudelska"),
  ]);
  assert.equal(result.slug, "wieloglos");
  assert.equal(result.title, "Wielogłos");
  assert.match(result.summary, /Teatru w Edukacji/);
  assert.equal(
    result.body.some((item) => item.style === "h2"),
    false,
  );
  assert.equal(blockText(result.afterword[0]), "Zespół");
  assert.match(blockText(result.afterword[1]), /Koordynator/);
});

test("findHeadingIndex ignores empty Drupal leftover headings", () => {
  const blocks = [block("\u00A0", "h3"), block("Teatr Forum", "h2")];
  assert.equal(findHeadingIndex(blocks, /^teatr forum$/i), 1);
});
