import type { Metadata } from "next";
import localFont from "next/font/local";
import { brandMetadata } from "@/lib/brand";
import { getSiteSettings } from "@/lib/sanity/fetch";
import { siteIndexingEnabled, siteOrigin } from "@/lib/site-url";
import "./globals.css";

const museoModerno = localFont({
  src: "./fonts/museomoderno-latin-ext.woff2",
  variable: "--font-museomoderno",
  weight: "600 900",
  display: "swap",
});

const alexandria = localFont({
  src: "./fonts/alexandria-latin-ext.woff2",
  variable: "--font-alexandria",
  weight: "300 600",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = settings?.title?.trim() || "DramaWay — Fundacja";
  const description = settings?.tagline?.trim() || "Fundacja Drama Way";

  const index = siteIndexingEnabled();

  return {
    metadataBase: new URL(siteOrigin()),
    title: { default: title, template: `%s — ${title}` },
    description,
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: false, nocache: true },
    ...brandMetadata(settings),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      className={`${museoModerno.variable} ${alexandria.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
