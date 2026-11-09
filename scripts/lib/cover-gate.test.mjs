import assert from "node:assert/strict";
import { test } from "node:test";
import {
  decideCover,
  secretsMatch,
} from "../../apps/web/src/lib/cover-gate.ts";

const SECRET = "preview-secret";

function decide(overrides) {
  const params = new URLSearchParams(overrides.search ?? "");
  return decideCover({
    pathname: overrides.pathname,
    searchParams: params,
    previewCookie: overrides.previewCookie ?? "",
    coverMode: overrides.coverMode ?? true,
    secret: overrides.secret ?? SECRET,
    internalCover: overrides.internalCover ?? false,
  });
}

test("the gate stays open when cover mode is off", () => {
  assert.deepEqual(
    decide({ pathname: "/projekty", coverMode: false, secret: "" }),
    { action: "next", noStore: false },
  );
});

test("a missing secret still closes the site and rejects preview", () => {
  assert.deepEqual(decide({ pathname: "/", secret: "" }), {
    action: "rewrite",
    noStore: true,
  });
  assert.deepEqual(
    decide({ pathname: "/projekty", secret: "", search: "podglad=anything" }),
    {
      action: "redirect",
      pathname: "/",
      search: "",
      setCookie: false,
      clearCookie: true,
    },
  );
  assert.equal(secretsMatch("anything", ""), false);
});

test("the homepage rewrites to the cover and other paths bounce home", () => {
  assert.deepEqual(decide({ pathname: "/" }), {
    action: "rewrite",
    noStore: true,
  });
  assert.deepEqual(decide({ pathname: "/projekty" }), {
    action: "redirect",
    pathname: "/",
    search: "",
    setCookie: false,
    clearCookie: false,
  });
  assert.deepEqual(decide({ pathname: "/zajawka" }), {
    action: "redirect",
    pathname: "/",
    search: "",
    setCookie: false,
    clearCookie: false,
  });
  assert.deepEqual(decide({ pathname: "/node/42" }), {
    action: "redirect",
    pathname: "/",
    search: "",
    setCookie: false,
    clearCookie: false,
  });
});

test("a forced cover variant survives the redirect and nothing else does", () => {
  assert.deepEqual(
    decide({ pathname: "/projekty", search: "wersja=2&utm=mail" }),
    {
      action: "redirect",
      pathname: "/",
      search: "wersja=2",
      setCookie: false,
      clearCookie: false,
    },
  );
  assert.deepEqual(decide({ pathname: "/projekty", search: "wersja=9" }), {
    action: "redirect",
    pathname: "/",
    search: "",
    setCookie: false,
    clearCookie: false,
  });
  assert.deepEqual(decide({ pathname: "/", search: "wersja=3" }), {
    action: "rewrite",
    noStore: true,
  });
});

test("files, Next internals and API routes are not redirected", () => {
  for (const pathname of [
    "/robots.txt",
    "/__forms.html",
    "/favicon.ico",
    "/cover/stage.webp",
    "/brand/icon.svg",
    "/_next/static/chunk.js",
    "/api/revalidate",
  ]) {
    assert.deepEqual(decide({ pathname }), { action: "next", noStore: false });
  }
});

test("a matching preview link sets the cookie and drops the secret from the url", () => {
  assert.deepEqual(
    decide({ pathname: "/projekty", search: `podglad=${SECRET}` }),
    {
      action: "redirect",
      pathname: "/projekty",
      search: "",
      setCookie: true,
      clearCookie: false,
    },
  );
  assert.deepEqual(
    decide({ pathname: "/zajawka", search: `podglad=${SECRET}&wersja=1` }),
    {
      action: "redirect",
      pathname: "/",
      search: "wersja=1",
      setCookie: true,
      clearCookie: false,
    },
  );
});

test("an empty or wrong preview value clears an existing cookie", () => {
  const cleared = {
    action: "redirect",
    pathname: "/",
    search: "",
    setCookie: false,
    clearCookie: true,
  };
  assert.deepEqual(decide({ pathname: "/", search: "podglad=nope" }), cleared);
  assert.deepEqual(
    decide({
      pathname: "/projekty",
      search: "podglad=nope",
      previewCookie: SECRET,
    }),
    cleared,
  );
  assert.deepEqual(
    decide({ pathname: "/projekty", search: "podglad=", previewCookie: SECRET }),
    cleared,
  );
  assert.deepEqual(
    decide({ pathname: "/", search: "podglad", previewCookie: SECRET }),
    cleared,
  );
  assert.deepEqual(
    decide({ pathname: "/projekty", search: "podglad=nope&wersja=1" }),
    {
      action: "redirect",
      pathname: "/",
      search: "wersja=1",
      setCookie: false,
      clearCookie: true,
    },
  );
});

test("a matching cookie serves the real page and marks it uncached", () => {
  assert.deepEqual(
    decide({ pathname: "/", previewCookie: SECRET }),
    { action: "next", noStore: true },
  );
  assert.deepEqual(
    decide({ pathname: "/projekty", previewCookie: SECRET }),
    { action: "next", noStore: true },
  );
  assert.equal(secretsMatch(SECRET, SECRET), true);
  assert.equal(secretsMatch("preview-secretx", SECRET), false);
  assert.equal(secretsMatch("preview-secre", SECRET), false);
});

test("the internal rewrite of the cover route is not bounced", () => {
  assert.deepEqual(
    decide({ pathname: "/zajawka", internalCover: true }),
    { action: "next", noStore: true },
  );
  assert.deepEqual(
    decide({ pathname: "/projekty", internalCover: true }),
    {
      action: "redirect",
      pathname: "/",
      search: "",
      setCookie: false,
      clearCookie: false,
    },
  );
});
