import { Section } from "@/components/layout/section";
import { PaletteRow } from "@/components/visual/palette-row";

export function QuoteBlock({
  text,
  author,
}: {
  text: string;
  author: string | null;
}) {
  return (
    <Section>
      <figure className="quote-block">
        <PaletteRow />
        <blockquote className="quote-text">{text}</blockquote>
        {author ? <figcaption className="quote-author">{author}</figcaption> : null}
        <PaletteRow />
      </figure>
    </Section>
  );
}
