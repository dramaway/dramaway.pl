import Image from "next/image";
import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter-form";
import { urlFor } from "@/lib/sanity/image";
import type { SanityImage } from "@/lib/sanity/types";

type Props = {
  title: string;
  logo: SanityImage | null;
  logoAlt: string;
  address: string | null;
  newsletterEnabled: boolean;
};

const FALLBACK_LOGO = "/logo-dramaway.png";

export function SiteFooter({
  title,
  logo,
  logoAlt,
  address,
  newsletterEnabled,
}: Props) {
  const logoSrc = logo ? urlFor(logo).width(234).url() : FALLBACK_LOGO;

  return (
    <footer className="site-footer-wrap mt-auto">
      <div className="site-footer page py-section">
        <div className="footer-brand">
          <Link href="/" aria-label={title}>
            <Image
              src={logoSrc}
              alt={logoAlt}
              width={117}
              height={57}
              className="footer-logo"
            />
          </Link>
          {address ? (
            <p className="footer-address text-body">{address}</p>
          ) : null}
        </div>
        {newsletterEnabled ? <NewsletterForm /> : null}
      </div>
    </footer>
  );
}
