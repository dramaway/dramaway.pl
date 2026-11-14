import Image from "next/image";
import Link from "next/link";
import { FooterLinks } from "@/components/footer-links";
import { NewsletterForm } from "@/components/newsletter-form";
import { urlFor } from "@/lib/sanity/image";
import type { CmsImage, FooterLink } from "@/lib/sanity/types";

type Props = {
  title: string;
  logo: CmsImage | null;
  logoAlt: string;
  address: string | null;
  links: FooterLink[];
  newsletterEnabled: boolean;
};

const FALLBACK_LOGO = "/logo-dramaway.png";

export function SiteFooter({
  title,
  logo,
  logoAlt,
  address,
  links,
  newsletterEnabled,
}: Props) {
  const logoSrc = logo ? urlFor(logo).width(234).url() : FALLBACK_LOGO;

  return (
    <footer className="site-footer-wrap mt-auto">
      <div className="site-footer page py-section">
        <div className="footer-brand">
          <Link href="/" aria-label={title} className="footer-logo-link">
            <Image
              src={logoSrc}
              alt={logoAlt}
              width={117}
              height={57}
              className="footer-logo"
            />
          </Link>
          <div className="footer-address-group">
            {address ? (
              <p className="footer-address text-body">{address}</p>
            ) : null}
            <nav className="footer-legal" aria-label="Informacje prawne">
              <Link
                href="/polityka-prywatnosci"
                className="footer-contact-link footer-legal-link"
              >
                <span className="footer-contact-text">Polityka prywatności</span>
              </Link>
              <Link
                href="/regulamin"
                className="footer-contact-link footer-legal-link"
              >
                <span className="footer-contact-text">Regulamin</span>
              </Link>
              <Link
                href="/deklaracja-dostepnosci"
                className="footer-contact-link footer-accessibility-link"
              >
                <span className="footer-contact-text">
                  Deklaracja dostępności
                </span>
              </Link>
            </nav>
          </div>
        </div>
        <FooterLinks links={links} />
        {newsletterEnabled ? <NewsletterForm /> : null}
      </div>
    </footer>
  );
}
