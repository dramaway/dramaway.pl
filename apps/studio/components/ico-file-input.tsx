import { useClient, type FileValue, type ObjectInputProps } from "sanity";

type Props = ObjectInputProps<FileValue>;

/** CDN URL for a `sanity.fileAsset` ref (`file-{id}-{ext}`). */
function fileCdnUrl(
  ref: string,
  projectId: string,
  dataset: string,
): string | null {
  if (!ref.startsWith("file-")) return null;
  const rest = ref.slice("file-".length);
  const dash = rest.lastIndexOf("-");
  if (dash < 1) return null;
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${rest.slice(0, dash)}.${rest.slice(dash + 1)}`;
}

/**
 * File input plus a 32×32 raster preview. ICO cannot be a Sanity image
 * asset (API 422), so we store it as a file and preview it in the browser.
 */
export function IcoFileInput(props: Props) {
  const client = useClient({ apiVersion: "2025-01-01" });
  const { projectId, dataset } = client.config();
  const ref = props.value?.asset?._ref;
  const url =
    ref && projectId && dataset ? fileCdnUrl(ref, projectId, dataset) : null;

  return (
    <div>
      {props.renderDefault(props)}
      {url ? (
        <div
          style={{
            marginTop: 12,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <img
            src={url}
            alt=""
            width={32}
            height={32}
            style={{
              imageRendering: "pixelated",
              background:
                "repeating-conic-gradient(#c8c8c8 0% 25%, #fff 0% 50%) 50% / 8px 8px",
            }}
          />
          <span style={{ fontSize: 12, opacity: 0.7 }}>Preview (32×32)</span>
        </div>
      ) : (
        <p style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>
          No ICO in the file library yet. Use Upload on this field — Select only
          lists existing file assets, not images.
        </p>
      )}
    </div>
  );
}
