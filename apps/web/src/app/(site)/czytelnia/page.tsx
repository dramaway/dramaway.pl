import { permanentRedirect } from "next/navigation";
import { LIBRARY_ANCHOR, knowledgeHubPath } from "@/lib/routes";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/** Retired listing. Old links keep their filters and land on the library. */
export default async function CzytelniaPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(await searchParams)) {
    if (key !== "rodzaj" && key !== "kategoria") continue;
    const first = Array.isArray(value) ? value[0] : value;
    if (first) params.set(key, first);
  }
  const query = params.toString();
  permanentRedirect(
    `${knowledgeHubPath()}${query ? `?${query}` : ""}#${LIBRARY_ANCHOR}`,
  );
}
