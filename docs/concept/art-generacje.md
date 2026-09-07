# Art Generacje — serce serwisu

## Dlaczego to osobny dokument

W kickoffie Art Generacje to **flagowy projekt** fundacji: projekt międzypokoleniowy przez teatr, z bogatą dokumentacją. Ma być widoczny nie tylko jako jedna karta na `/projekty`, ale jako motyw obecny w wielu miejscach (hero, sekcje, tła — zależnie od Figmy).

Traktuj go jak **serce serwisu**, nie jak kolejny wpis z listy projektów zakończonych.

## Co musi umieć model treści

Nie wystarczy płaski `project` z tytułem i body. Potrzebujemy struktury pod:

- **wiele edycji** (w kickoffie: 9 edycji z opisami)
- **galerie** per edycja / projekt
- **partnerzy**
- **outcomes** per edycja — 0–n rezultatów (spektakl, wydarzenie, publikacja): tytuł, podtytuł/data, zdjęcie, opis. Ogólne do Figmy; nie wypełniamy z HTML na ślepo.
- wyróżnienie na homepage i liście projektów (`featured`)

**Adresy (2026-09-05):** strona projektu `/projekty/art-generacje` listuje edycje (wiersz z plamą). Klik otwiera **osobną stronę edycji** `/projekty/art-generacje/[slug]`. `slug` już jest na obiekcie `edition` w Studio. Trzy historyczne „Edycja VI” muszą mieć **różne** slugi, inaczej URL się zderzy — nie poprawiamy numeracji, tylko identyfikatory.

Nie robimy z edycji osobnego typu Sanity: nadal lista na projekcie, tylko Next dostaje zagnieżdżoną trasę.

Szczegóły pól: schemat `project` + `edition` w `apps/studio`.  
**Stan w CMS (ile edycji, skąd):** [fundacja-status.md](../migration/fundacja-status.md). Decyzja zakresowa: [ADR-003](../decisions/ADR-003-content-model-and-mvp.md).

## Relacja do innych projektów

- **Aktywne:** Art Generacje. Czytelnia nie jest `project` (osobny tor `publication`).
- **Archiwum w CMS:** Teatr Codzienny (6 edycji + rezultaty spektakli), TO MI GRA, BOAL IN PRACTICE, Wielogłos (z leftover `projekty-zakonczone`, nie z lorem Figmy).

Czytelnia to osobny tor treści (`publication`), nie „edycja Art Generacje” i nie `project`.

## Migracja

Źródłem faktów o treściach jest Drupal (`drama_mfund` + wybiórczo `drama_teatr`), ale **kształt** Art Generacje w CMS wynika z tego dokumentu — nie z jednego `node_type`.

W datasetcie jest jeden `project` featured z edycjami I–XI (skrypt `pnpm migrate:art-generacje`, źródło: `page` art-generacje). Stara płaska strona Drupal zostaje jako `page`.
