import type { Metadata } from "next";

/** CMS inventory on the preview host — keep out of search indexes. */
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
