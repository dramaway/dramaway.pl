import Image from "next/image";

type Props = {
  photo: { src: string; width: number; height: number };
};

const LEAD = [
  "Odkrywamy. Badamy. Poznajemy.",
  "Spotykamy. Zmieniamy. Marzymy.",
  "Tworzymy.",
  "Ścieramy się.",
  "Kochamy…",
];

/**
 * Skeleton of the /projekty hero, drawn at a fixed "emulated" width (1440,
 * 768 or 390 — set in CSS per viewport) and scaled to the frame with `cqi`.
 * Real text for the heading and lead; a dark block for the logo and grey
 * bars for the navigation.
 */
export function MiniSite({ photo }: Props) {
  return (
    <div className="mini">
      <div className="mini-header">
        <i className="mini-logo" />
        <span className="mini-nav">
          <i />
          <i />
          <i />
          <i />
          <i />
        </span>
        <span className="mini-burger">
          <i />
          <i />
          <i />
        </span>
      </div>

      <p className="mini-title">Co robimy?</p>

      <div className="mini-photo">
        <Image
          src={photo.src}
          alt=""
          width={photo.width}
          height={photo.height}
          sizes="(min-width: 64rem) 25vw, 60vw"
          priority
        />
      </div>

      <p className="mini-lead">
        {LEAD.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </p>

      <span className="mini-band" />
    </div>
  );
}
