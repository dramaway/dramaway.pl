import { SocialIcon } from "@/components/social-icon";
import type { FooterLink } from "@/lib/sanity/types";
import { SUBPAGE } from "@/lib/subpage-copy";

/**
 * Rows with text (e-mail, phone, any labelled link) stack as a list.
 * The rest sit in one row of round icon buttons. CMS order inside each.
 */
export function FooterLinks({ links }: { links: FooterLink[] }) {
  if (links.length === 0) return null;
  const withText = links.filter((link) => link.text);
  const iconOnly = links.filter((link) => !link.text);

  return (
    <nav className="footer-links" aria-label={SUBPAGE.a11y.footerLinks}>
      {withText.length > 0 ? (
        <ul className="footer-contact" role="list">
          {withText.map((link) => (
            <li key={link.key}>
              <a
                href={link.href}
                className="footer-contact-link"
              >
                <SocialIcon
                  service={link.service}
                  iconUrl={link.iconUrl}
                  className="footer-link-icon"
                />
                <span className="footer-contact-text">{link.text}</span>
              </a>
            </li>
          ))}
        </ul>
      ) : null}
      {iconOnly.length > 0 ? (
        <ul className="footer-social" role="list">
          {iconOnly.map((link) => (
            <li key={link.key}>
              <a
                href={link.href}
                className="footer-social-link"
                aria-label={link.ariaLabel}
                title={link.ariaLabel}
              >
                <SocialIcon
                  service={link.service}
                  iconUrl={link.iconUrl}
                  className="footer-link-icon"
                />
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </nav>
  );
}
