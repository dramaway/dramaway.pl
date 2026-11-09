import type { Metadata } from "next";
import { CoverScreen } from "@/components/cover/cover-screen";
import { PREMIERE } from "@/components/cover/cover-copy";
import { getResolvedSite } from "@/lib/site";

export const metadata: Metadata = {
  title: `Premiera ${PREMIERE.date}`,
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
