import { StatusScreen } from "@/components/status-screen";
import { SUBPAGE } from "@/lib/subpage-copy";

export default function SiteNotFound() {
  return (
    <StatusScreen
      title={SUBPAGE.notFound.title}
      lead={SUBPAGE.notFound.lead}
      cta={SUBPAGE.notFound.cta}
    />
  );
}
