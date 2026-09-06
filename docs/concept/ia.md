# Informacyjna architektura — fundacja.dramaway.pl (MVP)

Źródło: mapa serwisu z kickoffu projektu. Daty sprintu lipcowego są **historyczne** — ten dokument opisuje docelową IA, nie harmonogram.  
Ustalenia 2026-09-05 (hub Bazy, Czytelnia ≠ `project`, URL edycji, listing = CMS): [ustalenia-2026-09-05.md](ustalenia-2026-09-05.md).

## Nawigacja główna

- **Strona główna** `/`
- **Projekty** `/projekty`
  - **Art Generacje** — flagowy (`/projekty/art-generacje`). Każda edycja ma **własny URL** `/projekty/art-generacje/[slug]` (ustalenie 2026-09-05: treść + SEO). W CMS edycja zostaje obiektem na `project`, nie osobnym dokumentem. Szczegóły: [art-generacje.md](art-generacje.md)
  - Teatr Codzienny — zakończony
  - TO MI GRA — zakończony
  - BOAL IN PRACTICE — zakończony (Erasmus+)
  - Projekty zakończone — zbiorczo
  - Wydawnictwo `/projekty/wydawnictwo`
  - Czytelnia **może** pojawić się na tej stronie jako pozycja listy (warstwa prezentacji). W danych **nie jest** `project` — zostaje `publication`.
- **Baza wiedzy** — nadzbiór w nawigacji (ustalenie 2026-09-05, makiety)
  - Hub (prosta strona wprowadzająca w dwa kanały): **`/baza-wiedzy`**. Etykieta nav „Baza wiedzy” prowadzi na hub, nie na `/czytelnia`.
  - **Metody** `/metody` — drugi poziom menu (TZS, TiE, Teatr Forum, Teatr ze Społecznością)
  - **Czytelnia** `/czytelnia` — drugi poziom menu; treść m.in. ze starego portalu (`drama_teatr`), typ Sanity `publication`
  - Hub da się wyłączyć (zostają same podpozycje), jeśli klientowi nie podejdzie.
- **O fundacji** `/fundacja`
  - Historia / timeline od 2011
  - Zarząd i fundatorzy
  - Statut (PDF)
  - Sprawozdania
  - Jak nas wesprzeć
- **Zespół** `/zespol` — osoby z bio i kontaktem (adres zostaje; nie jest pozycją pierwszego poziomu menu z Figmy)
- **Szkolenia i spektakle** → odsyła do `centrum.dramaway.pl` (poza MVP migracji)
- **Kontakt** `/kontakt` — treść z CMS, bez formularza (MVP). Formularz = osobne zamówienie później.

Publiczne trasy w Next (`apps/web/src/lib/routes.ts`) składają ten szkielet: prefiks z tej IA + `slug.current` z Sanity (ostatni segment aliasu Drupal). Listingi `/`, `/projekty`, `/zespol` nie mają dokumentu CMS — to widoki. `/fundacja` to widok Next z singletonem `aboutPage` (kolejność sekcji w kodzie; treść i listy w Studio). Mapa 301 na premierę (stare `node/N`, osobne landingi edycji, aliasy newsów) jest osobnym zadaniem.

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
