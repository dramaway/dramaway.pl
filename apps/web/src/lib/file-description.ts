type FileDescriptionInput = {
  mimeType?: string | null;
  originalFilename?: string | null;
  size?: number | null;
} | null | undefined;

export function pdfDescription(file: FileDescriptionInput): string | null {
  const mimeType = file?.mimeType?.toLowerCase();
  const filename = file?.originalFilename?.toLowerCase();
  if (mimeType !== "application/pdf" && !filename?.endsWith(".pdf")) {
    return null;
  }

  const size = file?.size;
  if (typeof size !== "number" || !Number.isFinite(size) || size <= 0) {
    return "PDF";
  }

  const amount =
    size < 1_000_000
      ? `${new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 0 }).format(
          size / 1_000,
        )} kB`
      : `${new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 1 }).format(
          size / 1_000_000,
        )} MB`;

  return `PDF, ${amount}`;
}

export function withFileDescription(
  title: string,
  description: string | null | undefined,
): string {
  return description ? `${title} (${description})` : title;
}
