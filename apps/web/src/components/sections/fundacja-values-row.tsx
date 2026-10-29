"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Eight tones: brand 1–7, then brand-3 (gold) as in Figma frame `130:1316`.
 * Extra labels wrap this list.
 */
const VALUE_TONES = [
  "bg-brand-1",
  "bg-brand-2",
  "bg-brand-3",
  "bg-brand-4",
  "bg-brand-5",
  "bg-brand-6",
  "bg-brand-7",
  "bg-brand-3",
] as const;

const PORTRAIT_PHONE = "(width < 64rem) and (orientation: portrait)";
const FRICTION = 0.94;
const WALL_BOUNCE = 0.5;
const CIRCLE_BOUNCE = 0.6;
const SIDE_MARGIN = 4;
const PULL_RANGE = 1.4;
const PULL_STRENGTH = 0.17;

type Body = {
  el: HTMLElement;
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
};

type Drag = {
  body: Body;
  pointerId: number;
  offsetX: number;
  offsetY: number;
  time: number;
};

/**
 * The value circles. On a portrait phone they can be dragged by finger inside
 * the section (full viewport width, the row's height plus its padding); they
 * pull towards and push each other, bounce off the edges and glide to a stop. Everywhere else
 * the row stays a static CSS layout.
 */
export function FundacjaValuesRow({
  values,
  afterCopy,
}: {
  values: readonly string[];
  afterCopy: boolean;
}) {
  const rowRef = useRef<HTMLUListElement>(null);
  const linksRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    const phone = window.matchMedia(PORTRAIT_PHONE);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let teardown: (() => void) | null = null;
    let width = window.innerWidth;

    const setup = () => {
      const bodies: Body[] = Array.from(row.querySelectorAll(":scope > .values-item")).map((child) => {
        const el = child as HTMLElement;
        const radius = el.offsetWidth / 2;
        const homeX = el.offsetLeft + radius;
        const homeY = el.offsetTop + el.offsetHeight / 2;
        el.style.transition = "none";
        return { el, homeX, homeY, x: homeX, y: homeY, vx: 0, vy: 0, radius };
      });

      const svg = linksRef.current;
      const links: { a: Body; b: Body; line: SVGLineElement }[] = [];
      if (svg) {
        for (let i = 0; i < bodies.length; i += 1) {
          for (let j = i + 1; j < bodies.length; j += 1) {
            const a = bodies[i];
            const b = bodies[j];
            const touching =
              Math.hypot(a.homeX - b.homeX, a.homeY - b.homeY) <=
              (a.radius + b.radius) * 1.2;
            if (!touching) continue;
            const line = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "line",
            );
            svg.appendChild(line);
            links.push({ a, b, line });
          }
        }
      }

      let drag: Drag | null = null;
      let frame = 0;
      let lastFrame = 0;

      const bounds = () => {
        const rect = row.getBoundingClientRect();
        const viewport = document.documentElement.clientWidth;
        return {
          minX: SIDE_MARGIN - rect.left,
          maxX: viewport - SIDE_MARGIN - rect.left,
          minY: 0,
          maxY: row.offsetHeight,
        };
      };

      const keepInside = (body: Body, limits: ReturnType<typeof bounds>) => {
        const { radius } = body;
        if (body.x < limits.minX + radius) {
          body.x = limits.minX + radius;
          body.vx = Math.abs(body.vx) * WALL_BOUNCE;
        } else if (body.x > limits.maxX - radius) {
          body.x = limits.maxX - radius;
          body.vx = -Math.abs(body.vx) * WALL_BOUNCE;
        }
        if (body.y < limits.minY + radius) {
          body.y = limits.minY + radius;
          body.vy = Math.abs(body.vy) * WALL_BOUNCE;
        } else if (body.y > limits.maxY - radius) {
          body.y = limits.maxY - radius;
          body.vy = -Math.abs(body.vy) * WALL_BOUNCE;
        }
      };

      const separate = (limits: ReturnType<typeof bounds>) => {
        const held = drag?.body;
        for (let i = 0; i < bodies.length; i += 1) {
          for (let j = i + 1; j < bodies.length; j += 1) {
            const a = bodies[i];
            const b = bodies[j];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const distance = Math.hypot(dx, dy) || 0.001;
            const gap = a.radius + b.radius;
            if (distance >= gap) continue;

            const nx = dx / distance;
            const ny = dy / distance;
            const overlap = gap - distance;
            const shareA = a === held ? 0 : b === held ? 1 : 0.5;
            const shareB = 1 - shareA;
            a.x -= nx * overlap * shareA;
            a.y -= ny * overlap * shareA;
            b.x += nx * overlap * shareB;
            b.y += ny * overlap * shareB;

            const approach = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
            if (approach < 0) {
              const impulse = (-approach * (1 + CIRCLE_BOUNCE)) / 2;
              if (a !== held) {
                a.vx -= nx * impulse * (held === b ? 2 : 1);
                a.vy -= ny * impulse * (held === b ? 2 : 1);
              }
              if (b !== held) {
                b.vx += nx * impulse * (held === a ? 2 : 1);
                b.vy += ny * impulse * (held === a ? 2 : 1);
              }
            }
          }
        }
        for (const body of bodies) keepInside(body, limits);
      };

      const paint = () => {
        for (const body of bodies) {
          const lift = drag?.body === body ? " scale(1.06)" : "";
          body.el.style.transform = `translate3d(${body.x - body.homeX}px, ${
            body.y - body.homeY
          }px, 0)${lift}`;
        }
        for (const { a, b, line } of links) {
          line.setAttribute("x1", String(a.x));
          line.setAttribute("y1", String(a.y));
          line.setAttribute("x2", String(b.x));
          line.setAttribute("y2", String(b.y));
        }
      };
      paint();

      const tick = (now: number) => {
        const elapsed = Math.min((now - lastFrame) / 16.667, 3);
        lastFrame = now;
        let moving = drag !== null;
        const slow = Math.pow(FRICTION, elapsed);

        const held = drag?.body;
        for (let i = 0; i < bodies.length; i += 1) {
          for (let j = i + 1; j < bodies.length; j += 1) {
            const a = bodies[i];
            const b = bodies[j];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const distance = Math.hypot(dx, dy) || 0.001;
            const gap = a.radius + b.radius;
            const reach = gap + (a.radius + b.radius) * PULL_RANGE / 2;
            if (distance <= gap + 1 || distance >= reach) continue;
            const pull = PULL_STRENGTH * (1 - (distance - gap) / (reach - gap)) * elapsed;
            if (a !== held) {
              a.vx += (dx / distance) * pull;
              a.vy += (dy / distance) * pull;
            }
            if (b !== held) {
              b.vx -= (dx / distance) * pull;
              b.vy -= (dy / distance) * pull;
            }
          }
        }

        for (const body of bodies) {
          if (body === drag?.body) continue;
          body.x += body.vx * elapsed;
          body.y += body.vy * elapsed;
          body.vx *= slow;
          body.vy *= slow;
          if (Math.hypot(body.vx, body.vy) < 0.05) {
            body.vx = 0;
            body.vy = 0;
          } else {
            moving = true;
          }
        }

        const limits = bounds();
        for (let pass = 0; pass < 4; pass += 1) separate(limits);
        paint();
        frame = moving ? requestAnimationFrame(tick) : 0;
      };

      const wake = () => {
        if (frame) return;
        lastFrame = performance.now();
        frame = requestAnimationFrame(tick);
      };

      const onDown = (event: PointerEvent) => {
        if (drag || event.button > 0) return;
        const item = (event.target as HTMLElement).closest(".values-item");
        const body = bodies.find((candidate) => candidate.el === item);
        if (!body) return;

        const rect = row.getBoundingClientRect();
        drag = {
          body,
          pointerId: event.pointerId,
          offsetX: event.clientX - rect.left - body.x,
          offsetY: event.clientY - rect.top - body.y,
          time: event.timeStamp,
        };
        body.vx = 0;
        body.vy = 0;
        body.el.style.zIndex = "2";
        try {
          row.setPointerCapture(event.pointerId);
        } catch {
          // Capture is a nicety; the row still receives the moves it needs.
        }
        wake();
      };

      const onMove = (event: PointerEvent) => {
        if (!drag || event.pointerId !== drag.pointerId) return;
        const { body } = drag;
        const rect = row.getBoundingClientRect();
        const limits = bounds();
        const nextX = Math.min(
          Math.max(event.clientX - rect.left - drag.offsetX, limits.minX + body.radius),
          limits.maxX - body.radius,
        );
        const nextY = Math.min(
          Math.max(event.clientY - rect.top - drag.offsetY, limits.minY + body.radius),
          limits.maxY - body.radius,
        );
        const frames = Math.max((event.timeStamp - drag.time) / 16.667, 0.5);
        body.vx = body.vx * 0.5 + ((nextX - body.x) / frames) * 0.5;
        body.vy = body.vy * 0.5 + ((nextY - body.y) / frames) * 0.5;
        body.x = nextX;
        body.y = nextY;
        drag.time = event.timeStamp;
        wake();
      };

      const onUp = (event: PointerEvent) => {
        if (!drag || event.pointerId !== drag.pointerId) return;
        const { body } = drag;
        if (row.hasPointerCapture(event.pointerId)) {
          row.releasePointerCapture(event.pointerId);
        }
        if (reduceMotion.matches) {
          body.vx = 0;
          body.vy = 0;
        }
        body.el.style.zIndex = "";
        drag = null;
        wake();
      };

      row.addEventListener("pointerdown", onDown);
      row.addEventListener("pointermove", onMove);
      row.addEventListener("pointerup", onUp);
      row.addEventListener("pointercancel", onUp);

      return () => {
        cancelAnimationFrame(frame);
        for (const { line } of links) line.remove();
        row.removeEventListener("pointerdown", onDown);
        row.removeEventListener("pointermove", onMove);
        row.removeEventListener("pointerup", onUp);
        row.removeEventListener("pointercancel", onUp);
        for (const body of bodies) {
          body.el.style.transition = "";
          body.el.style.transform = "";
          body.el.style.zIndex = "";
        }
      };
    };

    const sync = () => {
      teardown?.();
      teardown = phone.matches ? setup() : null;
    };

    // Mobile browsers fire resize while the address bar slides; only a real
    // width change (rotation, split view) should put the circles back home.
    const onResize = () => {
      if (window.innerWidth === width) return;
      width = window.innerWidth;
      sync();
    };

    sync();
    phone.addEventListener("change", sync);
    window.addEventListener("resize", onResize);

    return () => {
      phone.removeEventListener("change", sync);
      window.removeEventListener("resize", onResize);
      teardown?.();
    };
  }, [values]);

  return (
    <ul
      ref={rowRef}
      className={cn("values-row", afterCopy && "values-row-after-copy")}
    >
      {values.map((label, index) => (
        <li
          key={`${label}-${index}`}
          className={cn("values-item", VALUE_TONES[index % VALUE_TONES.length])}
        >
          <span className="values-label">{label}</span>
        </li>
      ))}
      <li className="values-links" aria-hidden="true">
        <svg ref={linksRef} />
      </li>
    </ul>
  );
}
