import type { ReactNode } from "react";

export function ArticleShell({ children }: { children: ReactNode }) {
  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-12">{children}</article>
  );
}

export function ListingShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">{children}</div>
  );
}
