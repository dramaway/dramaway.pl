"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav } from "@/lib/routes";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
};

export function SiteHeader({ title }: Props) {
  const pathname = usePathname();
  const items = mainNav().filter((item) => item.href !== "/");

  return (
    <header className="page flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
      <Link href="/" aria-label={title}>
        <Image
          src="/logo-dramaway.png"
          alt={title}
          width={117}
          height={57}
          priority
        />
      </Link>

      <nav
        aria-label="Główna"
        className="flex flex-wrap gap-x-8 gap-y-3 font-display text-small font-semibold uppercase sm:text-lead"
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={pathname === item.href ? "page" : undefined}
            className={cn(
              "hover:text-magenta",
              pathname === item.href && "text-magenta",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
