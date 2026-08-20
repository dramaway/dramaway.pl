# Handoff — DramaWay

**Aktualizuj ten plik na bieżąco** na końcu każdej sesji (albo po większym kamieniu milowym).  
Nowy czat: ten plik + `CLAUDE.md` + `docs/README.md`. **Nie** odtwarzaj historii z dumpów rozmów.

Co już jest w CMS, luki konwersji, mapa vs live: **[migration/fundacja-status.md](migration/fundacja-status.md)** — tam odsyłaj przy „czy to zmigrowane?”.

| | |
|--|--|
| **Ostatnia aktualizacja** | 2026-08-21 (~00:40) — linki + YouTube + leftover obrazki; stop przed Figmą |
| **Gałąź / HEAD** | `main` @ `fed5632` |
| **Remote** | brak (tylko lokalny git) |
| **Owner Sanity (na razie)** | Jan Mirecki — transfer ownership później OK |

---

## Co to jest

Redesign **fundacja.dramaway.pl**. MVP = jedna witryna fundacji. Art Generacje = serce. Czytelnia = dział tej strony (`drama_teatr`), nie drugi Next. `centrum.dramaway.pl` = link zewnętrzny.

Stack: Next.js 15, Tailwind v4, shadcn/ui, Sanity Studio v6, Netlify. Kod/CMS EN · docs PL.

---

## Stan na teraz (fakt)

- Preview czyta **Sanity** (GROQ), nie lokalny JSON. JSON = artefakt `pnpm extract:fundacja`.
- Dataset `production` (projekt `tr2qdg9j`) publiczny — Next bez tokenu.
- Write token **tylko** `apps/studio/.env` → `SANITY_API_WRITE_TOKEN`.
- W CMS: 7 `person`, 23+2 `page`, 4 `project` (Art Generacje = 13 edycji). Szczegóły: [fundacja-status.md](migration/fundacja-status.md).
- Studio: `blockContent` z obrazkami, **linkami** i **YouTube**. Jan: obrazki OK; linki/filmy — naprawa skryptem 2026-08-21 (`pnpm repair:portable-text -- --write`: 177 marek, 20 embedów).
- Edycje mają puste `outcomes` (tytuł / podtytuł / data / zdjęcie / opis) — nie zasilane automatycznie; Figma uściśli.
- `pnpm dev:all` — Next `:3000` + Studio `:3333`. CORS na localhost już jest.

### Świadomie nie zrobione

- **Figma / docelowy UI** — tu się zatrzymujemy
- Czytelnia — brak dumpa `drama_teatr` w `private/dumps/`
- `siteSettings`, news jako osobny typ, GitHub/Netlify, newsletter, formularze, EN

---

## Plan (kolejność)

1. ~~Treść fundacji w Sanity + preview~~  
2. ~~Art Generacje jako `project.editions`~~  
3. **Czytelnia** — dump + kuracja → `publication`  
4. **UI z Figmy**  
5. Launch (GitHub, Netlify, domena, redakcja)

---

## Następne kroki

1. Porównać `/preview/projekty/art-generacje` z [live](https://www.fundacja.dramaway.pl/projekty/art-generacje) — kotwice, które skrypt źle uciął, poprawić w Studio.
2. Czytelnia — gdy będzie `drama_teatr` w `private/dumps/`; nie 425 nodów w ciemno.
3. **Figma** — UI + decyzja, czy `edition.outcomes` zostaje tak ogólne.

---

## Komendy

```bash
cd /Users/jmirecki-letsreg/Code/waether-the-strm/drama
pnpm install
pnpm extract:fundacja
pnpm migrate:fundacja
pnpm migrate:art-generacje
pnpm repair:portable-text   # dry-run; -- --write zapisuje
pnpm dev          # :3000  /preview
pnpm dev:studio   # :3333
pnpm dev:all
```

Node ≥ 22.12, pnpm. Next `.env.local`: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` — bez tokenu.

---

## Mapa (skrót)

| Ścieżka | Rola |
|--------|------|
| `docs/migration/fundacja-status.md` | Co zmigrowane |
| `docs/HANDOFF.md` | Ten plik — teraz / next |
| `apps/web/src/lib/sanity/` | GROQ `person` / `page` / `project` |
| `scripts/migrate-fundacja.mjs` | dump JSON → Sanity |
| `scripts/migrate-art-generacje.mjs` | page AG → editions |
| `scripts/repair-portable-text.mjs` | nawiasowe URL-e + `[video:]` → link / youtube |
| `private/` | Dumpy — poza gitem (oprócz README) |

Kickoff pack w `private/dramaway-setup-ustalenia/` nie jest kanonem — kanon jest w `docs/`.
