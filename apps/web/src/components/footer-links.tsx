import { SocialIcon } from "@/components/social-icon";
import type { FooterLink } from "@/lib/sanity/types";
import { SUBPAGE } from "@/lib/subpage-copy";

/** http(s) leaves in a new tab; on a phone the OS hands it to the app. */
function targetProps(link: FooterLink) {
  return link.external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};
}

/**
 * Rows with text (e-mail, phone, any labelled link) stack as a list.
 * The rest sit in one row of round icon buttons. CMS order inside each.
 */
export function FooterLinks({ links }: { links: FooterLink[] }) {
  if (links.length === 0) return null;
  const withText = links.filter((link) => link.text);
  const iconOnly = links.filter((link) => !link.text);
  const newTab = SUBPAGE.a11y.newTab;

  return (
    <nav className="footer-links" aria-label={SUBPAGE.a11y.footerLinks}>
      {withText.length > 0 ? (
        <ul className="footer-contact" role="list">
          {withText.map((link) => (
            <li key={link.key}>
              <a
                href={link.href}
                className="footer-contact-link"
                {...targetProps(link)}
              >
                <SocialIcon
                  service={link.service}
                  iconUrl={link.iconUrl}
                  className="footer-link-icon"
                />
                <span className="footer-contact-text">{link.text}</span>
                {link.external ? (
                  <span className="sr-only"> {newTab}</span>
                ) : null}
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
                aria-label={
                  link.external ? `${link.ariaLabel} ${newTab}` : link.ariaLabel
                }
                title={link.ariaLabel}
                {...targetProps(link)}
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
