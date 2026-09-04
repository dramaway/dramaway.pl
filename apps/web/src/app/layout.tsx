import type { Metadata } from "next";
import { Alexandria, MuseoModerno } from "next/font/google";
import { brandMetadata } from "@/lib/brand";
import { getSiteSettings } from "@/lib/sanity/fetch";
import "./globals.css";

const museoModerno = MuseoModerno({
  variable: "--font-museomoderno",
  subsets: ["latin-ext"],
  weight: ["600", "800", "900"],
  display: "swap",
});

const alexandria = Alexandria({
  variable: "--font-alexandria",
  subsets: ["latin-ext"],
  weight: ["300", "400", "600"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = settings?.title?.trim() || "DramaWay — Fundacja";
  const description = settings?.tagline?.trim() || "Fundacja Drama Way";

  return {
    title,
    description,
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
