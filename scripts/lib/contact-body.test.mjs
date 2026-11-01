import assert from "node:assert/strict";
import { test } from "node:test";
import { splitContactBody } from "../../apps/web/src/lib/contact-body.ts";

const heading = (text) => ({
  _type: "block",
  style: "h3",
  children: [{ _type: "span", text }],
});

test("splits contact copy at the CMS address heading", () => {
  const directHeading = heading("Napisz do nas!");
  const directEmail = { _type: "block", children: [{ text: "biuro@dramaway.pl" }] };
  const person = (text, email) => ({
    _type: "block",
    children: [{ _type: "span", text }],
    markDefs: [{ _type: "link", href: `mailto:${email}` }],
  });
  const people = [
    person("członkini zarządu: Aldona Żejmo-Kudelska", "aldona.kudelska@dramaway.pl"),
    person("członek zarządu: Adam Gąsecki", "adam.gasecki@dramaway.pl"),
    person("koordynatorka projektu Art Generacje: Aleksandra Szaro", "aleksandra.szaro@dramaway.pl"),
  ];
  const addressHeading = heading("Adres");
  const address = { _type: "block", children: [{ text: "ul. Melsztyńska 2/11" }] };

  assert.deepEqual(splitContactBody([
    directHeading,
    directEmail,
    ...people,
    addressHeading,
    address,
  ]), {
    direct: [directEmail],
    people,
    address: [addressHeading, address],
  });
});

test("keeps all contact copy in the direct column when no address heading exists", () => {
  const body = [heading("Napisz do nas!"), { _type: "block", children: [{ text: "E-mail" }] }];

  assert.deepEqual(splitContactBody(body), {
    direct: body,
    people: [],
    address: null,
  });
});

test("returns empty columns for an empty contact body", () => {
  assert.deepEqual(splitContactBody(null), {
    direct: null,
    people: [],
    address: null,
  });
});
