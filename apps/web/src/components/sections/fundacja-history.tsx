import { Section } from "@/components/layout/section";
import { cn } from "@/lib/utils";
import type { ResolvedAboutHistoryItem } from "@/lib/sanity/types";

const MARKER_TONES = [
  "bg-brand-1",
  "bg-brand-2",
  "bg-brand-3",
  "bg-brand-4",
  "bg-brand-5",
  "bg-brand-6",
  "bg-brand-7",
] as const;

type FundacjaHistoryProps = {
  heading?: string | null;
  lead?: string | null;
  items: readonly ResolvedAboutHistoryItem[];
};

/**
 * Timeline for /fundacja. Omitted entirely when there are no items —
 * Figma's ‘11/’12/’13 copy is lorem from a bio, not CMS data.
 */
export function FundacjaHistory({ heading, lead, items }: FundacjaHistoryProps) {
  if (items.length === 0) return null;

  return (
    <Section>
      <div className="stack-narrow">
        {heading ? (
          <h2 className="font-display text-h3 font-black">{heading}</h2>
        ) : null}
        {lead ? <p className="mt-8 text-lead">{lead}</p> : null}
        <ol className="history-list mt-8">
          {items.map((item, index) => (
            <li key={`${item.year}-${item.title}`} className="history-item">
              <span
                aria-hidden
                className={cn(
                  "history-marker",
                  MARKER_TONES[index % MARKER_TONES.length],
                )}
              >
                {item.year}
              </span>
              <div>
                <h3 className="history-title text-body font-semibold">
                  {item.title}
                </h3>
                {item.body ? (
                  <p className="mt-4 text-body">{item.body}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
