# Inwentaryzacja Drupal → cel Sanity

Fakty z lokalnych zrzutów w `private/dumps/` (nie commitowanych).  
**Co już poszło do Sanity:** [fundacja-status.md](fundacja-status.md).  
Model docelowy: [ADR-003](../decisions/ADR-003-content-model-and-mvp.md).  
Mapujemy **na** typy Sanity, nie klonujemy `node_type`.

## Mapa domen → bazy

| Stara domena / rola | Baza MySQL | Plik dump (lokalnie) | W MVP |
|---------------------|------------|----------------------|--------|
| fundacja.dramaway.pl | `drama_mfund` | `drama_mfund_*.sql` | **Źródło główne** |
| teatrzaangazowany / portal wiedzy | `drama_teatr` | `drama_teatr_*.sql.gz` | Źródło do **Czytelni** (`publication`), nie osobny serwis |
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
| `wydarzenie` | 150 | zwykle **nie** w MVP fundacji | Niski / poza |
| `persona` | 89 | ewentualnie `person` lub pominięcie | Niski |
| `article` | 84 | `publication` (Czytelnia) | **Kuracja** — wybrać zestaw |
| `projekt` | 54 | porównać z projektami fundacji; uniknąć duplikatów | Średni / ręcznie |
| `organizacja` | 30 | zwykle poza | Niski |
| `page` | 14 | `page` / `publication` | Selekcja |
| `newsletter` | 4 | poza | — |
| `event_calendar` | (typ istnieje) | poza | — |

**Zasada:** nie importujemy automatycznie wszystkich 425 nodów do Sanity. Najpierw fundacja; Czytelnia = świadomy podzbiór (głównie `article` + publikacje).

## Typy Sanity (przypomnienie)

`project` · `person` · `page` · `publication` · `siteSettings`

Art Generacje: struktura edycji w `project` (lub typ powiązany) — zob. [art-generacje.md](../concept/art-generacje.md).
