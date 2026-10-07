# Informacyjna architektura — fundacja.dramaway.pl (MVP)

Źródło: mapa serwisu z kickoffu projektu. Daty sprintu lipcowego są **historyczne** — ten dokument opisuje docelową IA, nie harmonogram.  
Ustalenia 2026-09-05 (hub Bazy, Czytelnia ≠ `project`, URL edycji, listing = CMS): [ustalenia-2026-09-05.md](ustalenia-2026-09-05.md).

## Nawigacja główna

- **Strona główna** `/`
- **Projekty** `/projekty`
  - **Art Generacje** — flagowy (`/projekty/art-generacje`). Każda edycja ma **własny URL** `/projekty/art-generacje/[slug]` (ustalenie 2026-09-05: treść + SEO). W CMS edycja zostaje obiektem na `project`, nie osobnym dokumentem. Szczegóły: [art-generacje.md](art-generacje.md)
  - Teatr Codzienny — zakończony (6 edycji 2012–2017, spektakle jako `edition.outcomes`)
  - TO MI GRA — zakończony
  - BOAL IN PRACTICE — zakończony (Erasmus+)
  - Wielogłos — zakończony (z leftover strony `projekty-zakonczone`, nie z lorem Figmy)
  - Projekty zakończone — zbiorczo na `/projekty` (wiersz archiwum); leftover `page` `/projekty/projekty-zakonczone` zostaje
  - Wydawnictwo `/wydawnictwo` (od 2026-09-29; `/projekty/wydawnictwo` przekierowuje tutaj)
  - Czytelnia **może** pojawić się na tej stronie jako pozycja listy (warstwa prezentacji). W danych **nie jest** `project` — zostaje `publication`.
- **Baza wiedzy** `/baza-wiedzy` — zwykły dokument `page` (ustalenie 2026-09-29). Treść to opis metod (TZS, TiE, Teatr Forum, Teatr ze Społecznością), wcześniej osobna strona `/metody`. Ten adres przekierowuje tutaj. Hero, sekcje i body edytuje się jak na każdej innej stronie.
  - **Czytelnia** `/czytelnia` — jedyne dziecko w menu. Treść m.in. ze starego portalu (`drama_teatr`), typ Sanity `publication`. Listing zostaje widokiem Next; chrome hero siedzi na singletonie `landingPage`.
- **O fundacji** `/fundacja`
  - Historia / timeline od 2011
  - Zarząd i fundatorzy
  - Statut (PDF)
  - Sprawozdania
  - Jak nas wesprzeć
- **Zespół** `/zespol` — osoby z bio i kontaktem (adres zostaje; nie jest pozycją pierwszego poziomu menu z Figmy)
- **Szkolenia i spektakle** → odsyła do `centrum.dramaway.pl` (poza MVP migracji)
- **Kontakt** `/kontakt` — treść z CMS, bez formularza (MVP). Formularz = osobne zamówienie później.

Widoczne menu główne bierze się z `siteSettings.navigation` (etykieta, strona z CMS albo adres, jeden poziom podpozycji). Pusta lista zostawia menu wbudowane w `mainNav()`. Publiczne trasy w Next (`apps/web/src/lib/routes.ts`) składają szkielet adresów: prefiks z tej IA + `slug.current` z Sanity (ostatni segment aliasu Drupal). Listingi `/`, `/projekty`, `/zespol` nie są dokumentami `page` — to widoki Next. Chrome hero (`/projekty`, `/czytelnia`, `/zespol`) siedzi na singletonach `landingPage` (Studio: te same pozycje co **O fundacji** na górze Content, gdy menu jest puste). Na `/projekty` ten sam dokument ma listę sekcji nad archiwum; pusta lista zostawia automatyczny wiersz aktywnych. `/baza-wiedzy` jest dokumentem `page`, nie landingiem. `/` bierze hero z `siteSettings`. `/fundacja` to widok Next z singletonem `aboutPage` (kolejność sekcji w kodzie; treść i listy w Studio). `/kontakt` zostaje dokumentem `page` z własnym widokiem (maile osób). `/metody` to stałe przekierowanie na `/baza-wiedzy`. Mapa 301 na premierę (stare `node/N`, osobne landingi edycji, aliasy newsów) jest osobnym zadaniem.

## Ekosystem domen (kontekst)

| Domena | W MVP |
|--------|--------|
| fundacja.dramaway.pl | **Budujemy** |
| centrum.dramaway.pl | Link zewnętrzny |
| teatrzaangazowany / stary portal wiedzy | Źródło treści do Czytelni, nie osobna aplikacja |

## Braki starej strony (do dowiezienia albo świadomego odłożenia)

Kickoff wskazał m.in.:

- aktualności / newsfeed
- formularz wsparcia
- media społecznościowe w nawigacji
- wersja angielska (są projekty Erasmus+)

To nie jest lista „skopiuj z Drupala” — to lista produktowa. Decyzje launch vs później: [ADR-003](../decisions/ADR-003-content-model-and-mvp.md).
