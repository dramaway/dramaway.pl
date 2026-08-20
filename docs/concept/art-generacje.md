# Art Generacje — serce serwisu

## Dlaczego to osobny dokument

W kickoffie Art Generacje to **flagowy projekt** fundacji: projekt międzypokoleniowy przez teatr, z bogatą dokumentacją. Ma być widoczny nie tylko jako jedna karta na `/projekty`, ale jako motyw obecny w wielu miejscach (hero, sekcje, tła — zależnie od Figmy).

Traktuj go jak **serce serwisu**, nie jak kolejny wpis z listy projektów zakończonych.

## Co musi umieć model treści

Nie wystarczy płaski `project` z tytułem i body. Potrzebujemy struktury pod:

- **wiele edycji** (w kickoffie: 9 edycji z opisami)
- **galerie** per edycja / projekt
- **partnerzy**
- wyróżnienie na homepage i liście projektów (`featured`)

Szczegóły pól ustalimy przy schemacie Sanity; decyzja zakresowa: [ADR-003](../decisions/ADR-003-content-model-and-mvp.md).

## Relacja do innych projektów

- **Aktywne (orientacyjnie z kickoffu):** Art Generacje, Czytelnia / baza wiedzy  
- **Archiwum:** m.in. Teatr Codzienny, TO MI GRA, BOAL IN PRACTICE, Wielogłos i inne — zostają w serwisie jako archiwum, nie znikają

Czytelnia to osobny tor treści (`publication`), nie „edycja Art Generacje”.

## Migracja

Źródłem faktów o treściach jest Drupal (`drama_mfund` + wybiórczo `drama_teatr`), ale **kształt** Art Generacje w CMS wynika z tego dokumentu i Figmy — nie z jednego `node_type`.
