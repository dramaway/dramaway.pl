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

function anchorTop(target: HTMLElement) {
  const anchor =
    target.tagName === "SECTION"
      ? (target.querySelector<HTMLElement>("h2, h3") ?? target)
      : target;
  const header = document.querySelector<HTMLElement>(".site-header");
  const offset = (header?.getBoundingClientRect().height ?? 0) + 16;
  return Math.max(0, anchor.getBoundingClientRect().top + window.scrollY - offset);
}

/** Scrolls to the anchor's heading and re-aims while late layout shifts settle. */
function scrollToAnchor(target: HTMLElement) {
  const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let attempts = 0;
  let lastY = window.scrollY;
  let still = 0;

  window.scrollTo({ top: anchorTop(target), behavior: smooth ? "smooth" : "auto" });

  const tick = () => {
    still = window.scrollY === lastY ? still + 1 : 0;
    lastY = window.scrollY;
    if (still < 8) {
      requestAnimationFrame(tick);
      return;
    }
    if (Math.abs(anchorTop(target) - window.scrollY) > 4 && attempts < 3) {
      attempts += 1;
      still = 0;
      window.scrollTo({ top: anchorTop(target), behavior: smooth ? "smooth" : "auto" });
      requestAnimationFrame(tick);
    }
  };
  requestAnimationFrame(tick);
}

function splitHref(href: string) {
  const [rest, hash = ""] = href.split("#", 2);
  return { path: rest.split("?", 1)[0], hash: hash ? `#${hash}` : "" };
}

function matchesLocation(href: string, pathname: string, hash: string) {
  const target = splitHref(href);
  if (target.path !== pathname) return false;
  return !target.hash || target.hash === hash;
}

function overlayCurrent(
  item: NavItem,
  pathname: string,
  hash: string,
  parent?: NavItem,
): boolean {
  if (item.external || /^https?:\/\//i.test(item.href)) return false;
  if (!matchesLocation(item.href, pathname, hash)) return false;
  if (parent) return true;
  const target = splitHref(item.href);
  if (target.hash) return true;
  return !item.children?.some((child) =>
    overlayCurrent(child, pathname, hash, item),
  );
}

function currentSectionHref(
  items: NavItem[],
  pathname: string,
  hash: string,
): string | undefined {
  return items.find(
    (item) =>
      item.children?.length &&
      (overlayCurrent(item, pathname, hash) ||
        item.children.some((child) =>
          overlayCurrent(child, pathname, hash, item),
        )),
  )?.href;
}

export function SiteHeader({ title, items }: Props) {
  const pathname = usePathname();
  const [hash, setHash] = useState("");
  const home = items.find((item) => item.href === "/");
  const visible = items.filter((item) => item.href !== "/");
  const [open, setOpen] = useState(false);
  const [overlayRendered, setOverlayRendered] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    () => new Set(),
  );
  const navId = useId();
  const overlayRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const { navRef, measureRef, visibleCount } = useDesktopNavOverflow(visible);

  useLayoutEffect(() => {
    if (open) {
      setOverlayRendered(true);
      return;
    }
    if (!overlayRendered) return;
    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0
      : 520;
    const timer = window.setTimeout(() => setOverlayRendered(false), delay);
    return () => window.clearTimeout(timer);
  }, [open, overlayRendered]);

  useLayoutEffect(() => {
    if (!open) return;
    const activeSection = currentSectionHref(items, pathname, hash);
    setExpandedSections(activeSection ? new Set([activeSection]) : new Set());
  }, [open, items, pathname, hash]);

  useLayoutEffect(() => {
    if (!open) return;
    const overlay = overlayRef.current;
    if (!overlay) return;
    const frame = window.requestAnimationFrame(() => {
      const active = overlay.querySelector<HTMLElement>(
        'a[aria-current="page"]',
      );
      if (!active) return;
      const overlayRect = overlay.getBoundingClientRect();
      const activeRect = active.getBoundingClientRect();
      const targetTop =
        overlay.scrollTop +
        activeRect.top -
        overlayRect.top -
        (overlay.clientHeight - activeRect.height) / 2;
      overlay.scrollTo({
        top: Math.max(0, targetTop),
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open, pathname, hash, expandedSections]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!window.location.hash) return;
    const id = decodeURIComponent(window.location.hash.slice(1));
    const timer = window.setTimeout(() => {
      const target = document.getElementById(id);
      if (target) scrollToAnchor(target);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    const update = () => setHash(window.location.hash);
    update();
    window.addEventListener("hashchange", update);
    window.addEventListener("popstate", update);
    return () => {
      window.removeEventListener("hashchange", update);
      window.removeEventListener("popstate", update);
    };
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

      <nav
        ref={navRef}
        aria-label="Nawigacja główna"
        className="site-nav-desktop"
      >
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
        ref={overlayRef}
        id={navId}
        aria-label="Nawigacja główna"
        className="site-nav-overlay"
        data-state={open ? "open" : "closing"}
        hidden={!overlayRendered}
        inert={!open}
        onClick={(event) => {
          const link = (event.target as HTMLElement).closest("a");
          if (!link) return;
          setOpen(false);
          const url = new URL(link.href, window.location.href);
          if (url.origin !== window.location.origin) return;
          setHash(url.hash);
          if (url.pathname !== window.location.pathname || !url.hash) return;
          const target = document.getElementById(
            decodeURIComponent(url.hash.slice(1)),
          );
          if (!target) return;
          event.preventDefault();
          window.history.pushState(null, "", url.pathname + url.search + url.hash);
          window.setTimeout(() => scrollToAnchor(target), 60);
        }}
      >
        <ul className="page site-nav-overlay-list">
          <li>
            <NavLink
              item={home ?? { href: "/", label: "Strona główna" }}
              pathname={pathname}
              current={pathname === "/"}
            >
              {home?.label ?? "Strona główna"}
            </NavLink>
          </li>
          {visible.map((item, index) => {
            const children = item.children ?? [];
            const expanded = expandedSections.has(item.href);
            const submenuId = `${navId}-group-${index}`;
            return (
              <li key={`${item.href}:${item.label}:${index}`}>
                <div className="site-nav-overlay-item-row">
                  <NavLink
                    item={item}
                    pathname={pathname}
                    current={overlayCurrent(item, pathname, hash)}
                  >
                    {item.label}
                  </NavLink>
                  {children.length ? (
                    <button
                      type="button"
                      className="site-nav-overlay-expand"
                      aria-expanded={expanded}
                      aria-controls={submenuId}
                      aria-label={`${expanded ? "Ukryj" : "Pokaż"} ${children.length} pozycji: ${item.label}`}
                      onClick={() =>
                        setExpandedSections((current) => {
                          const next = new Set(current);
                          if (next.has(item.href)) next.delete(item.href);
                          else next.add(item.href);
                          return next;
                        })
                      }
                    >
                      <ExpandIcon expanded={expanded} />
                    </button>
                  ) : null}
                </div>
                {children.length ? (
                  <div
                    id={submenuId}
                    className="site-nav-overlay-submenu"
                    aria-hidden={!expanded}
                    inert={!expanded}
                  >
                    <ul className="site-nav-overlay-sub">
                      {children.map((child, childIndex) => (
                        <li key={`${child.href}:${child.label}:${childIndex}`}>
                          <NavLink
                            item={child}
                            pathname={pathname}
                            current={overlayCurrent(child, pathname, hash, item)}
                          >
                            {child.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </li>
            );
          })}
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
    setOpen,
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
      onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key !== "Escape" || !open) return;
        event.preventDefault();
        event.stopPropagation();
        setIgnoreHover(true);
        setOpen(false);
        rootRef.current?.querySelector<HTMLElement>("a, button")?.focus();
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
        <span className="site-nav-sizer-sub">
          {children.map((child, index) => (
            <span key={`${child.href}:${child.label}:${index}`}>
              {child.label}
            </span>
          ))}
        </span>
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
  const { rootRef, open, setOpen, flyoutProps } = useNavFlyout(resetKey);
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
          onClick={() => setOpen(true)}
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
  current,
  children,
}: {
  item: NavItem;
  pathname: string;
  current?: boolean;
  children: string;
}) {
  const currentPage = current ?? isCurrentPage(item, pathname);
  const currentBranch = itemIsCurrent(item, pathname);
  const className = cn("hover:text-magenta", currentBranch && "text-magenta");
  if (item.external || /^https?:\/\//i.test(item.href)) {
    return (
      <a href={item.href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link
      href={item.href}
      aria-current={currentPage ? "page" : undefined}
      data-branch={currentBranch ? "" : undefined}
      className={className}
    >
      {children}
    </Link>
  );
}

function MoreIcon() {
  return (
    <svg
      viewBox="0 0 24 30"
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

function ExpandIcon({
  expanded,
}: {
  expanded: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="site-nav-expand-icon"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={expanded ? "m6 15 6-6 6 6" : "m6 9 6 6 6-6"} />
    </svg>
  );
}
