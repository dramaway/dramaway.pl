import { permanentRedirect } from "next/navigation";
import { knowledgeHubPath } from "@/lib/routes";

/** Retired listing. Publications are listed on Baza wiedzy. */
export default function CzytelniaPage() {
  permanentRedirect(knowledgeHubPath());
}
