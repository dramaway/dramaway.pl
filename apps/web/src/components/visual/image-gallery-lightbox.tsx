"use client";

import { useEffect } from "react";
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
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".yarl__root");
    if (!root) return;

    const siblings = Array.from(document.body.children).filter(
      (element) => !element.contains(root),
    );
    const previousInert = siblings.map((element) => ({
      element,
      wasInert: element.hasAttribute("inert"),
    }));
    for (const { element } of previousInert) {
      element.setAttribute("inert", "");
    }

    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-label", SUBPAGE.gallery.dialog);
    root.setAttribute("tabindex", "-1");

    const focusable = () =>
      Array.from(
        root.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.getClientRects().length > 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const elements = focusable();
      const first = elements[0];
      const last = elements.at(-1);
      if (!first || !last) {
        event.preventDefault();
        root.focus();
        return;
      }

      const active = document.activeElement;
      if (!root.contains(active)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    root.querySelector<HTMLElement>("button:not([disabled])")?.focus();
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      for (const { element, wasInert } of previousInert) {
        if (!wasInert) element.removeAttribute("inert");
      }
    };
  }, []);

  return (
    <Lightbox
      open
      close={onClose}
      index={index}
      slides={slides}
      plugins={[Zoom]}
      zoom={{ maxZoomPixelRatio: 1 }}
      controller={{ aria: true, closeOnBackdropClick: true, closeOnEscape: true }}
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
