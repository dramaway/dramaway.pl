# Informacyjna architektura — fundacja.dramaway.pl (MVP)

Źródło: mapa serwisu z kickoffu projektu. Daty sprintu lipcowego są **historyczne** — ten dokument opisuje docelową IA, nie harmonogram.

## Nawigacja główna

- **Strona główna** `/`
- **Projekty** `/projekty`
  - **Art Generacje** — flagowy (`/projekty/art-generacje`) — edycje, galerie, partnerzy (szczegóły: [art-generacje.md](art-generacje.md))
  - **Czytelnia / baza wiedzy** — dział tej strony (treść może pochodzić m.in. ze starego portalu)
  - Teatr Codzienny — zakończony
  - TO MI GRA — zakończony
  - BOAL IN PRACTICE — zakończony (Erasmus+)
  - Projekty zakończone — zbiorczo
  - Wydawnictwo `/projekty/wydawnictwo`
- **O fundacji** `/fundacja`
  - Historia / timeline od 2011
  - Specjalizacje (TZS, TiE, Teatr Forum, Teatr ze Społecznością)
  - Zarząd i fundatorzy
  - Statut (PDF)
  - Sprawozdania
  - Jak nas wesprzeć
- **Metody** `/metody`
  - TZS — Teatr Zaangażowany Społecznie
  - TiE — Teatr w Edukacji
  - Teatr Forum
  - Teatr ze Społecznością
- **Zespół** `/zespol` — osoby z bio i kontaktem
- **Szkolenia i spektakle** → odsyła do `centrum.dramaway.pl` (poza MVP migracji)
- **Kontakt** `/kontakt`

Publiczne trasy w Next (`apps/web/src/lib/routes.ts`) składają ten szkielet: prefiks z tej IA + `slug.current` z Sanity (ostatni segment aliasu Drupal). Listingi `/`, `/projekty`, `/zespol`, `/fundacja` nie mają dokumentu CMS — to widoki. Mapa 301 na premierę (stare `node/N`, osobne landingi edycji, aliasy newsów) jest osobnym zadaniem.

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
