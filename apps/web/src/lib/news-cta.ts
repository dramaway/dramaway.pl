import { NEWS_CTA_LABEL } from "./homepage-copy";
import { publicPathForPage } from "./routes";
import { safeHref } from "./safe-url";

export type NewsCta = {
  /** The news article. The card title always uses this. */
  articleHref: string;
  /**
   * Set only when the button leaves the article.
   * Empty href, a missing label, or a target equal to the article keeps the
   * default “czytaj więcej” button.
   */
  ctaHref: string | null;
  label: string;
};

/** Card button for a news document. A custom target is used only with its own label. */
export function newsCta(input: {
  slug: string;
  ctaHref?: string | null;
  ctaLabel?: string | null;
}): NewsCta {
  const articleHref = publicPathForPage({ slug: input.slug, isNews: true });
  const label = input.ctaLabel?.trim() ?? "";
  const safe = safeHref(input.ctaHref);
  const href =
    safe && (safe.kind === "path" || safe.kind === "http") ? safe.href : null;
  if (!href || !label || href === articleHref) {
    return { articleHref, ctaHref: null, label: NEWS_CTA_LABEL };
  }
  return { articleHref, ctaHref: href, label };
}
