# Handoff — DramaWay

**Aktualizuj ten plik na bieżąco** na końcu każdej sesji.  
Start: ten plik + `CLAUDE.md` + [migration/fundacja-status.md](migration/fundacja-status.md). Nie odtwarzaj historii z dumpów rozmów.

| | |
|--|--|
| **Ostatnia aktualizacja** | 2026-08-30 — fundament UI + hero na `/`; commit i push na origin |
| **Gałąź / HEAD** | `main` @ `a2375a2` |
| **Remote** | `origin` = `git@github.com:waether-the-strm/artgeneracje.git` |
| **Working tree** | czyste po tym commicie |
| **Owner Sanity (na razie)** | Jan Mirecki |

---

## Co to jest

Redesign **fundacja.dramaway.pl**. MVP = jedna witryna. Art Generacje = serce. Czytelnia = dział (`drama_teatr`), nie drugi Next. Centrum = link zewnętrzny.

Stack: Next.js 15, Tailwind v4, shadcn/ui, Sanity Studio v6, Netlify. Kod/CMS EN · docs PL.

---

## Stan teraz

Treść fundacji jest w Sanity. **Publiczne URL-e z IA działają** (chrome roboczy, nie Figma).

- Dataset `production` (`tr2qdg9j`) publiczny. Next bez tokenu. Write token **tylko** `apps/studio/.env`.
- Mapa URL: `apps/web/src/lib/routes.ts` — prefiks IA + `slug.current`.
- Listingi `/`, `/projekty`, `/zespol`, `/fundacja` = widoki, nie dokumenty.
- `/projekty/[slug]` = `project` albo strona z sekcji projektów. `/[slug]` = reszta (w tym newsy pod starym aliasem korzenia).
- `siteSettings` **jest w datasetcie** — zasilone 2026-08-30 (tytuł, hero, zdjęcie). Edycja w Studio, zakładka Hero.
- `/preview` zostaje inwentarzem CMS.
- Netlify: `netlify.toml` w repo (`pnpm --filter web build`, `X-Robots-Tag: noindex`). Deploy preview w toku (2026-08-30).
- Mapa 301 na premierę = **osobne zadanie**, nie teraz.

Pełny kanon migracji: [fundacja-status.md](migration/fundacja-status.md).

### Warstwa wizualna (od 2026-08-30)

Figma zmierzona i przełożona na mały system. Kanon: [design/system.md](design/system.md), liczby źródłowe: [design/figma-baseline.md](design/figma-baseline.md), decyzja: [ADR-004](decisions/ADR-004-layout-architecture.md).

- Tokeny w `@theme` (`globals.css`), fonty MuseoModerno + Alexandria przez `next/font`.
- Cztery klasy układu (`.page`, `.split`, `.cols-3`, `.stack`) zamiast siatki 12-kolumnowej.
- Sześć prymitywów: `Section`, `DotBand`, `PaletteRow`, `Blob`, `CtaLink`, `Media`.
- Nagłówek i hero gotowe; hero jedzie na `siteSettings` (copy + zdjęcie z Figmy, wgrane do CMS).
- Na `/` widać też zdjęcia: wyróżniony projekt (galeria Art Generacje), aktualności (`.cols-3` + pierwsze zdjęcie z body), karty projektów (galeria albo fotka ze starej strony o tym samym slugu). BOAL IN PRACTICE bez fotki = piaskowy placeholder.
- Reguła `.cursor/rules/web-ui.mdc` kieruje lżejsze modele do obu dokumentów.

### Świadomie nie zrobione

- Reszta sekcji strony głównej z Figmy: „Kim jesteśmy?" / „Metody" (`.split-reverse`), blok Art Generacje, Czytelnia, stopka z cytatem Boala. Aktualności i projekty na `/` mają już zdjęcia, ale to nie jest jeszcze skład z Figmy.
- Podstrony na nowym UI — listingi `/projekty`, `/zespol`, `/fundacja` są nadal robocze z fazy migracji
- Mapa przekierowań (stare aliasy → nowe)
- Czytelnia — brak dumpa `drama_teatr`
- News jako osobny typ, newsletter, formularze, EN
- `person.role` (Drupal `field_funkcja`)
- Ręczna korekta części kotwic

---

## Następna sesja — start

1. Ten plik + [design/system.md](design/system.md).
2. `pnpm dev:all` jeśli porty wolne.
3. Publiczne URL-e, nie `/preview`.

**Najpierw:** kolejna sekcja homepage z Figmy — „Kim jesteśmy?" / „Metody" (`.split-reverse`), według `docs/design/system.md`.

**Potem:** blok Art Generacje, Czytelnia, stopka Boala; potem podstrony na tym samym UI. Sprawdzić, czy preview Netlify wstał i czy env `NEXT_PUBLIC_SANITY_*` jest ustawione.

### Pytania do designerki (niewysłane)

Brak ekranów mobilnych · logo jako raster zamiast SVG · sześć wystąpień Poppins · nawigacja 4 pozycje wobec 7 z IA · zielony `#369125` nie przechodzi kontrastu WCAG AA. Uzasadnienia: [figma-baseline.md](design/figma-baseline.md).

---

## Komendy

```bash
cd /Users/jmirecki-letsreg/Code/waether-the-strm/drama
pnpm dev:all                  # :3000 + :3333
```

Nie odpalaj ponownie `migrate:fundacja` / `migrate:art-generacje` bez potrzeby — nadpisze ręczną korektę.

---

## Mapa

| Ścieżka | Rola |
|--------|------|
| `docs/HANDOFF.md` | Teraz |
| `docs/design/system.md` | **Kanon UI** — tokeny, klasy, prymitywy, jak dołożyć sekcję |
| `docs/design/figma-baseline.md` | Pomiary z Figmy (node ID, kolory, geometria) |
| `docs/concept/ia.md` | IA / URL-e |
| `apps/web/src/lib/routes.ts` | Kanon publicznych ścieżek |
| `docs/migration/fundacja-status.md` | Co zmigrowane |
| `apps/web/src/app/(site)/` | Publiczny App Router |
| `apps/web/src/lib/sanity/` | GROQ |
| `private/` | Dumpy — poza gitem |
