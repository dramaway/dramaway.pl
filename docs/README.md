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
| [concept/art-generacje.md](concept/art-generacje.md) | Art Generacje jako serce serwisu |

## Design

| Plik | Opis |
|------|------|
| [design/system.md](design/system.md) | **Kanon UI** — tokeny, klasy kompozycyjne, prymitywy, jak dołożyć sekcję |
| [design/figma-baseline.md](design/figma-baseline.md) | Pomiary z Figmy — node ID ekranów, kolory, typografia, geometria kół i zdjęć |

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
| [guides/dependencies.md](guides/dependencies.md) | Aktualizacja deps: catalog pnpm, Dependabot, skrypty |

`guides/` — później też uruchomienie lokalne i edycja w Sanity Studio.

## Źródło konceptu

Założenia IA i stacku pochodzą z kickoffu projektu (mapa serwisu + decyzje techniczne).  
Paczka pod inną rolę współpracy (`private/dramaway-setup-ustalenia/`) **nie** jest kanonem w repo — wyciągnięty kanon żyje tu, w `docs/`.
