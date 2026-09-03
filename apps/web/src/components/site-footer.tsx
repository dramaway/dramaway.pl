import Image from "next/image";
import Link from "next/link";

type Props = {
  title: string;
  /** Always a string — `getResolvedSite()` already applies the Boal fallback. */
  note: string;
};

export function SiteFooter({ title, note }: Props) {
  return (
    <footer className="mt-auto">
      <div className="page flex flex-col gap-8 py-section sm:flex-row sm:items-start sm:justify-between">
        <Link href="/" aria-label={title}>
          <Image
            src="/logo-dramaway.png"
            alt={title}
            width={117}
            height={57}
          />
        </Link>
        <p className="measure font-body text-body">{note}</p>
      </div>
    </footer>
  );
}
