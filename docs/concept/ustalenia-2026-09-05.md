# Ustalenia 2026-09-05 — IA, podstrony, most do Czytelni

**Status:** USTALONE (Jan). Nie są to propozycje.  
**Po co ten plik:** nowa sesja i sesja migracji Czytelni mają wziąć **to**, a nie odtwarzać chat.  
**Sesja źródłowa:** makiety podstron + decyzje przy `docs/design/wireframes.html`.  
**Sesja obok:** chat Cursor „Knowledge base data migration” — plan „Migracja Czytelni” (prawie gotowy **przed** tymi ustaleniami).

Kanony, które ten plik uzupełnia, nie zastępuje: [ia.md](ia.md), [art-generacje.md](art-generacje.md), [system.md](../design/system.md), [ADR-003](../decisions/ADR-003-content-model-and-mvp.md), [ADR-004](../decisions/ADR-004-layout-architecture.md), [fundacja-status.md](../migration/fundacja-status.md).

## Delta 2026-09-29 — Baza wiedzy jest stroną

`/metody` nie jest już osobnym adresem. Opis metod (dawny `page` o slugu `metody`) jest treścią **`/baza-wiedzy`**: zwykły dokument `page` (hero, sekcje, body — ten sam skład co inne strony). W menu **Baza wiedzy** ma jedno dziecko: **Czytelnia** `/czytelnia`. `/metody` przekierowuje na `/baza-wiedzy`. Singleton `landing-baza-wiedzy` nie składa tej strony. Zdania niżej o hubie i drugim poziomie „Metody” są historyczne (stan z 2026-09-05). Aktualna mapa: [ia.md](ia.md).

## Delta 2026-09-06 — dwie osie Czytelni

Szuflady Drupala (`field_kategoria_czytelnii`: Publikacje / Scenariusze / Książki / Multimedia) znowu są osią **rodzaju** — publiczne `publication.format`. Tagi z listy Word zostają **kategoriami** (typ `_type: "readingMethod"` bez zmiany nazwy w datasecie; w Studio: Category; pole publikacji: Categories). Zdanie niżej, że kategorie idą „wokół metod, nie szuflad Drupala”, jest historyczne: tak zrobiono import. UI i model publiczny mają **obie** osie. **Nie** odpalamy `migrate:czytelnia`.

---

## Jednym zdaniem

**Baza wiedzy** to nadzbiór w menu (hub + Metody + Czytelnia). **Czytelnia** to publikacje, nie projekt. Podstrony składamy ze wspólnych przepisów (w tym jeden wiersz listy), edycje AG mają własne URL-e, listing = CMS, telefon bez ramek Figmy, kontakt bez formularza.

---

## Co się zmieniło względem planu Czytelni sprzed tej sesji

Tamten plan wychodził z założenia, które **przestało być prawdziwe:**

> „Baza wiedzy” w nawigacji **to** Czytelnia (`/czytelnia`).

Teraz:

| Było (plan Czytelni / stary HANDOFF) | Jest (to ustalenie) |
|---|---|
| Etykieta nav „Baza wiedzy” = strona `/czytelnia` | „Baza wiedzy” = **rodzic**. Dzieci: **Metody** `/metody`, **Czytelnia** `/czytelnia`. Hub (kandydat `/baza-wiedzy`) wprowadza w dwa kanały; da się go wyłączyć |
| Ramka Figmy „baza wiedzy” = jedna strona (metody + publikacje + ogon edycji AG) | Metody **nie** wchodzą do listingu Czytelni. Edycje AG **nie** są publikacjami. Hub jest cienki |
| Czytelnia może wyglądać jak projekt na `/projekty` | W **danych** zawsze `publication`, nigdy `project`. Na `/projekty` wolno pokazać pozycję **prezentacyjnie** |
| Dump `drama_teatr` „trzeba dołożyć” | Plik **jest**: `private/dumps/drama_teatr_1787254349.sql.gz`. Do Sanity nadal 0× `publication` |
| UI Czytelni = zgadywanie z ramki | Listing Czytelni = ta sama sekcja **wiersza z plamą** co `/projekty` i lista edycji AG. Pusta lista jest stanem prawdziwym, dopóki nie ma dokumentów |

**Czego plan Czytelni nie musi zmieniać** (nadal obowiązuje, o ile sesja obok tak ustaliła): dump jako źródło; typ `publication`; kuracja, nie 425 nodów hurtem; import 82 opublikowanych artykułów; na `/czytelnia` na razie spis z listy klienta (~47 z Worda); reszta pod URL-em, ale nie w spisie; kategorie **od nowa wokół metod**, nie szuflad Drupala.

**Czego plan Czytelni musi dodać / poprawić:**

1. Nav i URL huba — nie trzymać tożsamości „Baza wiedzy = `/czytelnia`”.
2. Nie importować i nie tagować edycji Art Generacje jako publikacji (w ramce Figmy tytuły edycji wyleciały na canvas „bazy wiedzy” — to śmieć rysunku).
3. Listing `/czytelnia` ma przeżyć **0** publikacji (hub i menu mogą powstać wcześniej niż import).
4. Kategoryzacja „według metod” łączy się z osobną stroną `/metody`: tag na publikacji, nie drugi spis metod wewnątrz Czytelni.
5. UI listingu = wiersz z plamą (tablica `{tytuł, opis, href}`), nie nowy gatunek karty i nie skład 1:1 z ramki 79:50.
6. Migracja treści **nie czeka** na gotowy hub ani na `/projekty`. Może iść równolegle. Skład UI Bazy wiedzy jest **krokiem 4** kolejki podstron (po cegłach, `/projekty`, AG + edycje).

---

## Decyzje (zamknięte)

1. **Baza wiedzy = nadzbiór.** Hub + drugi poziom: Metody, Czytelnia. Hub prosty, wyłączalny.
2. **Czytelnia ≠ `project`.** Prezentacja na `/projekty` dozwolona; model nie.
3. **Jedna sekcja wiersza z plamą** (kółko + tytuł + lead + CTA) na `/projekty`, liście edycji AG, Czytelni.
4. **Edycja AG:** `/projekty/art-generacje/[slug]`. W CMS nadal obiekt na `project`. Trzy „Edycja VI” → różne slugi.
5. **Listing = CMS.** Braki vs Figma: [fundacja-status.md](../migration/fundacja-status.md) „Luki vs ramka”. Placeholdery (Syrena) → draft z adnotacją PL. Nie zmyślać Wielogłosu / projektu Syrena.
6. **Kontakt bez formularza.** Formularz = osobne zamówienie później ([ADR-003](../decisions/ADR-003-content-model-and-mvp.md)).
7. **Nie będzie rysunku telefonu.** Podstrony: te same reguły co `/` — czytelność, mniejsze kadry, bez overflow ([system.md](../design/system.md), [ADR-004](../decisions/ADR-004-layout-architecture.md)).
8. **Kolejność UI:** (1) cegły: hero podstrony + wiersz z plamą → (2) `/projekty` → (3) AG + trasa edycji → (4) Baza: hub, menu 2. poziomu, `/metody`, `/czytelnia` → (5) `/fundacja` → (6) `/kontakt`. Nie czekać na dump, żeby zacząć (1)–(3). Nie zaczynać od Kontaktu.

Makieta (szara, do rozmowy): [design/wireframes.html](../design/wireframes.html). Figmy w sesji ustaleń nie wołać bez potrzeby (limity). FileKey z linku Jana: `Tf7i787tVTBTE4j7LFXXUX` (w baseline jest starszy klucz, te same ID ramek).

---

## Kolejka UI vs migracja treści

```
równolegle OK:
  extract/migrate publication          skład: cegły → /projekty → AG+edycje
                    \                        ↓
                     \                 Baza: hub + nav L2 + /czytelnia (pusta albo z importu)
                      \                      ↓
                       \               /fundacja → /kontakt
```

Import 82 artykułów **nie jest** blokowany brakiem huba. Hub **nie jest** blokowany brakiem 82 artykułów (pusta Czytelnia jest OK).

---

## Otwarte (nie blokują planu Czytelni)

- Dokładny URL huba (`/baza-wiedzy` vs inny).
- Czy i kiedy Czytelnia stoi na `/projekty` jako wiersz (dane nadal `publication`).
- CTA na home „poznajmy się” przy bloku Czytelni — kopia CTA „Kim jesteśmy”; do designerki.
- Drugi poziom menu: Figmy nie ma; na mobile wejdzie w istniejącą nakładkę.
- Draft `news-placeholder-syrena` w Studio — jeszcze nie wykonany.
- Slugi trzech „Edycja VI”.

---

## Prompt — wklej w sesję Migracja Czytelni

```
Zaktualizuj plan „Migracja Czytelni” o ustalenia z 2026-09-05. Źródło: docs/concept/ustalenia-2026-09-05.md (czytaj też docs/concept/ia.md). Nie odtwarzaj sesji makiet.

Kluczowa zmiana IA: „Baza wiedzy” w nav NIE jest tożsama z /czytelnia. To rodzic: hub (wyłączalny, kandydat /baza-wiedzy) + drugi poziom Metody (/metody) i Czytelnia (/czytelnia). Czytelnia w CMS to tylko publication, nigdy project. Metody nie wchodzą do listingu Czytelni. Edycje Art Generacje nie są publikacjami (śmieć z ramki Figmy).

Wasz zakres treści zostaje, o ile nie hałasuje z powyższym: dump private/dumps/drama_teatr_1787254349.sql.gz; 82 artykuły do Sanity; na /czytelnia na razie spis z listy klienta (~47); kategorie wokół metod, nie szuflad Drupala; kuracja, nie 425 nodów.

UI listingu = jedna sekcja „wiersz z plamą” (tablica). Puste 0 publikacji jest legalne. Migracja treści może iść równolegle do składu podstron; hub Bazy jest krokiem 4 kolejki UI, nie bramką importu.

Popraw plan w miejscach, gdzie nadal pisze „Baza wiedzy = /czytelnia”. Wypisz deltę (co się zmienia w zadaniach). Nie implementuj UI podstron w tej sesji, chyba że to schema publication / skrypty extract-migrate.
```

---

## Prompt — nowa sesja, tryb Plan (skład podstron)

```
Nowa sesja. Nie kontynuuj chatu makiet (kontekst zużyty). Tryb Plan.

Cel: plan składu podstron fundacji według docs/concept/ustalenia-2026-09-05.md + docs/concept/ia.md + docs/design/system.md + docs/design/wireframes.html. Nie wołaj Figmy, dopóki nie trzeba jednego zrzutu konkretnej ramki (limity MCP).

Kolejność budowy już ustalona: (1) hero podstrony + sekcja wiersza z plamą (2) /projekty (3) AG + /projekty/art-generacje/[slug] (4) hub Bazy + nav 2. poziomu + /metody + /czytelnia (5) /fundacja (6) /kontakt bez formularza. Listing = to, co jest w CMS. Mobile = kanon z homepage, ramek telefonu nie będzie.

Migracja publication jest w osobnej sesji; ten plan zakłada, że /czytelnia może być pusta. Nie planuj formularza kontaktu.

Wyjście: plan implementacji z plikami i kolejnością PR-ów, bez zaczynania kodu, dopóki nie potwierdzę.
```
