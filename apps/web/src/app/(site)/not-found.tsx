import { LegacyNotFound } from "@/components/legacy-not-found";
import { notFoundMetadata } from "@/lib/not-found-metadata";

export const metadata = notFoundMetadata;

export default function SiteNotFound() {
  return <LegacyNotFound />;
}
