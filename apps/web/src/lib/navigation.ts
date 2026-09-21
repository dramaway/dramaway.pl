import { cmsText } from "./cms-text";
import {
  mainNav,
  personPath,
  projectPath,
  publicPathForPageSlug,
  publicationPath,
  type NavItem,
} from "./routes";
import type { SiteSettingsNavItem, SiteSettingsNavLink, SiteSettingsNavPage } from "./sanity/types";
import { safeHref } from "./safe-url";

const LANDING_LABELS: Record<string, string> = {
  projekty: "Projekty",
  "baza-wiedzy": "Baza wiedzy",
  czytelnia: "Czytelnia",
  zespol: "Zespół",
};

function hrefForPage(page: SiteSettingsNavPage): string | null {
  const slug = page.slug?.trim() || null;
  switch (page._type) {
    case "landingPage": {
      const route = page.route?.trim();
      return route ? `/${route}` : null;
    }
    case "aboutPage":
      return "/fundacja";
    case "project":
      return slug ? projectPath(slug) : null;
    case "publication":
      return slug ? publicationPath(slug) : null;
    case "person":
      return slug ? personPath(slug) : null;
    case "page":
      return slug ? publicPathForPageSlug(slug) : null;
    default:
      return null;
  }
}

function labelFor(item: SiteSettingsNavLink): string | null {
  const explicit = cmsText(item.label);
  if (explicit) return explicit;
  const page = item.page;
  if (!page) return null;
  const title = cmsText(page.title) || cmsText(page.name);
  if (title) return title;
  if (page._type === "landingPage" && page.route) {
    return LANDING_LABELS[page.route] ?? null;
  }
  if (page._type === "aboutPage") return "O fundacji";
  return null;
}

function destination(item: SiteSettingsNavLink): { href: string; external: boolean } | null {
  const raw = item.target === "path" ? item.href : item.page ? hrefForPage(item.page) : null;
  const checked = safeHref(raw);
  if (!checked || (checked.kind !== "path" && checked.kind !== "http")) return null;
  return { href: checked.href, external: checked.kind === "http" };
}

function resolveLink(item: SiteSettingsNavLink): NavItem | null {
  const dest = destination(item);
  const label = labelFor(item);
  if (!dest || !label) return null;
  return dest.external ? { href: dest.href, label, external: true } : { href: dest.href, label };
}

/**
 * CMS menu. An empty list, or a list with nothing resolvable, keeps `mainNav()`.
 * A `/` item is kept here; the header hides it because the logo already goes home.
 */
export function resolveMainNav(
  items: SiteSettingsNavItem[] | null | undefined,
): NavItem[] {
  const resolved: NavItem[] = [];
  for (const item of items ?? []) {
    const link = resolveLink(item);
    if (!link) continue;
    const children = (item.children ?? [])
      .map((child) => resolveLink(child))
      .filter((child): child is NavItem => child !== null);
    resolved.push(children.length > 0 ? { ...link, children } : link);
  }
  return resolved.length > 0 ? resolved : mainNav();
}
