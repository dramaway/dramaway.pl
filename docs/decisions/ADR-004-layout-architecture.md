# ADR-004: Architektura layoutu i systemu wizualnego

**Date:** 2026-08-30
**Status:** Accepted

## Context

Dostaliśmy plik Figmy z siedmioma ekranami. Pomiar całego canvasu (szczegóły: [figma-baseline.md](../design/figma-baseline.md)) pokazał, że to rysunek, a nie system: 1267 węzłów bez auto-layoutu, zero zmiennych, zero stylów, zero komponentów lokalnych, jedenaście różnych lewych marginesów i ani jednego ekranu mobilnego.

Rozważana była propozycja zbudowania własnego „visual/layout system": siatka 12-kolumnowa, CSS Modules zamiast Tailwinda, mechanizm przesunięć (`--offset-x` / `--offset-y`) oraz osobne prymitywy `Dots`, `Circle`, `Line`, `ImageFrame`, `DecorationLayer`, `Composition`.

Trzeba było rozstrzygnąć, ile z tego ma pokrycie w rzeczywistym pliku.

## Decision

Trzy warstwy: **tokeny → prymitywy → sekcje**. Bez osobnego piętra komponentów editorialowych.

| Warstwa | Realizacja |
|---------|------------|
| Style | Tailwind v4, tokeny w `@theme`, kompozycje w `@layer components` |
| Geometria | kontener plus cztery nazwane układy: `.page`, `.split`, `.cols-3`, `.stack` |
| Dekoracje | tło CSS (`radial-gradient`), nie elementy DOM |
| Typografia | skala na `clamp()`, bez breakpointów |
| Responsywność | reguły autorskie, spisane w [system.md](../design/system.md) |

## Alternatives considered

| Wariant | Dlaczego odrzucony |
|---------|--------------------|
| Siatka 12-kolumnowa | Jedyna stabilna proporcja w pliku to 2/3 (zdjęcia od x ≈ 960 przy 1440). Trzy kolumny aktualności mają krok 412 przy szerokości 376, lewe zdjęcie 38% — nic z tego nie leży na dwunastce. Kontener plus trzy układy wystarczą. |
| CSS Modules zamiast Tailwinda | Zmiana [ADR-001](ADR-001-stack.md) bez zysku. Blok `@theme` w Tailwindzie v4 **jest** systemem custom properties, którego szukała propozycja. Drugi paradygmat stylowania to koszt bez korzyści. |
| Offset system `--offset-x` / `--offset-y` | Rozrzut marginesów 88–102 i 150–156 to jitter ręcznego rysowania. Mechanizm sterowania nim zabetonowałby przypadek jako regułę. Normalizujemy do dwóch wartości. |
| `Dots` renderujący N divów | Pasmo to 270 stykających się identycznych kół. Jako elementy to 270 węzłów DOM na stronę; jako dwa gradienty to zero. |
| Prymitywy `Line`, `Circle`, `Composition` | Brak pokrycia. Linii w pliku nie ma wcale, a koła mają trzy różne zastosowania, nie jedno generyczne. |
| Duży framework UI (MUI, Chakra) | W całym pliku nie ma ani jednego przycisku, inputa, modala czy taba. Jest jeden powtarzalny element: zielony link CTA. |

## Consequences

**Positive:** Mała powierzchnia do nauczenia — sześć prymitywów i cztery klasy. Dekoracje nie kosztują DOM-u. Sekcje przyjmują dane z Sanity o zmiennej liczności, więc pusta galeria nie rozwala układu. Skala typograficzna nie wymaga breakpointów.

**Negative:** Odstępstwa od Figmy trzeba świadomie utrzymywać i tłumaczyć designerce. Reguły mobilne są nasze, więc przy ewentualnych makietach mobilnych mogą wymagać rewizji.

**Risks:** Jeśli designerka dostarczy ekrany mobilne z inną art direction niż nasze reguły, część układów trzeba będzie przepisać. Ryzyko świadomie przyjęte — alternatywą było wstrzymanie prac.

## Review trigger

Gdy pojawią się makiety mobilne, gdy plik Figmy dostanie prawdziwy design system (zmienne i komponenty), albo gdy trzeci ekran z rzędu będzie wymagał układu, którego nie da się wyrazić czterema klasami.
