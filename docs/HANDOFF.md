# Handoff — DramaWay

**Aktualizuj ten plik na bieżąco** na końcu każdej sesji (albo po większym kamieniu milowym).  
Nowy czat: przeczytaj ten plik + `CLAUDE.md` + `docs/README.md` — nie odtwarzaj historii z pamięci.

| | |
|--|--|
| **Ostatnia aktualizacja** | 2026-08-20 (~23:00) |
| **Gałąź / HEAD** | `main` @ `eeb62f3` |
| **Remote** | brak (tylko lokalny git) |
| **Owner Sanity (na razie)** | Jan Mirecki — transfer ownership później OK |

---

## Co to jest

Redesign **fundacja.dramaway.pl** (Fundacja DramaWay).  
MVP = **jedna** witryna fundacji. Art Generacje = serce serwisu.  
Czytelnia / baza wiedzy = **dział** tej strony (źródło: stary portal / baza `drama_teatr`), nie drugi Next.js.  
`centrum.dramaway.pl` = link zewnętrzny.

Stack: Next.js 15, Tailwind v4, shadcn/ui, **Sanity Studio v6**, Netlify (nie Vercel).  
Język: kod/commity/CMS EN · docs `.md` PL.

---

## Stan na teraz (fakt)

### Działa lokalnie

- `pnpm dev` → http://localhost:3000 (placeholder + `/preview` z JSON z dumpa)
- `pnpm dev:studio` → http://localhost:3333 (Sanity Studio)
- CORS: `localhost:3000`, `localhost:3333`
- Sanity project: **Dramaway**, id `tr2qdg9j`, dataset `production`, org `oxdl2whwy`
- Env (gitignored): `apps/studio/.env`, `apps/web/.env.local` — project id + write token

### Zrobione

- Repo + docs + ADR-y + izolacja lokalnych materiałów w `private/`
- Scaffold `apps/web` + `apps/studio` (schematy: `project`, `person`, `page`, `publication`, `siteSettings`)
- Extract dumpa fundacji → JSON (`pnpm extract:fundacja`)
- Migracja fundacji → Sanity (`pnpm migrate:fundacja`): **7 persons, 23 pages, 2 news-as-pages, ~74 assets**; tokeny Media `[[{fid…}]]` → upload obrazów
- Upgrade Studio **3.99 → 6.10.1**

### Świadomie nie zrobione

- Next **nie** czyta jeszcze z Sanity (GROQ) — `/preview` = lokalny JSON
- Figmą / docelowym UI się nie zajmowaliśmy
- Czytelnia / `drama_teatr` — nie migrowane
- Typ `project` (Art Generacje + edycje) — schemat jest, treści z Drupala nie zmapowane 1:1 na editions
- Aktualności jako osobny typ — na razie `page` z prefixem `[Aktualność]` / slug `aktualnosc-…`
- Remote GitHub + Netlify
- Newsletter, formularze, EN

### Bezpieczeństwo

- Write token Sanity był wklejony w czat → **należy odwołać i wygenerować nowy**, zaktualizować `.env` (nie commituj tokenów, nie wklejaj do czatu)
- Dumpy SQL, FTP mirror, PDF, kickoff pack: tylko `private/` (poza gitem)

---

## Ogólny plan (kolejność)

1. **Treść clean (fundacja)** — Studio + Next z Sanity, bez Figmy  
2. **Art Generacje** — model edycji + dane (nie płaska strona)  
3. **Czytelnia** — wybiórczy import z `drama_teatr` → `publication`  
4. **UI z Figmy** — layouty, tokeny, komponenty  
5. **Launch** — GitHub remote, Netlify, domena, szkolenie redakcji  

Cel pośredni „czysta merytorycznie fundacja bez Figmy”: ~1–2 sesje po podłączeniu GROQ + przeglądzie treści w Studio.

---

## Następne kroki (priorytet)

1. **Obróć token API** (Editor/Developer) w manage → nowy w `apps/studio/.env` jako `SANITY_API_WRITE_TOKEN`.
2. **Podłącz Next → Sanity (GROQ):** `@sanity/client` / `next-sanity`, strony list/detail dla `person` i `page` (można zastąpić lub uzupełnić `/preview`).
3. **Przegląd jakości w Studio:** media, formatowanie Portable Text, brakujące pliki z tokenów.
4. **Doprecyzuj model Art Generacje** (`project.editions`) i zasilenie treścią (ręcznie / skrypt).
5. Dopiero potem: Figma UI; równolegle opcjonalnie kuracja Czytelni.

Nie zaczynaj od Figmy, dopóki treść fundacji nie jest OK w Studio + na froncie z Sanity.

---

## Komendy

```bash
cd /Users/jmirecki-letsreg/Code/waether-the-strm/drama
pnpm install
pnpm extract:fundacja          # dump → apps/web/src/data/extracted/ (gitignored)
pnpm migrate:fundacja          # JSON + legacy files → Sanity (wymaga tokenu)
pnpm dev                      # :3000
pnpm dev:studio               # :3333
```

Node **≥ 22.12** (Sanity v6). Preferuj **pnpm**.

---

## Mapa ścieżek

| Ścieżka | Rola |
|--------|------|
| `apps/web` | Next.js 15 |
| `apps/studio` | Sanity Studio v6 |
| `scripts/extract_fundacja.py` | SQL → JSON |
| `scripts/migrate-fundacja.mjs` | JSON → Sanity (+ Media tokens) |
| `docs/concept/` | IA, Art Generacje |
| `docs/decisions/` | ADR-001…003 |
| `docs/migration/` | Inwentarz Drupal |
| `private/` | Dumpy, legacy FTP, snapshoty — **nigdy do gita** (oprócz `private/README.md`) |

Kickoff pack leży w `private/dramaway-setup-ustalenia/` — **nie** kopiuj ról/instrukcji pod inną osobę; kanon jest w `docs/`.

---

## Reguła aktualizacji handoffu

Po sesji zaktualizuj co najmniej:

- datę / HEAD commit  
- „Stan na teraz” (co działa / co doszło)  
- „Następne kroki” (1–5 punktów, aktualne)  
- otwarte ryzyka (tokeny, brakujące assety, decyzje produktowe)

Jeśli coś jest w ADR lub `docs/concept/`, tu tylko **wskaźnik**, nie duplikuj eseju.
