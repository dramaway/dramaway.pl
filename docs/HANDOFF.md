# Handoff — DramaWay

**Aktualizuj ten plik na bieżąco** na końcu każdej sesji.  
**Sobota:** ten plik + `CLAUDE.md` + [migration/fundacja-status.md](migration/fundacja-status.md). Nie odtwarzaj historii z dumpów rozmów.

| | |
|--|--|
| **Ostatnia aktualizacja** | 2026-08-21 wieczór — sesja zamknięta; ciąg dalszy w sobotę |
| **Gałąź / HEAD** | `main` @ `c170533` |
| **Remote** | brak (tylko lokalny git) |
| **Working tree** | czyste |
| **Owner Sanity (na razie)** | Jan Mirecki |

---

## Co to jest

Redesign **fundacja.dramaway.pl**. MVP = jedna witryna. Art Generacje = serce. Czytelnia = dział (`drama_teatr`), nie drugi Next. Centrum = link zewnętrzny.

Stack: Next.js 15, Tailwind v4, shadcn/ui, Sanity Studio v6, Netlify. Kod/CMS EN · docs PL.

---

## Stan na zamknięciu sesji (2026-08-21)

Treść fundacji jest w Sanity i na `/preview`. **Figma nie ruszona** — tak miało być.

- Dataset `production` (`tr2qdg9j`) publiczny. Next bez tokenu. Write token **tylko** `apps/studio/.env`.
- W CMS: 7 `person`, 23+2 `page`, 4 `project` (Art Generacje = 13 edycji I–XI).
- Preview = GROQ, nie JSON. JSON = artefakt extractu.
- Naprawione skryptem: linki (177), YouTube (20), leftover `[[SANITY_IMAGE_n]]` (26). Studio: zrestartować, żeby zobaczyć bloki YouTube (miniatura).
- `edition.outcomes` — schemat jest, **pusty** (Figma uściśli).
- Serwery przy zamknięciu **jeszcze chodziły** (`:3000`, `:3333`). W sobotę: zostaw albo `pnpm dev:all`.

Pełny kanon migracji: [fundacja-status.md](migration/fundacja-status.md).

### Świadomie nie zrobione

- Figma / docelowy UI
- Czytelnia — brak dumpa `drama_teatr` w `private/dumps/`
- `siteSettings`, news jako osobny typ, GitHub/Netlify, newsletter, formularze, EN
- `person.role` (Drupal `field_funkcja`)
- Ręczna korekta części kotwic (Drupal ucinał środek zdania / albumy FB)

---

## Sobota — start

1. Przeczytaj ten plik i [fundacja-status.md](migration/fundacja-status.md).
2. `pnpm dev:all` jeśli porty wolne.
3. Jeden następny ruch (nie Figma, dopóki nie skończysz treści):

**Najsensowniejszy:** porównać `/preview/projekty/art-generacje` z [live](https://www.fundacja.dramaway.pl/projekty/art-generacje) i poprawić w Studio kotwice, które skrypt uciął źle.

Potem, jeśli będzie dump `drama_teatr`: Czytelnia (kuracja, nie 425 nodów).  
**Figma** = pierwszy moment „stop treści, start UI”.

---

## Komendy

```bash
cd /Users/jmirecki-letsreg/Code/waether-the-strm/drama
pnpm dev:all                  # :3000 + :3333
pnpm repair:portable-text     # dry-run; -- --write zapisuje
```

Nie odpalaj ponownie `migrate:fundacja` / `migrate:art-generacje` bez potrzeby — nadpisze ręczną korektę.

---

## Mapa

| Ścieżka | Rola |
|--------|------|
| `docs/HANDOFF.md` | Teraz / sobota |
| `docs/migration/fundacja-status.md` | Co zmigrowane |
| `docs/README.md` | Hub docsów |
| `apps/web/src/lib/sanity/` | GROQ |
| `scripts/repair-portable-text.mjs` | linki / YouTube / leftover obrazki |
| `private/` | Dumpy — poza gitem |
