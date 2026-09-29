# Status migracji fundacji (Drupal → Sanity)

**Kanon faktów o tym, co już jest w CMS**, nie o UI.  
Stan sesji i „co robić jutro”: [HANDOFF.md](../HANDOFF.md).  
Inwentarz dumpów (ile nodów jakiego typu): [drupal-inventory.md](drupal-inventory.md).  
Model docelowy: [ADR-003](../decisions/ADR-003-content-model-and-mvp.md).

Ostatnia weryfikacja treści: **2026-09-06** (encje w `summary`/`excerpt` + lead hero z ramki; Czytelnia bez dosłownego `&nbsp;`).

## Pipeline

```
private/dumps/drama_mfund_*.sql
        ↓  pnpm extract:fundacja
apps/web/src/data/extracted/fundacja.json   (gitignored)
        ↓  pnpm migrate:fundacja
Sanity dataset production (person, page + assety)
        ↓  pnpm migrate:art-generacje
Sanity project + editions (Art Generacje, archiwum)
        ↓  GROQ
Next — trasy publiczne z IA (`/projekty/…`, `/zespol/…`, `/fundacja/…`)

private/dumps/drama_teatr_1787254349.sql.gz  — **jest** lokalnie
        ↓  pnpm extract:czytelnia
apps/web/src/data/extracted/czytelnia.json   (gitignored)
        ↓  pnpm migrate:czytelnia
Sanity: 6× readingMethod + 81× publication (wszystkie `listed`; śmieć metody-tzs usunięty)
```

Live CMS: projekt Sanity **Dramaway**, id `tr2qdg9j`, dataset `production`.  
Publiczne: `http://localhost:3000` (`pnpm dev`). Studio: `:3333`.

## Co leży w Sanity

| Typ | Ile | Skąd | Preview |
|-----|-----|------|---------|
| `person` | 7 | Drupal `czlonek_zespolu` | `/zespol` |
| `aboutPage` | 1 singleton | ręcznie / `pnpm seed:about-page` | `/fundacja` |
| `landingPage` | 3 singletony | `pnpm seed:landing-pages` (puste pola) | `/projekty`, `/czytelnia`, `/zespol` |
| `page` | 23 + 2 newsy + placeholder | Drupal `page` + opublikowane `aktualnosc` | `/fundacja/…`, `/baza-wiedzy`, `/kontakt`, korzeń |
| `project` | **5** | rozbicie stron Drupal + Wielogłos z leftover `projekty-zakonczone` | `/projekty` |
| `readingMethod` | 6 | seed z `scripts/czytelnia-curated.json` (nie enum, nie esej na `/baza-wiedzy`) | Studio |
| `publication` | **81** (`listed`) | Drupal `article` status=1 minus śmieć `metody-tzs` | `/czytelnia`, `/czytelnia/[slug]` |
| assety | 76 obrazów fundacji + 144 Czytelnia (okładki + PDF) | FTP fundacji + `teatrzaangazowany…/files/` | Studio → Media |

Newsy są **nadal `page`**: tytuł `[Aktualność] …`, slug `aktualnosc-…`. Osobnego typu nie ma.

Biblioteka **Media** w Studio czyta te same `sanity.imageAsset` — bez re-uploadu i bez tagów (tagi/foldery są opcjonalne, od zera).

**Art Generacje** (`project-art-generacje`, featured, status `active`): intro + **13 edycji (I–XI)** + afterword (autorzy, partnerzy). Numeracja „Edycja VI” występuje trzykrotnie (2020, 2021, 2022) — tak jest na live, nie poprawiamy historii. Źródłowa `page` `art-generacje` zostaje.

**Archiwum (2026-09-07, `pnpm patch:archive-projects`):** Teatr Codzienny ma **6 edycji** (`/projekty/teatr-codzienny/edycja-2012` … `2017`) i **20** `edition.outcomes` (spektakle Teatru Forum i Teatru ze Społecznością, z nazw, lat premiery i opisów — nie zgadywane). TO MI GRA i BOAL IN PRACTICE **bez** fałszywych edycji: afterword FoldList (zespół / podziękowania / sponsorzy) oraz dwujęzyczne **Columns**. Wielogłos to `project-wieloglos` ze strony leftover `projekty-zakonczone` (treść Drupal, nie lorem z Figmy). Źródłowe `page` zostają. Ponowny `migrate:art-generacje` **nie** spłaszcza archiwum, jeśli ma już edycje albo afterword.

**Czytelnia** (2026-09-05, osie przywrócone 2026-09-06, listing 2026-09-06): dump `private/dumps/drama_teatr_1787254349.sql.gz`. 82 opublikowane `article` → `publication`; śmieć `metody-tzs` (tytuł „aaa”) **usunięty** → **81** w datasetcie, wszystkie `listed` (`pnpm patch:publication-listed`). Tagi z `scripts/czytelnia-curated.json` (lista Word) zostają **kategoriami** (`readingMethod` / pole `methods`; w Studio: Category / Categories) — to nie esej metod na `/baza-wiedzy`. Szuflady Drupala (Publikacje / Scenariusze / Książki / Multimedia) znowu są publicznym **rodzajem** `publication.format` (`articles` \| `books` \| `scripts` \| `multimedia`); `legacyDrupal.format` zostaje ukrytym śladem dumpa. Patch: `pnpm patch:publication-format`, **nie** `migrate:czytelnia`. `publication` nigdy nie jest `project`; edycje AG nie są publikacjami. Persony portalu (89) nie są dokumentami `person` — tylko stringi `authors`. PDF-y z `field_dokument` (64/64 na dysku). Front artykułu ciągnie `authors`, `methods`, `file`. Hosted Studio: po zmianie schematu `pnpm --filter studio run deploy`.

## Luki vs ramka Figmy (listingi)

Zasada (2026-09-05): **czego nie ma w CMS, tego nie ma na stronie.** Nie zmyślamy pozycji z rysunku. Braki trzymamy tu; dodać później ręcznie w Studio albo skryptem. Placeholdery wrzucone „żeby ramka się zgadzała” → **draft** z adnotacją po polsku (pole description / notatka na dokumencie), nie publikować.

| W ramce | W CMS (production, 2026-09-05) | Co z tym |
|---------|--------------------------------|----------|
| Art Generacje | `project` art-generacje, featured, 13 edycji | jest |
| Czytelnia na `/projekty` | nie jest `project` | prezentacja OK, dane = `publication` (81 dokumenty) |
| Projekt z Syrenką (aktywny) | **brak** `project` | nie listować. Jest placeholder newsa `news-placeholder-syrena` — do draftu z adnotacją |
| to mi gra, Teatr Codzienny, BOAL IN PRACTICE, Wielogłos | 4× `project` archive | są (TC: 6 edycji + 20 rezultatów) |
| Wielogłos (archiwum) | `project-wieloglos` ze strony `projekty-zakonczone` | jest; leftover `page` pod starym URL-em zostaje |
| Publikacje w Czytelni | 81× `publication` (47 `listed` z Worda) | spis `/czytelnia` = `listed`; artykuł `/czytelnia/[slug]` = 81 (bez śmiecia `metody-tzs`) |
| `edition.outcomes` | AG prawie puste; **Teatr Codzienny 20** z nazwanych spektakli | AG nadal nie zgadywać z HTML |

Placeholder newsa Syrena (`[Aktualność] Nowy projekt z Teatrem Syrena`, slug `aktualnosc-nowy-projekt-z-teatrem-syrena`): wstawiony 2026-09-03 pod ramkę homepage. Nie jest treścią fundacji. Draft + adnotacja: *„Wypełniacz z makiety Figmy, nie treść z Drupala. Nie publikować, dopóki nie będzie prawdziwego newsa albo projektu.”*

## Mapa vs live (`fundacja.dramaway.pl`)

**1:1 (nody):** zespół (7), kontakt, metody, szkolenia i spektakle, projekty-karty, fundacja (statut, sprawozdania, zarząd, jak wesprzeć), aktualności z homepage.

**Świadomie nie jako dokumenty `page`:** `/`, `/projekty`, `/zespol` — w Drupalu listingi taksonomii, nie nody. W Next są to widoki. `/projekty`, `/czytelnia`, `/zespol` mają singletony `landingPage` tylko pod chrome (hero); puste pole = brak hero. `/fundacja` jest widokiem z singletonem `aboutPage` (Studio: **O fundacji**). `/baza-wiedzy` (od 2026-09-29, wcześniej osobno `/metody`) i `/kontakt` zostają `page`. `/metody` przekierowuje na `/baza-wiedzy`. `/kontakt` ma własny widok (maile osób).

**Nie przenosiliśmy:** 2 nieopublikowane newsy, 2 `simplenews`. Sitemap XML na live jest popsuty (tylko homepage) — weryfikacja była menu + listing projektów + HTTP na ścieżkach z dumpa.

## Luki konwersji HTML → Portable Text

To nie jest korekta językowa. Pierwszy skrypt spłaszczał Drupal HTML.

**Zrobione 2026-08-21 (obserwacje Jana):**

- Nawiasowe URL-e (`tekst (http://…)`, w tym duplikaty) → marki `link` w Sanity. Skrypt: `pnpm repair:portable-text`. Porównanie z live: np. [art-generacje](https://www.fundacja.dramaway.pl/projekty/art-generacje).
- Tokeny Drupal `[video:https://youtube…]` → bloki `youtube` (embed na stronie projektu).
- Schemat `edition.outcomes` (`editionOutcome`: tytuł, podtytuł, data, zdjęcie, opis) — **pusty**, do ręcznego zasilenia / Figmy. Nie zgadujemy spektakli z HTML.

**Zrobione 2026-09-06 (linki ślepe po spłaszczeniu `<a>`):**

- Względne ścieżki w nawiasach (`Nazwisko (/zespol/…)`, `2018 rok (/sites/fundacja/files/….pdf)`) → marka `link` na kotwicy, ścieżka znika z tekstu. PDF-y idą na stary origin `fundacja.dramaway.pl` (plików nie ma jeszcze w Sanity).
- `(mailto:…)` i gołe e-maile / `http(s)` / `www.` bez marki → klikalne. Adresy `fundacja.dramaway.pl/…` (poza `/sites/…/files`) → ścieżka wewnętrzna.
- `publication` wchodzi w `pnpm repair:portable-text` (wcześniej tylko page/person/project).
- Ucięte URL-e z `...` (bilety Evently w newsie „W kolejce do lasu”) **nie** zgadujemy — zostają tekstem; `repair:portable-text` wypisuje je w raporcie.

**Zrobione 2026-09-06 (encje po Drupalu, bez LLM):**

- Dosłowne `&nbsp;` / `&amp;nbsp;` / ucięte `&nbsp` w polach string (`summary`, `excerpt`, tytuły, zajawki edycji) → zwykła spacja. Listing `/czytelnia` nie pokazuje sześciu znaków `&nbsp;`.
- W Portable Text: dekodowanie encji, wycięcie znaków kontrolnych; pojedyncze U+00A0 zostaje (polski skład); serie nbsp się zwijają.
- `readingMethod` i `siteSettings` wchodzą w skan. `siteSettings.heroLead` wrócił do copy z ramki `59:608` (Drupalowy lead nie był Figmą).
- Ponowny `migrate:*` odtworzyłby encje — nie wołać.

**Nadal ręcznie / później:**

- Część kotwic będzie nieidealna (Drupal owijał tylko fragment zdania; albumy FB ucięte w środku słowa). Skrypt znajduje wszystkie URL-e; reszta to Studio.
- Tabele → jeden akapit.
- Brak pliku w dumpie → dziura zamiast obrazka.
- Sporadyczne leftover `[[SANITY_IMAGE_n]]` — **naprawione 2026-08-21** (kilka obrazków w jednym akapicie; assety już były w datasetcie).
- `person.role` (Drupal `field_funkcja`) nie jest zmapowane.

## Czego nie ma (i dlaczego)

| Brak | Powód |
|------|--------|
| 343 nody portalu poza `article` | Świadomie: wydarzenia, persony, projekty, organizacje, page. Persony tylko jako stringi `authors`. |
| 2 nieopublikowane `article` | Pominięte (`publikacja-teatr-forum`, duplikat Kostyry bez `-0`). |
| Edycje Art Generacje jako `publication` | Śmieć z ramki Figmy — skrypt ich nie tworzy. |
| UI z Figmy | Homepage złożony; podstrony: skład z 2026-09-05, nie pixel-perfect. |
| `siteSettings` (nawigacja, footer) | Menu: grupa Nawigacja (`navigation`). Pusta lista = menu wbudowane. `homepage` wypełniona 2026-09-07 |
| Newsletter, formularz kontaktu, EN | Poza MVP treściowym. Formularz = osobne zamówienie. |

## Komendy

```bash
pnpm extract:fundacja
pnpm migrate:fundacja          # write token w apps/studio/.env
pnpm migrate:art-generacje    # rozbija page Art Generacje → project.editions
pnpm extract:czytelnia        # dump drama_teatr → gitignored JSON
pnpm migrate:czytelnia        # 6× readingMethod + 82× publication (dataset 81 po usunięciu śmiecia); NIE wołać ponownie
pnpm patch:publication-format # jednorazowo: legacyDrupal.format → publication.format
pnpm patch:archive-projects   # zakończone projekty → edycje/outcomes/FoldList/Columns; `-- --dry-run`
pnpm test:archive-projects
pnpm repair:portable-text     # dry-run; `pnpm repair:portable-text -- --write` zapisuje
pnpm test:repair              # node:test na lib/portable-text-repair
pnpm seed:navigation       # pusta siteSettings.navigation → obecne menu; nie nadpisuje listy
pnpm dev                      # :3000
pnpm dev:studio               # :3333
pnpm dev:all
```

Write token **tylko** `apps/studio/.env` → `SANITY_API_WRITE_TOKEN`. Nigdy `NEXT_PUBLIC_*` ani `apps/web/.env.local`. Dataset jest publiczny — Next czyta bez tokenu.

## Następne kroki

1. Figma na istniejących URL-ach. `edition.outcomes` Art Generacje nadal puste (kredyty w `body`); Teatr Codzienny ma 20 rezultatów z nazwanych spektakli.
2. Mapa 301 przed premierą (osobne zadanie — nie w `lib/routes.ts`).
3. Porównać `/projekty/art-generacje` z live; kotwice w Studio.
4. `pnpm repair:portable-text` obejmuje `page` / `person` / `project` / `publication` / `readingMethod` / `siteSettings` (linki + encje). Ponowny `migrate:czytelnia` odtworzyłby śmieć `metody-tzs` i `&nbsp;` w `summary`.

Szczegóły produktu Art Generacje (nie stan migracji): [art-generacje.md](../concept/art-generacje.md).
