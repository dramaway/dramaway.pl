import { StatusScreen } from "@/components/status-screen";
import { SUBPAGE } from "@/lib/subpage-copy";

export default function NotFound() {
  return (
    <StatusScreen
      title={SUBPAGE.notFound.title}
      lead={SUBPAGE.notFound.lead}
      cta={SUBPAGE.notFound.cta}
    />
  );
}
