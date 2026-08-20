# Status migracji fundacji (Drupal → Sanity)

**Kanon faktów o tym, co już jest w CMS**, nie o UI.  
Stan sesji i „co robić jutro”: [HANDOFF.md](../HANDOFF.md).  
Inwentarz dumpów (ile nodów jakiego typu): [drupal-inventory.md](drupal-inventory.md).  
Model docelowy: [ADR-003](../decisions/ADR-003-content-model-and-mvp.md).

Ostatnia weryfikacja treści: **2026-08-21**.

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
Next /preview  (nie JSON z dysku)
```

Live CMS: projekt Sanity **Dramaway**, id `tr2qdg9j`, dataset `production`.  
Podgląd: `http://localhost:3000/preview` (`pnpm dev`). Studio: `:3333`.

## Co leży w Sanity

| Typ | Ile | Skąd | Preview |
|-----|-----|------|---------|
| `person` | 7 | Drupal `czlonek_zespolu` | `/preview/zespol` |
| `page` | 23 + 2 newsy | Drupal `page` + opublikowane `aktualnosc` | `/preview/strony` |
| `project` | 4 | rozbicie stron Drupal, nie nowy dump | `/preview/projekty` |
| assety | ~74 | pliki z FTP mirror + tokeny Media `[[{fid…}]]` | w body / zdjęciach osób |

Newsy są **nadal `page`**: tytuł `[Aktualność] …`, slug `aktualnosc-…`. Osobnego typu nie ma.

**Art Generacje** (`project-art-generacje`, featured, status `active`): intro + **13 edycji (I–XI)** + afterword (autorzy, partnerzy). Numeracja „Edycja VI” występuje trzykrotnie (2020, 2021, 2022) — tak jest na live, nie poprawiamy historii. Źródłowa `page` `art-generacje` zostaje.

Archiwum bez edycji: Teatr Codzienny, TO MI GRA, BOAL IN PRACTICE.

## Mapa vs live (`fundacja.dramaway.pl`)

**1:1 (nody):** zespół (7), kontakt, metody, szkolenia i spektakle, projekty-karty, fundacja (statut, sprawozdania, zarząd, jak wesprzeć), aktualności z homepage.

**Świadomie nie jako dokumenty:** `/`, `/projekty`, `/zespol`, `/fundacja` — w Drupalu listingi taksonomii, nie nody. Na `/preview` jest płaska lista dokumentów, nie menu Drupal.

**Nie przenosiliśmy:** 2 nieopublikowane newsy, 2 `simplenews`. Sitemap XML na live jest popsuty (tylko homepage) — weryfikacja była menu + listing projektów + HTTP na ścieżkach z dumpa.

## Luki konwersji HTML → Portable Text

To nie jest korekta językowa. Skrypt spłaszcza Drupal HTML:

- Linki są tekstem z URL w nawiasie, nie klikalnym markiem.
- Tabele → jeden akapit.
- Brak pliku w dumpie → dziura zamiast obrazka.
- Sporadyczne leftover `[[SANITY_IMAGE_n]]` (np. sponsorzy na Art Generacje).
- `person.role` (Drupal `field_funkcja`) nie jest zmapowane — na live widać funkcje zarządu, w Sanity bio bez roli.

Studio: `blockContent` dopuszcza `image` w body. Nie klikać „Remove the block” przy starym błędzie walidacji.

## Czego nie ma (i dlaczego)

| Brak | Powód |
|------|--------|
| Czytelnia / `publication` | W `private/dumps/` jest tylko `drama_mfund_*`. Dump `drama_teatr` trzeba dołożyć; nie importować 425 nodów w ciemno. |
| UI z Figmy | Świadomy stop — najpierw treść w Sanity. |
| `siteSettings` (nawigacja, footer) | Nie zasilone. |
| GitHub remote, Netlify | Później. |
| Newsletter, formularze, EN | Poza MVP treściowym. |

## Komendy

```bash
pnpm extract:fundacja
pnpm migrate:fundacja          # write token w apps/studio/.env
pnpm migrate:art-generacje    # rozbija page Art Generacje → project.editions
pnpm dev                      # :3000
pnpm dev:studio               # :3333
pnpm dev:all
```

Write token **tylko** `apps/studio/.env` → `SANITY_API_WRITE_TOKEN`. Nigdy `NEXT_PUBLIC_*` ani `apps/web/.env.local`. Dataset jest publiczny — Next czyta bez tokenu.

## Następne kroki (merytorycznie, przed Figmą)

1. Rzucić okiem na `/preview/projekty/art-generacje` i dokument Project w Studio.
2. Czytelnia — gdy pojawi się dump `drama_teatr`; kuracja, nie hurt.
3. Opcjonalnie: klikalne linki w konwerterze, `person.role`, sprzątanie leftover tokenów.
4. **Figma** — tu start UI; treść fundacji + edycje AG są już w CMS.

Szczegóły produktu Art Generacje (nie stan migracji): [art-generacje.md](../concept/art-generacje.md).
