# Dokumentacja DramaWay

Mapa dokumentów projektu. Treść po polsku; nazwy plików ADR i ścieżek kodu — po angielsku.

## Handoff (start sesji)

| Plik | Opis |
|------|------|
| [HANDOFF.md](HANDOFF.md) | **Start sesji** — stan, następny krok |

## Koncept

| Plik | Opis |
|------|------|
| [concept/ia.md](concept/ia.md) | Informacyjna architektura fundacji (nawigacja MVP) |
| [concept/ustalenia-2026-09-05.md](concept/ustalenia-2026-09-05.md) | Zamknięte decyzje IA/podstron + most do planu migracji Czytelni |
| [concept/art-generacje.md](concept/art-generacje.md) | Art Generacje jako serce serwisu |

## Design

| Plik | Opis |
|------|------|
| [design/system.md](design/system.md) | **Kanon UI** — tokeny, klasy kompozycyjne, prymitywy, jak dołożyć sekcję |
| [design/figma-baseline.md](design/figma-baseline.md) | Pomiary z Figmy — node ID ekranów, kolory, typografia, geometria kół i zdjęć |
| [design/wireframes.html](design/wireframes.html) | Szare makiety podstron — przepisy układu, huby vs IA, co jest / co się skaluje / co zbudować |

## Decyzje (ADR)

| Plik | Opis |
|------|------|
| [decisions/ADR-001-stack.md](decisions/ADR-001-stack.md) | Next.js 15, Tailwind v4, shadcn, Sanity, Netlify |
| [decisions/ADR-002-repo-and-language.md](decisions/ADR-002-repo-and-language.md) | Git lokalny, język EN/PL, dumpów nie ma w repo |
| [decisions/ADR-003-content-model-and-mvp.md](decisions/ADR-003-content-model-and-mvp.md) | Zakres MVP i typy treści Sanity |
| [decisions/ADR-004-layout-architecture.md](decisions/ADR-004-layout-architecture.md) | Architektura layoutu: tokeny, klasy kompozycyjne, odrzucone warianty |

## Migracja

| Plik | Opis |
|------|------|
| [migration/fundacja-status.md](migration/fundacja-status.md) | **Co już jest w Sanity, luki, następne kroki** — czytaj przy pytaniach „czy to zmigrowane?” |
| [migration/drupal-inventory.md](migration/drupal-inventory.md) | Typy treści z dumpów Drupal → cel w Sanity |
| [migration/legacy-layout.md](migration/legacy-layout.md) | Gdzie na dysku leży legacy (FTP, snapshoty) |

## Guides

| Plik | Opis |
|------|------|
| [guides/sanity-roles.md](guides/sanity-roles.md) | Role Sanity przy przekazaniu (org vs projekt, Editor vs Admin) |
| [guides/cutover.md](guides/cutover.md) | Przekazanie kont (skrzynka, GitHub, Netlify, Sanity/NGO) i dzień domeny |
| [guides/cutover-foundation.md](guides/cutover-foundation.md) | Mail i checklista RODO / analityki dla Fundacji przed cutoverem |
| [guides/dependencies.md](guides/dependencies.md) | Aktualizacja deps: catalog pnpm, Dependabot, skrypty |

## Redakcja

Instrukcja dla osób uzupełniających treść. Część zrzutów jest już w tekście, reszta jest opisana w [redakcja/screeny.md](redakcja/screeny.md).

| Plik | Opis |
|------|------|
| [redakcja/README.md](redakcja/README.md) | Start: adres Studia i spis instrukcji |
| [redakcja/dostep-i-role.md](redakcja/dostep-i-role.md) | Który mail do czego służy i dlaczego redakcja jest Editor |
| [redakcja/studio-podstawy.md](redakcja/studio-podstawy.md) | Szkic, publikacja, zdjęcia, linki |
| [redakcja/strony.md](redakcja/strony.md) | Który dokument w panelu jest którą stroną |
| [redakcja/menu.md](redakcja/menu.md) | Menu witryny i skróty po lewej w Studio |
| [redakcja/tekst.md](redakcja/tekst.md) | Termin, wcięcie, Roles, kolumny |
| [redakcja/czytelnia-i-fundacja.md](redakcja/czytelnia-i-fundacja.md) | Spis Czytelni oraz O fundacji i Kontakt |

## Źródło konceptu

Założenia IA i stacku pochodzą z kickoffu projektu (mapa serwisu + decyzje techniczne).  
Paczka pod inną rolę współpracy (`private/dramaway-setup-ustalenia/`) **nie** jest kanonem w repo — wyciągnięty kanon żyje tu, w `docs/`.
