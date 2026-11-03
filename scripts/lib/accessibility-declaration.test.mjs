import assert from "node:assert/strict";
import test from "node:test";
import {
  accessibilityDeclarationBlockId,
  accessibilityDeclarationLinkIds,
  isAccessibilityDeclarationIntroduction,
} from "../../apps/web/src/lib/accessibility-declaration.ts";

test("declaration content blocks receive stable ids without changing copy", () => {
  assert.equal(
    accessibilityDeclarationBlockId(
      "Data publikacji strony internetowej: 5 listopada 2026 r.",
      "normal",
    ),
    "a11y-data-publikacja",
  );
  assert.equal(
    accessibilityDeclarationBlockId(
      "Strona internetowa jest częściowo zgodna z ustawą.",
      "normal",
    ),
    "a11y-status",
  );
  assert.equal(
    accessibilityDeclarationBlockId(
      "Adres e-mail: aldona.kudelska@dramaway.pl",
      "normal",
    ),
    "a11y-email",
  );
  assert.equal(
    accessibilityDeclarationBlockId(
      "Dostępność architektoniczna",
      "h2",
    ),
    "a11y-architektura",
  );
  assert.equal(
    accessibilityDeclarationBlockId(
      "Obsługa wniosków i skarg związanych z dostępnością",
      "h2",
    ),
    "a11y-procedura",
  );
  assert.equal(
    accessibilityDeclarationBlockId(
      "Dostępność komunikacyjno - informacyjna",
      "h2",
    ),
    "a11y-komunikacja",
  );
});

test("declaration links expose the identifiers required by the HTML pattern", () => {
  assert.deepEqual(
    accessibilityDeclarationLinkIds("https://www.dramaway.pl/"),
    { wrapperId: "a11y-zakres", linkId: "a11y-url" },
  );
  assert.deepEqual(accessibilityDeclarationLinkIds("tel:+48 607 937 719"), {
    linkId: "a11y-telefon",
  });
});

test("the introductory declaration statement is identified for its wrapper", () => {
  assert.equal(
    isAccessibilityDeclarationIntroduction(
      "Drama Way zobowiązuje się zapewnić dostępność swojej strony internetowej.",
    ),
    true,
  );
  assert.equal(
    isAccessibilityDeclarationIntroduction("Pozostałe informacje"),
    false,
  );
});
