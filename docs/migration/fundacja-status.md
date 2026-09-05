# Status migracji fundacji (Drupal → Sanity)

**Kanon faktów o tym, co już jest w CMS**, nie o UI.  
Stan sesji i „co robić jutro”: [HANDOFF.md](../HANDOFF.md).  
Inwentarz dumpów (ile nodów jakiego typu): [drupal-inventory.md](drupal-inventory.md).  
Model docelowy: [ADR-003](../decisions/ADR-003-content-model-and-mvp.md).

Ostatnia weryfikacja treści: **2026-09-05** (Czytelnia: extract + migrate; faza 2: Studio + usunięcie `metody-tzs`).

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
Sanity: 6× readingMethod + 81× publication (47 listed; śmieć metody-tzs usunięty)
```

Live CMS: projekt Sanity **Dramaway**, id `tr2qdg9j`, dataset `production`.  
Publiczne: `http://localhost:3000` (`pnpm dev`). Inwentarz CMS: `/preview`. Studio: `:3333`.

## Co leży w Sanity

| Typ | Ile | Skąd | Preview |
|-----|-----|------|---------|
| `person` | 7 | Drupal `czlonek_zespolu` | `/zespol` |
| `page` | 23 + 2 newsy + placeholder | Drupal `page` + opublikowane `aktualnosc` | `/fundacja/…`, `/metody`, `/kontakt`, korzeń |
| `project` | 4 | rozbicie stron Drupal, nie nowy dump | `/projekty` |
| `readingMethod` | 6 | seed z `scripts/czytelnia-curated.json` (nie enum, nie `/metody`) | Studio |
| `publication` | **81** (47 `listed`) | Drupal `article` status=1 minus śmieć `metody-tzs` | `/czytelnia`, `/czytelnia/[slug]` |
| assety | 76 obrazów fundacji + 144 Czytelnia (okładki + PDF) | FTP fundacji + `teatrzaangazowany…/files/` | Studio → Media |

Newsy są **nadal `page`**: tytuł `[Aktualność] …`, slug `aktualnosc-…`. Osobnego typu nie ma.

Biblioteka **Media** w Studio czyta te same `sanity.imageAsset` — bez re-uploadu i bez tagów (tagi/foldery są opcjonalne, od zera).

**Art Generacje** (`project-art-generacje`, featured, status `active`): intro + **13 edycji (I–XI)** + afterword (autorzy, partnerzy). Numeracja „Edycja VI” występuje trzykrotnie (2020, 2021, 2022) — tak jest na live, nie poprawiamy historii. Źródłowa `page` `art-generacje` zostaje.

Archiwum bez edycji: Teatr Codzienny, TO MI GRA, BOAL IN PRACTICE.

**Czytelnia** (2026-09-05): dump `private/dumps/drama_teatr_1787254349.sql.gz`. 82 opublikowane `article` → `publication`; śmieć `metody-tzs` (tytuł „aaa”) **usunięty** → **81** w datasetcie (47 `listed` + 34 URL-only). Tagi metod wyłącznie z `scripts/czytelnia-curated.json` (lista Word). Szuflady Drupala (Publikacje / Scenariusze / Książki / Multimedia) siedzą w ukrytym `legacyDrupal.format`, nie w IA. `publication` nigdy nie jest `project`; edycje AG nie są publikacjami. Persony portalu (89) nie są dokumentami `person` — tylko stringi `authors`. PDF-y z `field_dokument` (64/64 na dysku). Front artykułu ciągnie `authors`, `methods`, `file`. Hosted Studio: schemat wdrożony.

## Luki vs ramka Figmy (listingi)

Zasada (2026-09-05): **czego nie ma w CMS, tego nie ma na stronie.** Nie zmyślamy pozycji z rysunku. Braki trzymamy tu; dodać później ręcznie w Studio albo skryptem. Placeholdery wrzucone „żeby ramka się zgadzała” → **draft** z adnotacją po polsku (pole description / notatka na dokumencie), nie publikować.

| W ramce | W CMS (production, 2026-09-05) | Co z tym |
|---------|--------------------------------|----------|
| Art Generacje | `project` art-generacje, featured, 13 edycji | jest |
| Czytelnia na `/projekty` | nie jest `project` | prezentacja OK, dane = `publication` (81 dokumenty) |
| Projekt z Syrenką (aktywny) | **brak** `project` | nie listować. Jest placeholder newsa `news-placeholder-syrena` — do draftu z adnotacją |
| to mi gra, Teatr Codzienny, BOAL IN PRACTICE | 3× `project` archive | są |
| Wielogłos (archiwum) | **brak** `project` | nie listować, dopóki ktoś nie doda dokumentu |
| Publikacje w Czytelni | 81× `publication` (47 `listed` z Worda) | spis `/czytelnia` = `listed`; artykuł `/czytelnia/[slug]` = 81 (bez śmiecia `metody-tzs`) |
| `edition.outcomes` | schemat jest, rekordy puste | nie zgadywać z HTML |

Placeholder newsa Syrena (`[Aktualność] Nowy projekt z Teatrem Syrena`, slug `aktualnosc-nowy-projekt-z-teatrem-syrena`): wstawiony 2026-09-03 pod ramkę homepage. Nie jest treścią fundacji. Draft + adnotacja: *„Wypełniacz z makiety Figmy, nie treść z Drupala. Nie publikować, dopóki nie będzie prawdziwego newsa albo projektu.”*

## Mapa vs live (`fundacja.dramaway.pl`)

**1:1 (nody):** zespół (7), kontakt, metody, szkolenia i spektakle, projekty-karty, fundacja (statut, sprawozdania, zarząd, jak wesprzeć), aktualności z homepage.

**Świadomie nie jako dokumenty:** `/`, `/projekty`, `/zespol`, `/fundacja` — w Drupalu listingi taksonomii, nie nody. W Next są to widoki (nawigacja z IA, nie `siteSettings`).

**Nie przenosiliśmy:** 2 nieopublikowane newsy, 2 `simplenews`. Sitemap XML na live jest popsuty (tylko homepage) — weryfikacja była menu + listing projektów + HTTP na ścieżkach z dumpa.

## Luki konwersji HTML → Portable Text

To nie jest korekta językowa. Pierwszy skrypt spłaszczał Drupal HTML.

**Zrobione 2026-08-21 (obserwacje Jana):**

- Nawiasowe URL-e (`tekst (http://…)`, w tym duplikaty) → marki `link` w Sanity. Skrypt: `pnpm repair:portable-text`. Porównanie z live: np. [art-generacje](https://www.fundacja.dramaway.pl/projekty/art-generacje).
- Tokeny Drupal `[video:https://youtube…]` → bloki `youtube` (embed w `/preview`).
- Schemat `edition.outcomes` (`editionOutcome`: tytuł, podtytuł, data, zdjęcie, opis) — **pusty**, do ręcznego zasilenia / Figmy. Nie zgadujemy spektakli z HTML.

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
| `siteSettings` (nawigacja, footer) | Dokument jest; grupa `homepage` pusta → fallbacki. |
| Newsletter, formularz kontaktu, EN | Poza MVP treściowym. Formularz = osobne zamówienie. |

## Komendy

```bash
pnpm extract:fundacja
pnpm migrate:fundacja          # write token w apps/studio/.env
pnpm migrate:art-generacje    # rozbija page Art Generacje → project.editions
pnpm extract:czytelnia        # dump drama_teatr → gitignored JSON
pnpm migrate:czytelnia        # 6× readingMethod + 82× publication (dataset 81 po usunięciu śmiecia); nie rusza person/page/project
pnpm repair:portable-text     # dry-run; `pnpm repair:portable-text -- --write` zapisuje
pnpm dev                      # :3000
pnpm dev:studio               # :3333
pnpm dev:all
```

Write token **tylko** `apps/studio/.env` → `SANITY_API_WRITE_TOKEN`. Nigdy `NEXT_PUBLIC_*` ani `apps/web/.env.local`. Dataset jest publiczny — Next czyta bez tokenu.

## Następne kroki

1. Figma na istniejących URL-ach; uściślić `edition.outcomes`.
2. Mapa 301 przed premierą (osobne zadanie — nie w `lib/routes.ts`).
3. Porównać `/projekty/art-generacje` z live; kotwice w Studio.
4. `pnpm repair:portable-text` nie obejmuje `publication`. Ponowny `migrate:czytelnia` odtworzyłby śmieć `metody-tzs`.

Szczegóły produktu Art Generacje (nie stan migracji): [art-generacje.md](../concept/art-generacje.md).
