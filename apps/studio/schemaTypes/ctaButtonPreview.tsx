import type { PreviewProps } from "sanity";

type CtaButtonPreviewProps = PreviewProps & {
  label?: string;
  pageTitle?: string;
  pageName?: string;
  filename?: string;
  href?: string;
  hash?: string;
  query?: string;
  indent?: number;
};

/** Studio card: the same green label-and-rule the site draws, plus where it goes. */
export function CtaButtonPreview(props: CtaButtonPreviewProps) {
  const label = props.label?.trim() || "Button";
  const dest =
    props.filename?.trim() ||
    props.pageTitle?.trim() ||
    props.pageName?.trim() ||
    props.href?.trim() ||
    "Brak celu";
  const hash = props.hash?.trim();
  const query = props.query?.trim();
  const extra = [query, hash].filter(Boolean).join(" ");
  const indent = props.indent === 1 || props.indent === 2 || props.indent === 3 ? props.indent : 0;

  return (
    <div style={{ padding: "6px 4px", paddingLeft: 4 + indent * 28 }}>
      <div style={{ fontWeight: 600, color: "#2f7d20", fontSize: 16 }}>{label}</div>
      <div
        style={{
          position: "relative",
          marginTop: 8,
          height: 4,
          width: 180,
          maxWidth: "100%",
          borderRadius: 999,
          background: "#369125",
        }}
      >
        <span
          style={{
            position: "absolute",
            right: -5,
            top: "50%",
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#369125",
            transform: "translateY(-50%)",
          }}
        />
      </div>
      <div
        style={{
          marginTop: 8,
          fontSize: 12,
          opacity: 0.7,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {extra ? `${dest} ${extra}` : dest}
      </div>
    </div>
  );
}
