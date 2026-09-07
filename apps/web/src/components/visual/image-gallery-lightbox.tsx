"use client";

import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import type { SlideImage } from "yet-another-react-lightbox";
import { SUBPAGE } from "@/lib/subpage-copy";

type GalleryLightboxProps = {
  index: number;
  slides: SlideImage[];
  onClose: () => void;
  onIndex: (index: number) => void;
};

/** Loaded only when the mosaic opens — keep YARL off pages that never click. */
export function GalleryLightbox({
  index,
  slides,
  onClose,
  onIndex,
}: GalleryLightboxProps) {
  return (
    <Lightbox
      open
      close={onClose}
      index={index}
      slides={slides}
      plugins={[Zoom]}
      zoom={{ maxZoomPixelRatio: 1 }}
      controller={{ closeOnBackdropClick: true }}
      on={{ view: ({ index: current }) => onIndex(current) }}
      labels={{
        Close: SUBPAGE.gallery.close,
        Next: SUBPAGE.gallery.next,
        Previous: SUBPAGE.gallery.previous,
        "Zoom in": SUBPAGE.gallery.zoomIn,
        "Zoom out": SUBPAGE.gallery.zoomOut,
      }}
    />
  );
}
