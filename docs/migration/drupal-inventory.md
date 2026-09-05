# Inwentaryzacja Drupal → cel Sanity

Fakty z lokalnych zrzutów w `private/dumps/` (nie commitowanych).  
**Co już poszło do Sanity:** [fundacja-status.md](fundacja-status.md).  
Model docelowy: [ADR-003](../decisions/ADR-003-content-model-and-mvp.md).  
Mapujemy **na** typy Sanity, nie klonujemy `node_type`.

## Mapa domen → bazy

| Stara domena / rola | Baza MySQL | Plik dump (lokalnie) | W MVP |
|---------------------|------------|----------------------|--------|
| fundacja.dramaway.pl | `drama_mfund` | `drama_mfund_*.sql` | **Źródło główne** |
| teatrzaangazowany / portal wiedzy | `drama_teatr` | **`drama_teatr_1787254349.sql.gz` (jest na dysku)** | Źródło do **Czytelni** (`publication`), nie osobny serwis |
| dramaway.pl (spinacz) | `drama_spinacz` | — | Poza MVP |
| centrum (szkolenia) | `drama_mszkol` | — | Link zewnętrzny |

## Fundacja (`drama_mfund`)

36 nodów łącznie (34 opublikowane, 2 nieopublikowane).

| Drupal `node_type` | Liczba | Cel Sanity (orientacyjnie) | Uwagi |
|--------------------|--------|----------------------------|--------|
| `page` | 23 | `page` (+ ewentualnie treści projektów / metod) | Podstrony, statut, o fundacji itd. |
| `czlonek_zespolu` | 7 | `person` | Bio + zdjęcie |
| `aktualnosc` | 4 | `page` lub przyszły typ news / na razie decyzja produktowa | Kickoff: newsfeed może być nowy |
| `simplenews` | 2 | — (poza MVP CMS) | Newsletter — nie migrujemy jako treść strony |

Pola i aliasy URL — do doprecyzowania przy skrypcie migracji (nie w tym kroku).

## Portal wiedzy (`drama_teatr`)

425 nodów łącznie (412 opublikowanych, 13 nieopublikowanych).

| Drupal `node_type` | Liczba | Cel Sanity (orientacyjnie) | Priorytet MVP |
|--------------------|--------|----------------------------|---------------|
| `wydarzenie` | 150 | **nie** w MVP | Poza — nie importowane |
| `persona` | 89 | **nie** jako `person` | Tytuły → stringi `publication.authors` (22 artykuły) |
| `article` | 84 (82 opublikowane, 2 nie) | `publication` | **Zrobione 2026-09-05:** 82 w Sanity; 47 `listed` z Worda; 2 nieopublikowane pominięte |
| `projekt` | 54 | nie mieszać z `project` fundacji | Poza — nie importowane |
| `organizacja` | 30 | poza | Poza — nie importowane |
| `page` | 14 | poza Czytelnią | Poza — nie importowane |
| `newsletter` | 4 | poza | — |
| `event_calendar` | (typ istnieje) | poza | — |

**Zasada:** nie importujemy 425 nodów hurtem. Czytelnia = 82 opublikowane artykuły. Kuracja listingu (`listed`) jest w `scripts/czytelnia-curated.json`, nie w taksonomii Drupala. Stare szuflady formatu (Publikacje 51 / Scenariusze 15 / Książki 8 / Multimedia 8 w polu `field_kategoria_czytelnii`) → `legacyDrupal.format`, nie oś IA.

PDF `joker_system_maria_kwiatek_4.pdf` = załącznik nielistowanego artykułu *Odkrywamy karty Joker System* (`odkrywamy-karty-joker-system-augusto-boala-maria-kwiatek`).

## Typy Sanity (przypomnienie)

`project` · `person` · `page` · `publication` · `readingMethod` · `siteSettings`

Art Generacje: struktura edycji w `project` (lub typ powiązany) — zob. [art-generacje.md](../concept/art-generacje.md).
