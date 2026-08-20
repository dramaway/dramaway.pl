import Link from "next/link";
import { mainNav } from "@/lib/routes";

type Props = {
  title: string;
  centrumUrl: string;
};

export function SiteHeader({ title, centrumUrl }: Props) {
  const items = mainNav(centrumUrl);

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="text-base font-semibold tracking-tight">
          {title}
        </Link>
        <nav aria-label="Główne" className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {items
            .filter((item) => item.href !== "/")
            .map((item) =>
              item.external ? (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground"
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {item.label}
                </Link>
              ),
            )}
        </nav>
      </div>
    </header>
  );
}
