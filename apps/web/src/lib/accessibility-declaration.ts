export type DeclarationBlockStyle = "normal" | "h2";

function normalizeText(text: string): string {
  return text.trim().toLocaleLowerCase("pl-PL").replace(/\s+/g, " ");
}

export function accessibilityDeclarationBlockId(
  text: string,
  style: DeclarationBlockStyle,
): string | null {
  const normalized = normalizeText(text);

  if (style === "h2") {
    if (
      normalized.startsWith("procedura odwoławcza") ||
      normalized.startsWith(
        "obsługa wniosków i skarg związanych z dostępnością",
      )
    ) {
      return "a11y-procedura";
    }
    if (normalized.startsWith("dostępność architektoniczna")) {
      return "a11y-architektura";
    }
    if (
      normalized.startsWith("tłumacz polskiego języka migowego") ||
      normalized.startsWith("dostępność komunikacyjno-informacyjna") ||
      normalized.startsWith("dostępność komunikacyjno - informacyjna")
    ) {
      return "a11y-komunikacja";
    }
    return null;
  }

  if (normalized.includes("zobowiązuje się zapewnić dostępność")) {
    return "a11y-podmiot";
  }
  if (normalized.startsWith("data publikacji strony internetowej:")) {
    return "a11y-data-publikacja";
  }
  if (normalized.startsWith("data ostatniej istotnej aktualizacji:")) {
    return "a11y-data-aktualizacja";
  }
  if (normalized.startsWith("strona internetowa jest")) return "a11y-status";
  if (normalized.startsWith("adres e-mail:")) return "a11y-email";
  if (normalized.startsWith("osobą odpowiedzialną za dostępność")) {
    return "a11y-kontakt";
  }
  if (normalized.startsWith("data sporządzenia deklaracji:")) {
    return "a11y-data-sporzadzenie";
  }
  if (normalized.startsWith("data ostatniego przeglądu deklaracji:")) {
    return "a11y-data-przeglad";
  }
  return null;
}

export function accessibilityDeclarationLinkIds(href: string): {
  wrapperId?: string;
  linkId?: string;
} {
  if (/^https?:\/\/(?:www\.)?dramaway\.pl\/?$/i.test(href)) {
    return { wrapperId: "a11y-zakres", linkId: "a11y-url" };
  }
  if (href.toLowerCase().startsWith("tel:")) {
    return { linkId: "a11y-telefon" };
  }
  return {};
}

export function isAccessibilityDeclarationIntroduction(text: string): boolean {
  return normalizeText(text).includes(
    "zobowiązuje się zapewnić dostępność",
  );
}
