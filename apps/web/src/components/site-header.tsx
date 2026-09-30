"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type FocusEvent,
} from "react";
import { visibleNavCount } from "@/lib/nav-overflow";
import type { NavItem } from "@/lib/routes";
import { SUBPAGE } from "@/lib/subpage-copy";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  items: NavItem[];
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

export function SiteHeader({ title, items }: Props) {
  const pathname = usePathname();
  const visible = items.filter((item) => item.href !== "/");
  const [open, setOpen] = useState(false);
  const navId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const { navRef, measureRef, visibleCount } = useDesktopNavOverflow(visible);

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

  const inlineItems = visible.slice(0, Math.min(visibleCount, visible.length));
  const overflowItems = visible.slice(Math.min(visibleCount, visible.length));

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

      <nav ref={navRef} aria-label="Główna" className="site-nav-desktop">
        <div ref={measureRef} className="site-nav-measure" aria-hidden>
          {visible.map((item, index) => (
            <span key={`${item.href}:${item.label}:${index}`}>{item.label}</span>
          ))}
          <span>
            <MoreIcon />
          </span>
        </div>
        {inlineItems.map((item, index) => (
          <div
            key={`${item.href}:${item.label}:${index}`}
            className="site-nav-slot"
          >
            <NavItemViews item={item} pathname={pathname} />
          </div>
        ))}
        {overflowItems.length ? (
          <NavOverflow
            items={overflowItems}
            pathname={pathname}
            resetKey={pathname}
          />
        ) : null}
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
          {visible.map((item, index) => (
            <li key={`${item.href}:${item.label}:${index}`}>
              <NavLink item={item} pathname={pathname}>
                {item.label}
              </NavLink>
              {item.children?.length ? (
                <ul className="site-nav-overlay-sub">
                  {item.children.map((child, childIndex) => (
                    <li key={`${child.href}:${child.label}:${childIndex}`}>
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

function useDesktopNavOverflow(items: NavItem[]) {
  const navRef = useRef<HTMLElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(items.length);
  const measureKey = items.map((item) => `${item.href}:${item.label}`).join("|");

  useLayoutEffect(() => {
    const nav = navRef.current;
    const measure = measureRef.current;
    if (!nav || !measure) return;

    const update = () => {
      const containerWidth = nav.clientWidth;
      if (containerWidth === 0) return;

      const children = [...measure.children] as HTMLElement[];
      const overflow = children.at(-1);
      const slots = children.slice(0, -1);
      if (!overflow) return;

      const gap = Number.parseFloat(getComputedStyle(nav).columnGap) || 0;
      setVisibleCount(
        visibleNavCount({
          containerWidth,
          itemWidths: slots.map((slot) => slot.getBoundingClientRect().width),
          overflowWidth: overflow.getBoundingClientRect().width,
          gap,
        }),
      );
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(nav);
    document.fonts?.addEventListener("loadingdone", update);
    void document.fonts?.ready.then(update);
    return () => {
      observer.disconnect();
      document.fonts?.removeEventListener("loadingdone", update);
    };
  }, [measureKey]);

  return { navRef, measureRef, visibleCount };
}

function useNavFlyout(resetKey: string) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [ignoreHover, setIgnoreHover] = useState(false);

  useLayoutEffect(() => {
    setOpen(false);
    setIgnoreHover(true);
    const active = document.activeElement;
    if (active instanceof HTMLElement && rootRef.current?.contains(active)) {
      active.blur();
    }
    const unlock = window.setTimeout(() => {
      setIgnoreHover(rootRef.current?.matches(":hover") ?? false);
    }, 0);
    return () => window.clearTimeout(unlock);
  }, [resetKey]);

  function closeIfLeft(related: EventTarget | null) {
    if (related instanceof Node && rootRef.current?.contains(related)) return;
    setOpen(false);
  }

  return {
    rootRef,
    open,
    flyoutProps: {
      onPointerEnter: () => {
        if (!ignoreHover) setOpen(true);
      },
      onPointerLeave: () => {
        setIgnoreHover(false);
        setOpen(false);
      },
      onFocusCapture: () => {
        if (!ignoreHover) setOpen(true);
      },
      onBlurCapture: (event: FocusEvent<HTMLDivElement>) => {
        closeIfLeft(event.relatedTarget);
      },
    },
  };
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

  return <NavItemWithChildren item={item} pathname={pathname} />;
}

function NavItemWithChildren({
  item,
  pathname,
}: {
  item: NavItem;
  pathname: string;
}) {
  const { rootRef, open, flyoutProps } = useNavFlyout(pathname);
  const children = item.children ?? [];

  return (
    <div
      ref={rootRef}
      className="site-nav-item"
      data-open={open ? "" : undefined}
      {...flyoutProps}
    >
      <span className="site-nav-sizer" aria-hidden>
        {item.label}
      </span>
      <div className="site-nav-flyout">
        <span className="site-nav-cloud" aria-hidden />
        <NavLink item={item} pathname={pathname}>
          {item.label}
        </NavLink>
        <div className="site-nav-sub" inert={open ? undefined : true}>
          <ul className="site-nav-sub-list">
            {children.map((child, index) => (
              <li key={`${child.href}:${child.label}:${index}`}>
                <NavLink item={child} pathname={pathname}>
                  {child.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function NavOverflow({
  items,
  pathname,
  resetKey,
}: {
  items: NavItem[];
  pathname: string;
  resetKey: string;
}) {
  const { rootRef, open, flyoutProps } = useNavFlyout(resetKey);
  const current = items.some((item) => itemIsCurrent(item, pathname));

  return (
    <div
      ref={rootRef}
      className="site-nav-item"
      data-align="end"
      data-open={open ? "" : undefined}
      {...flyoutProps}
    >
      <span className="site-nav-sizer" aria-hidden>
        <MoreIcon />
      </span>
      <div className="site-nav-flyout">
        <span className="site-nav-cloud" aria-hidden />
        <button
          type="button"
          className={cn("site-nav-more hover:text-magenta", current && "text-magenta")}
          aria-expanded={open}
          aria-haspopup="true"
          aria-label={SUBPAGE.a11y.moreNav}
        >
          <MoreIcon />
        </button>
        <div className="site-nav-sub" inert={open ? undefined : true}>
          <ul className="site-nav-sub-list site-nav-overflow-list">
            {items.map((item, index) => (
              <li key={`${item.href}:${item.label}:${index}`}>
                <NavLink item={item} pathname={pathname}>
                  {item.label}
                </NavLink>
                {item.children?.length ? (
                  <ul className="site-nav-overflow-sub">
                    {item.children.map((child, childIndex) => (
                      <li key={`${child.href}:${child.label}:${childIndex}`}>
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
        </div>
      </div>
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
  const className = cn("hover:text-magenta", currentBranch && "text-magenta");
  if (item.external || /^https?:\/\//i.test(item.href)) {
    return (
      <a href={item.href} className={className} rel="noopener noreferrer" target="_blank">
        {children}
      </a>
    );
  }
  return (
    <Link
      href={item.href}
      aria-current={currentPage ? "page" : undefined}
      className={className}
    >
      {children}
    </Link>
  );
}

function MoreIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="site-nav-more-icon"
      fill="currentColor"
    >
      <circle cx="5" cy="12" r="1.75" />
      <circle cx="12" cy="12" r="1.75" />
      <circle cx="19" cy="12" r="1.75" />
    </svg>
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
