"use client";

import { StatusScreen } from "@/components/status-screen";
import { SUBPAGE } from "@/lib/subpage-copy";

export default function SiteErrorPage() {
  return (
    <StatusScreen
      title={SUBPAGE.error.title}
      lead={SUBPAGE.error.lead}
      cta={SUBPAGE.error.cta}
    />
  );
}
