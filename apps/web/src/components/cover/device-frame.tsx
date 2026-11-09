import type { ReactNode } from "react";

type Props = {
  /** Shown in the address bar (desktop browser only). */
  address: string;
  /** Accessible description of what the frame shows. */
  label: string;
  children: ReactNode;
  /** Painted over the screen (e.g. the curtain of variant 3). */
  overlay?: ReactNode;
};

/**
 * One frame, three devices — CSS picks by viewport: a browser window from
 * `lg`, a tablet from `md`, a phone below. The screen inside is a container
 * the mini site scales against.
 */
export function DeviceFrame({ address, label, children, overlay }: Props) {
  return (
    <figure className="cover-frame" role="img" aria-label={label}>
      <div className="cover-frame-bar" aria-hidden>
        <span className="cover-frame-dots">
          <span />
          <span />
          <span />
        </span>
        <span className="cover-frame-address">{address}</span>
      </div>
      <div className="cover-frame-view" aria-hidden>
        {children}
        {overlay}
      </div>
    </figure>
  );
}
