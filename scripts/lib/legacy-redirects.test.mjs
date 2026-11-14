import assert from "node:assert/strict";
import { test } from "node:test";
import {
  classifyLegacyMiss,
  isAllowedLegacyTarget,
  isLegacyFilePath,
  lookupLegacyRedirect,
  normalizeLegacyPath,
  rankLegacySuggestions,
} from "../../apps/web/src/lib/legacy-redirects.ts";
import { applyLegacyPolicy } from "./legacy-redirect-build.mjs";

const redirects = {
  "/node/2": "/kontakt",
  "/node/104": "/w-kolejce-do-lasu",
};

test("legacy paths drop the slash, case and polish encoding", () => {
  assert.equal(normalizeLegacyPath("/Node/2/"), "/node/2");
  assert.equal(normalizeLegacyPath("/PROJEKTY/Teatr/"), "/projekty/teatr");
  assert.equal(
    normalizeLegacyPath("/%C5%81%C4%85ka/"),
    "/łąka",
  );
  assert.equal(normalizeLegacyPath("/index.php", "?q=node/104"), "/node/104");
  assert.equal(normalizeLegacyPath("/", "?q=node/2"), "/node/2");
  assert.equal(normalizeLegacyPath("/index.php", "?q=/Projekty/Foo/"), "/projekty/foo");
});

test("a real alias keeps its path when q is also present", () => {
  assert.equal(
    normalizeLegacyPath("/kontakt", "?q=node/2"),
    "/kontakt",
  );
});

test("an external target is kept only for the Sanity CDN over https", () => {
  const cdn = "https://cdn.sanity.io/files/tr2qdg9j/production/report.pdf";
  assert.equal(isAllowedLegacyTarget("/kontakt"), true);
  assert.equal(isAllowedLegacyTarget(cdn), true);
  assert.equal(isAllowedLegacyTarget("http://cdn.sanity.io/files/a.pdf"), false);
  assert.equal(isAllowedLegacyTarget("https://evil.example/a"), false);
  assert.equal(isAllowedLegacyTarget("https://cdn.sanity.io.evil.example/a"), false);
  assert.equal(lookupLegacyRedirect("/plik", "", { "/plik": cdn }), cdn);
  assert.equal(
    lookupLegacyRedirect("/plik", "", { "/plik": "https://evil.example/a.pdf" }),
    null,
  );
  assert.equal(
    lookupLegacyRedirect("/plik", "", { "/plik": "http://cdn.sanity.io/files/a.pdf" }),
    null,
  );
});

test("lookup returns the mapped target and ignores unknown paths", () => {
  assert.equal(lookupLegacyRedirect("/node/2/", "", redirects), "/kontakt");
  assert.equal(
    lookupLegacyRedirect("/index.php", "?q=node/104", redirects),
    "/w-kolejce-do-lasu",
  );
  assert.equal(lookupLegacyRedirect("/nie-ma", "", redirects), null);
  assert.equal(lookupLegacyRedirect("/node/2", "", { "/node/2": "/node/2" }), null);
});

test("file paths are recognised after normalisation", () => {
  assert.equal(
    isLegacyFilePath("/sites/fundacja/files/Cos.PDF"),
    true,
  );
  assert.equal(isLegacyFilePath("/sites/fundacja/files/cos.pdf/"), true);
  assert.equal(isLegacyFilePath("/projekty/art-generacje"), false);
});

const documents = [
  {
    title: "Teatr Codzienny",
    slug: "teatr-codzienny",
    href: "/projekty/teatr-codzienny",
    typeLabel: "projekt",
    excerpt: "Spektakle w szkole.",
  },
  {
    title: "Art Generacje",
    slug: "art-generacje",
    href: "/projekty/art-generacje",
    typeLabel: "projekt",
    excerpt: "Wieloletni projekt.",
  },
  {
    title: "Kontakt",
    slug: "kontakt",
    href: "/kontakt",
    typeLabel: "strona",
    excerpt: "",
  },
];

test("two documents with the same address collapse to one suggestion", () => {
  const doubled = [
    ...documents,
    {
      title: "Teatr Codzienny",
      slug: "teatr-codzienny-strona",
      href: "/projekty/teatr-codzienny",
      typeLabel: "strona",
      excerpt: "Stara karta.",
    },
  ];
  const result = rankLegacySuggestions("Teatr Codzienny", doubled);
  assert.equal(result.length, 1);
  assert.equal(result[0].typeLabel, "projekt");
});

test("suggestions need two words or one long title word", () => {
  const strong = rankLegacySuggestions("Teatr Codzienny w szkole", documents);
  assert.deepEqual(
    strong.map((item) => item.slug),
    ["teatr-codzienny"],
  );
  const oneLong = rankLegacySuggestions("codzienny", documents);
  assert.deepEqual(
    oneLong.map((item) => item.slug),
    ["teatr-codzienny"],
  );
  const tooWeak = rankLegacySuggestions("teatr", documents);
  assert.deepEqual(tooWeak, []);
  const stopWords = rankLegacySuggestions("oraz przez które", documents);
  assert.deepEqual(stopWords, []);
});

test("a known old path with a match is kind A, otherwise C without guesses", () => {
  const entry = {
    path: "/stary-teatr",
    title: "Teatr Codzienny",
    type: "strona",
  };
  const matched = classifyLegacyMiss({
    path: "/stary-teatr",
    entry,
    documents,
  });
  assert.equal(matched.kind, "A");
  if (matched.kind === "A") {
    assert.equal(matched.suggestions[0].slug, "teatr-codzienny");
  }
  const weak = classifyLegacyMiss({
    path: "/stary-teatr",
    entry: { ...entry, title: "Teatr" },
    documents,
  });
  assert.equal(weak.kind, "C");
  if (weak.kind === "C") assert.deepEqual(weak.suggestions, []);
});

test("a denylisted chain is not a redirect and an override can replace a target", () => {
  const result = applyLegacyPolicy(
    {
      redirects: {
        "/zespol/monika-zielinska": "/zespol/inna-osoba",
        "/1-dla-drama-way": "/harmonia-artgeneracje",
        "/milosc-w-gorznie": "/harmonia-artgeneracje",
        "/node/48": "/art-generacje-0",
      },
      paths: [],
    },
    ["/zespol/monika-zielinska", "/1-dla-drama-way", "/milosc-w-gorznie"],
    {
      "/node/35": "/projekty/art-generacje",
      "/projekty/art-generacje": "/projekty/art-generacje",
      "/projekty/art-generacje-0": "/projekty/art-generacje",
      "/evil": "https://evil.example/phish",
    },
  );
  assert.equal(result.redirects["/zespol/monika-zielinska"], undefined);
  assert.equal(result.redirects["/1-dla-drama-way"], undefined);
  assert.equal(result.redirects["/milosc-w-gorznie"], undefined);
  assert.equal(result.redirects["/node/35"], "/projekty/art-generacje");
  assert.equal(result.redirects["/projekty/art-generacje"], undefined);
  assert.equal(result.redirects["/projekty/art-generacje-0"], "/projekty/art-generacje");
  assert.equal(result.redirects["/evil"], undefined);
  assert.equal(result.redirects["/node/48"], "/art-generacje-0");
});

test("an old file is kind B and an unknown slug can still suggest", () => {
  const file = classifyLegacyMiss({
    path: "/sites/fundacja/files/cos.pdf",
    entry: null,
    documents,
  });
  assert.equal(file.kind, "B");
  const typo = classifyLegacyMiss({
    path: "/art-generacje-archiwum",
    entry: null,
    documents,
  });
  assert.equal(typo.kind, "C");
  if (typo.kind === "C") {
    assert.deepEqual(
      typo.suggestions.map((item) => item.slug),
      ["art-generacje"],
    );
  }
});
