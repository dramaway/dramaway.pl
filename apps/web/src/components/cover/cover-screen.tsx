import Image from "next/image";
import { SocialIcon } from "@/components/social-icon";
import { DotBand } from "@/components/visual/dot-band";
import type { FooterLink } from "@/lib/sanity/types";
import { DeviceFrame } from "./device-frame";
import {
  COVER_QUERY_PARAM,
  COVER_SITE_LABEL,
  COVER_STORAGE_KEY,
  COVER_VARIANTS,
  PREMIERE,
} from "./cover-copy";
import { BellMark, CurtainOverlay, RehearsalMark } from "./cover-illustrations";
import { MiniSite } from "./mini-site";

type Props = {
  title: string;
  links: FooterLink[];
  /** Hero photo of the new site, shown inside the frame's mini site. */
  photo: { src: string; width: number; height: number };
  /** Text in the frame's address bar. */
  address?: string;
};

/**
 * Picks the variant before first paint, so there is no flash of version 1.
 * Rotation: random start, then the next one on each visit (per browser).
 * `?wersja=N` forces a variant and leaves the rotation alone. Storage may
 * throw (private mode, blocked cookies) — then every visit is random.
 */
const pickVariantScript = `(function(){
var el=document.currentScript&&document.currentScript.parentElement;if(!el)return;
var n=${COVER_VARIANTS.length},v=0,k=${JSON.stringify(COVER_STORAGE_KEY)};
try{var q=new URLSearchParams(location.search).get(${JSON.stringify(COVER_QUERY_PARAM)});if(q&&+q>=1&&+q<=n)v=+q;}catch(e){}
if(!v){var last=0;try{last=parseInt(localStorage.getItem(k),10)||0;}catch(e){}
v=last>=1&&last<=n?last%n+1:1+Math.floor(Math.random()*n);
try{localStorage.setItem(k,String(v));}catch(e){}}
el.setAttribute("data-cover",String(v));
})();`;

/** Polish typesetting: no single-letter word or dash left at a line end. */
const NBSP = "\u00a0";

const premiereSentence = (
  <>
    {COVER_SITE_LABEL}{NBSP}– premiera{" "}
    <span className="cover-date">
      {PREMIERE.weekday}, {PREMIERE.date}
    </span>
    .
  </>
);

export function CoverScreen({
  title,
  links,
  photo,
  address = "fundacja.dramaway.pl",
}: Props) {
  const withText = links.filter((link) => link.text);
  const iconOnly = links.filter((link) => !link.text);

  return (
    <div className="cover" data-cover="1" suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: pickVariantScript }} />

      <div className="cover-stage">
        <div className="cover-logo">
          <Image
            src="/logo-dramaway.png"
            alt={title}
            width={117}
            height={57}
            priority
          />
        </div>

        <div className="cover-copy">
          <div className="cover-variant" data-cover-v="1">
            <RehearsalMark />
            <h1 className="cover-title">Próba generalna.</h1>
            <p className="cover-lead">{premiereSentence}</p>
          </div>

          <div className="cover-variant" data-cover-v="2">
            <BellMark />
            <h1 className="cover-title">Trzeci dzwonek.</h1>
            <p className="cover-lead">{premiereSentence}</p>
          </div>

          <div className="cover-variant" data-cover-v="3">
            <h1 className="cover-title">
              Kurtyna w{NBSP}górę
              <br />
              <span className="cover-date">{PREMIERE.date}</span>.
            </h1>
            <p className="cover-lead">
              {COVER_SITE_LABEL}. Do zobaczenia {PREMIERE.weekday}.
            </p>
          </div>

          {links.length > 0 ? (
            <nav className="cover-contact" aria-label="Kontakt">
              {withText.map((link) => (
                <a
                  key={link.key}
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
              ))}
              {iconOnly.map((link) => (
                <a
                  key={link.key}
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
              ))}
            </nav>
          ) : null}
        </div>

        <div className="cover-media">
          <DeviceFrame
            address={address}
            label="Podgląd nowej strony: nagłówek „Co robimy?” i zdjęcie aktorki siedzącej na scenie"
            overlay={<CurtainOverlay />}
          >
            <MiniSite photo={photo} />
          </DeviceFrame>
        </div>
      </div>

      {/* Band split in two: one row above the frame, one at the foot. */}
      <DotBand className="cover-band cover-band-top" />
      <DotBand className="cover-band cover-band-bottom" />
    </div>
  );
}
