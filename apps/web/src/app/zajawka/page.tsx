import type { Metadata } from "next";
import { CoverScreen } from "@/components/cover/cover-screen";
import { COVER_SITE_LABEL, PREMIERE } from "@/components/cover/cover-copy";
import { getResolvedSite } from "@/lib/site";

const description = `${COVER_SITE_LABEL} – premiera w niedzielę, ${PREMIERE.date}.`;

export const metadata: Metadata = {
  title: `Premiera ${PREMIERE.date}`,
  description,
  robots: { index: false, follow: false },
  alternates: { canonical: "/" },
  openGraph: {
    description,
    url: "/",
    images: [
      {
        url: "/cover/og.webp",
        width: 1200,
        height: 630,
        alt: COVER_SITE_LABEL,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    description,
    images: ["/cover/og.webp"],
  },
};

/**
 * Pre-launch cover. Lives outside the `(site)` group: no header, no footer.
 * Gating (which requests land here) is not part of this page.
 */
export default async function CoverPage() {
  const site = await getResolvedSite();

  return (
    <CoverScreen
      title={site.title}
      links={site.footer.links}
      photo={{ src: "/cover/stage.webp", width: 1080, height: 720 }}
    />
  );
}
