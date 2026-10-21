import type { ReactNode } from "react";

export function ArticleShell({ children }: { children: ReactNode }) {
  return <article className="page py-section">{children}</article>;
}

export function ListingShell({ children }: { children: ReactNode }) {
  return <div className="page py-section">{children}</div>;
}
