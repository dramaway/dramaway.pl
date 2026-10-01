import { Button, Stack } from "@sanity/ui";
import { set, type ImageValue, type ObjectInputProps } from "sanity";

type SlideFields = {
  alt?: string | null;
  caption?: string | null;
};

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Default image input plus one copy action when alt and caption disagree
 * by emptiness. Both filled, or both empty, shows no button.
 */
export function HeroSlideInput(props: ObjectInputProps<ImageValue>) {
  const value = props.value as (ImageValue & SlideFields) | undefined;
  const alt = text(value?.alt);
  const caption = text(value?.caption);
  const copyAltToCaption = Boolean(alt) && !caption;
  const copyCaptionToAlt = Boolean(caption) && !alt;

  return (
    <Stack gap={3}>
      {props.renderDefault(props)}
      {copyAltToCaption ? (
        <Button
          mode="ghost"
          text="Skopiuj alt do podpisu"
          onClick={() => props.onChange(set(alt, ["caption"]))}
        />
      ) : null}
      {copyCaptionToAlt ? (
        <Button
          mode="ghost"
          text="Skopiuj podpis do alt"
          onClick={() => props.onChange(set(caption, ["alt"]))}
        />
      ) : null}
    </Stack>
  );
}
