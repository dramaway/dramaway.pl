import { permanentRedirect } from "next/navigation";
import { knowledgeHubPath } from "@/lib/routes";

export const revalidate = 60;

/** Retired address. The methods essay lives on the Baza wiedzy page. */
export default function MethodsPage() {
  permanentRedirect(knowledgeHubPath());
}
