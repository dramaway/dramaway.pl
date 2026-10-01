import { Button, Stack } from "@sanity/ui";
import { set, type ImageInputProps } from "sanity";

type SlideValue = {
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
export function HeroSlideInput(props: ImageInputProps<SlideValue>) {
  const alt = text(props.value?.alt);
  const caption = text(props.value?.caption);
  const copyAltToCaption = Boolean(alt) && !caption;
  const copyCaptionToAlt = Boolean(caption) && !alt;

  return (
    <Stack space={3}>
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
