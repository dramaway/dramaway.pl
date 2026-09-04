import type { Metadata } from "next";
import { Alexandria, MuseoModerno } from "next/font/google";
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

export const metadata: Metadata = {
  title: "DramaWay — Fundacja",
  description: "Fundacja Drama Way",
};

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
