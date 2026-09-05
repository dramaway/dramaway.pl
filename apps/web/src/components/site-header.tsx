"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { mainNav, type NavItem } from "@/lib/routes";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
};

function itemIsCurrent(item: NavItem, pathname: string): boolean {
  if (pathname === item.href) return true;
  if (item.href !== "/" && pathname.startsWith(`${item.href}/`)) return true;
  return Boolean(
    item.children?.some((child) => itemIsCurrent(child, pathname)),
  );
}

function isCurrentPage(item: NavItem, pathname: string): boolean {
  if (pathname === item.href) return true;
  if (item.children?.length) return false;
  return item.href !== "/" && pathname.startsWith(`${item.href}/`);
}

export function SiteHeader({ title }: Props) {
  const pathname = usePathname();
  const items = mainNav().filter((item) => item.href !== "/");
  const [open, setOpen] = useState(false);
  const navId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 64rem)");
    const onChange = () => {
      if (media.matches) setOpen(false);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const main = document.querySelector("main");
    const footer = document.querySelector("footer");
    main?.setAttribute("inert", "");
    footer?.setAttribute("inert", "");

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      main?.removeAttribute("inert");
      footer?.removeAttribute("inert");
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="site-header page" data-nav-open={open ? "" : undefined}>
      <Link href="/" aria-label={title} className="site-logo">
        <Image
          src="/logo-dramaway.png"
          alt={title}
          width={117}
          height={57}
          priority
        />
      </Link>

      <nav aria-label="Główna" className="site-nav-desktop">
        {items.map((item) => (
          <NavItemViews key={item.href} item={item} pathname={pathname} />
        ))}
      </nav>

      <button
        ref={toggleRef}
        type="button"
        className="site-nav-toggle"
        aria-expanded={open}
        aria-controls={navId}
        aria-label={open ? "Zamknij menu" : "Otwórz menu"}
        onClick={() => setOpen((current) => !current)}
      >
        <MenuIcon open={open} />
      </button>

      <nav
        id={navId}
        aria-label="Główna"
        className="site-nav-overlay"
        hidden={!open}
      >
        <ul className="page site-nav-overlay-list">
          {items.map((item) => (
            <li key={item.href}>
              <NavLink item={item} pathname={pathname}>
                {item.label}
              </NavLink>
              {item.children?.length ? (
                <ul className="site-nav-overlay-sub">
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <NavLink item={child} pathname={pathname}>
                        {child.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

function NavItemViews({
  item,
  pathname,
}: {
  item: NavItem;
  pathname: string;
}) {
  if (!item.children?.length) {
    return (
      <NavLink item={item} pathname={pathname}>
        {item.label}
      </NavLink>
    );
  }

  return (
    <div className="site-nav-item">
      <NavLink item={item} pathname={pathname}>
        {item.label}
      </NavLink>
      <ul className="site-nav-sub">
        {item.children.map((child) => (
          <li key={child.href}>
            <NavLink item={child} pathname={pathname}>
              {child.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NavLink({
  item,
  pathname,
  children,
}: {
  item: NavItem;
  pathname: string;
  children: string;
}) {
  const currentPage = isCurrentPage(item, pathname);
  const currentBranch = itemIsCurrent(item, pathname);
  return (
    <Link
      href={item.href}
      aria-current={currentPage ? "page" : undefined}
      className={cn(
        "hover:text-magenta",
        currentBranch && "text-magenta",
      )}
    >
      {children}
    </Link>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="site-nav-icon"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      {open ? (
        <>
          <path d="M6 6l12 12" />
          <path d="M18 6L6 18" />
        </>
      ) : (
        <>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </>
      )}
    </svg>
  );
}
