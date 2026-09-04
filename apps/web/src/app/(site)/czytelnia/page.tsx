import type { Metadata } from "next";

export const metadata: Metadata = { title: "Czytelnia / Baza wiedzy" };

export default function CzytelniaPage() {
  return (
    <div className="page py-section">
      {/* Placeholder for the Figma "baza wiedzy" frame until drama_teatr lands. */}
      <h1 className="font-display text-h1 font-black">
        Czytelnia / Baza wiedzy
      </h1>
    </div>
  );
}
