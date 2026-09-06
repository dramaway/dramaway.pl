import type { ReactNode } from "react";

export type FoldListItem = {
  title: string;
  children: ReactNode;
};

/**
 * Native disclosure list. Closed by default; several panels may be open.
 * Empty `items` renders nothing.
 */
export function FoldList({ items }: { items: FoldListItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="fold">
      {items.map((item, index) => (
        <details key={`${item.title}-${index}`} className="fold-item">
          <summary className="fold-summary font-display text-h3 font-black">
            <span>{item.title}</span>
            <span aria-hidden className="fold-rule" />
          </summary>
          <div className="fold-panel">{item.children}</div>
        </details>
      ))}
    </div>
  );
}
