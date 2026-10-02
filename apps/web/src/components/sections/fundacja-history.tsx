import { Section } from "@/components/layout/section";
import { HistoryTimeline } from "@/components/sections/history-timeline";
import { PortableBody, hasPortableContent } from "@/components/portable-body";
import type {
  AboutHistoryLayout,
  PortableContent,
  ResolvedAboutHistoryItem,
} from "@/lib/sanity/types";

type FundacjaHistoryProps = {
  heading?: string | null;
  lead?: PortableContent | null;
  layout?: AboutHistoryLayout;
  items: readonly ResolvedAboutHistoryItem[];
};

/**
 * Timeline for /fundacja. Omitted entirely when there are no items —
 * Figma's ‘11/’12/’13 copy is lorem from a bio, not CMS data.
 */
export function FundacjaHistory({
  heading,
  lead,
  layout = "vertical",
  items,
}: FundacjaHistoryProps) {
  if (items.length === 0) return null;
  const leadBody = hasPortableContent(lead) ? lead : null;
  const headingId = heading ? "fundacja-historia" : undefined;

  return (
    <Section aria-labelledby={headingId}>
      {heading || leadBody ? (
        <div className="stack-narrow">
          {heading ? (
            <h2 id={headingId} className="font-display text-h3 font-black">
              {heading}
            </h2>
          ) : null}
          {leadBody ? <PortableBody value={leadBody} /> : null}
        </div>
      ) : null}
      <HistoryTimeline
        items={items}
        layout={layout}
        spaced={Boolean(heading || leadBody)}
      />
    </Section>
  );
}
