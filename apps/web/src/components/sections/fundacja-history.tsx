import { Section } from "@/components/layout/section";
import { PortableBody, hasPortableContent } from "@/components/portable-body";
import { cn } from "@/lib/utils";
import type {
  PortableContent,
  ResolvedAboutHistoryItem,
} from "@/lib/sanity/types";

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
  lead?: PortableContent | null;
  items: readonly ResolvedAboutHistoryItem[];
};

/**
 * Timeline for /fundacja. Omitted entirely when there are no items —
 * Figma's ‘11/’12/’13 copy is lorem from a bio, not CMS data.
 */
export function FundacjaHistory({ heading, lead, items }: FundacjaHistoryProps) {
  if (items.length === 0) return null;
  const leadBody = hasPortableContent(lead) ? lead : null;

  return (
    <Section>
      <div className="stack-narrow">
        {heading ? (
          <h2 className="font-display text-h3 font-black">{heading}</h2>
        ) : null}
        {leadBody ? <PortableBody value={leadBody} /> : null}
        <ol className={heading || leadBody ? "history-list mt-8" : "history-list"}>
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
                <h3 className="history-title text-small font-semibold">
                  {item.title}
                </h3>
                {item.body ? (
                  <p className="mt-2 text-small">{item.body}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
