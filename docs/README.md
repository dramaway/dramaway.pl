# Dokumentacja DramaWay

Mapa dokumentów projektu. Treść po polsku; nazwy plików ADR i ścieżek kodu — po angielsku.

## Handoff (start sesji)

| Plik | Opis |
|------|------|
| [HANDOFF.md](HANDOFF.md) | **Aktualny stan projektu i następne kroki** — czytaj na starcie nowego czatu; aktualizuj na bieżąco |

## Koncept

| Plik | Opis |
|------|------|
| [concept/ia.md](concept/ia.md) | Informacyjna architektura fundacji (nawigacja MVP) |
| [concept/art-generacje.md](concept/art-generacje.md) | Art Generacje jako serce serwisu |

## Decyzje (ADR)

| Plik | Opis |
|------|------|
| [decisions/ADR-001-stack.md](decisions/ADR-001-stack.md) | Next.js 15, Tailwind v4, shadcn, Sanity, Netlify |
| [decisions/ADR-002-repo-and-language.md](decisions/ADR-002-repo-and-language.md) | Git lokalny, język EN/PL, dumpów nie ma w repo |
| [decisions/ADR-003-content-model-and-mvp.md](decisions/ADR-003-content-model-and-mvp.md) | Zakres MVP i typy treści Sanity |

## Migracja

| Plik | Opis |
|------|------|
| [migration/drupal-inventory.md](migration/drupal-inventory.md) | Typy treści z dumpów Drupal → cel w Sanity |
| [migration/legacy-layout.md](migration/legacy-layout.md) | Gdzie na dysku leży legacy (FTP, snapshoty) |

## Guides

`guides/` — później (uruchomienie lokalne, edycja w Sanity Studio).

## Źródło konceptu

Założenia IA i stacku pochodzą z kickoffu projektu (mapa serwisu + decyzje techniczne).  
Paczka pod inną rolę współpracy (`private/dramaway-setup-ustalenia/`) **nie** jest kanonem w repo — wyciągnięty kanon żyje tu, w `docs/`.
