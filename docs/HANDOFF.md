# Handoff — DramaWay

**Aktualizuj ten plik na bieżąco** na końcu każdej sesji.  
Start: ten plik + `CLAUDE.md` + [migration/fundacja-status.md](migration/fundacja-status.md). Nie odtwarzaj historii z dumpów rozmów.

| | |
|--|--|
| **Ostatnia aktualizacja** | 2026-09-03 — skład homepage z ramki Figmy `59:608`; commity na `main` |
| **Gałąź / HEAD** | `main` @ `08a290b` |
| **Remote** | `origin` = `git@github.com:waether-the-strm/artgeneracje.git` |
| **Preview** | https://dramaway.netlify.app/ |
| **Studio** | https://dramaway.sanity.studio/ |
| **Working tree** | czyste po tym commicie (lokalnie `?? .cursor/settings.json`) |
| **Owner Sanity (na razie)** | Jan Mirecki |

---

## Co to jest

Redesign **fundacja.dramaway.pl**. MVP = jedna witryna. Art Generacje = serce. Czytelnia = dział (`drama_teatr`), nie drugi Next. Centrum = link zewnętrzny.

Stack: Next.js 15, Tailwind v4, shadcn/ui, Sanity Studio v6, Netlify. Kod/CMS EN · docs PL.

---

## Stan teraz

Treść fundacji jest w Sanity. Publiczne URL-e z IA działają. **Strona główna i chrome są już w składzie z Figmy** (copy + kolejność bloków, nie pixel-perfect).

- Dataset `production` (`tr2qdg9j`) publiczny. Next bez tokenu. Write token **tylko** `apps/studio/.env`.
- Mapa URL: `apps/web/src/lib/routes.ts` — prefiks IA + `slug.current`. Header: dokładnie 4 pozycje (Projekty, Baza wiedzy, O fundacji, Kontakt). `/metody` i `/zespol` zostają jako URL-e, nie ma ich w navie.
- Listingi `/projekty`, `/zespol`, `/fundacja` = widoki, nie dokumenty. `/` **nie** listuje już siatki projektów ani splitów „13 edycji”.
- `/projekty/[slug]` = `project` albo strona z sekcji projektów. `/[slug]` = reszta (w tym newsy pod starym aliasem korzenia).
- Stub `/czytelnia` (nav: „Baza wiedzy”) — heading, bez dumpa `drama_teatr`.
- `siteSettings` **jest w datasetcie** — hero zasilony; grupa `homepage` (about / methods / featured / czytelnia) jest w schemacie, w CMS pusta → fallbacki z `apps/web/src/lib/homepage-copy.ts`.
- `getResolvedSite()` zwraca `homepage` + `hero` + `footerNote` (zawsze string, cytat Boala jako fallback). Featured **H2** to tytuł `project.featured`; magenta etykieta „Projekty” to `homepage.featured.heading`.
- Newsy na `/`: `getHomepageNews()` — max 3, bez zdjęć, excerpt ~400 znaków (GROQ: `array::join(string::split(pt::text(body), "")[0...400], "")`, bo `pt::text(body)[0...400]` zwraca `null`). Trzecia kolumna pusta, gdy w CMS są tylko 2 newsy.
- `/preview` zostaje inwentarzem CMS.
- Netlify: `netlify.toml` w repo (`pnpm --filter web build`, `X-Robots-Tag: noindex`). Preview: https://dramaway.netlify.app/. Studio: https://dramaway.sanity.studio/.
- Mapa 301 na premierę = **osobne zadanie**, nie teraz.

Pełny kanon migracji: [fundacja-status.md](migration/fundacja-status.md).

### Warstwa wizualna (od 2026-08-30, skład `/` 2026-09-03)

Figma zmierzona i przełożona na mały system. Kanon: [design/system.md](design/system.md), liczby źródłowe: [design/figma-baseline.md](design/figma-baseline.md), decyzja: [ADR-004](decisions/ADR-004-layout-architecture.md).

- Tokeny w `@theme` (`globals.css`), fonty MuseoModerno + Alexandria przez `next/font`.
- Cztery klasy układu (`.page`, `.split`, `.cols-3`, `.stack`) zamiast siatki 12-kolumnowej.
- Sześć prymitywów: `Section`, `DotBand`, `PaletteRow`, `Blob`, `CtaLink`, `Media`.
- Nagłówek: 4 pozycje z ramki. Hero jedzie na `siteSettings`.
- `/` kolejność: Hero → DotBand → aktualności (max 3, bez zdjęć) → DotBand → Kim/Metody (`.split-reverse`, jedno `Media`) → DotBand → PaletteRow → Art Generacje + Czytelnia → PaletteRow → stopka (logo + cytat Boala).
- Sekcje: `home-news.tsx`, `home-about-methods.tsx`, `home-featured-and-reading.tsx`.
- Zdjęcie „Kim jesteśmy” z `homepage.about.image`; puste = piaskowy placeholder `Media`.
- CTA „poznaj nasze projekty” przy Art Generacje → `/projekty` (listing zostaje). CTA Czytelni → `/czytelnia` (ślepe; komentarz w kodzie).
- Reguła `.cursor/rules/web-ui.mdc` kieruje lżejsze modele do obu dokumentów.

`docs/design/system.md` § „Stan na teraz” jest **nieaktualny** (wciąż opisuje siatkę projektów na `/`) — poprawić przy polerowaniu, nie przywracać starego składu.

### Świadomie nie zrobione

- Dopieszczenie wizualne homepage (piksle, mobile, rytm) — skład i copy są, nie 1:1 z ramką
- Wypełnienie pól `siteSettings.homepage` w Studio (działa na fallbackach)
- `page.excerpt` / `page.publishedAt` w CMS — newsy na `/` tną `pt::text(body)`; dat na kartach nie ma
- Podstrony na nowym UI — listingi `/projekty`, `/zespol`, `/fundacja` są nadal robocze z fazy migracji
- Mapa przekierowań (stare aliasy → nowe)
- Czytelnia — brak dumpa `drama_teatr`, stub bez treści
- News jako osobny typ, newsletter, formularze, EN
- `person.role` (Drupal `field_funkcja`)
- Ręczna korekta części kotwic

---

## Następna sesja — start

1. Ten plik + [design/system.md](design/system.md).
2. `pnpm dev:all` jeśli porty wolne.
3. Publiczne URL-e, nie `/preview`. Preview Netlify jeszcze **nie** ma tego składu, dopóki nie będzie deploya.

**Najpierw:** dopieszczenie wizualne `/` i/lub zasilenie Studio (homepage + excerpt/data newsów). Potem dump Czytelni (`drama_teatr`) albo podstrony na tym samym UI.

Nie odtwarzać siatki projektów ani wyróżnionego splitu na `/`.

### Pytania do designerki (niewysłane)

Ze składu homepage (2026-09-03):

- Zespół i Metody poza navem — jak do nich dojść oprócz CTA / głębokich URL-i?
- Centrum i szkolenia całkiem poza headerem?
- „Baza wiedzy” (nav) vs „Czytelnia” (blok na `/`) — jedna nazwa?
- CTA Czytelni „poznajmy się” zostaje jako kopia CTA przy „Kim jesteśmy”?

Z baseline (wcześniej): brak ekranów mobilnych · logo jako raster zamiast SVG · sześć wystąpień Poppins · nawigacja 4 pozycje wobec 7 z IA · zielony `#369125` nie przechodzi kontrastu WCAG AA. Uzasadnienia: [figma-baseline.md](design/figma-baseline.md).

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
| `apps/web/src/lib/homepage-copy.ts` | Fallbacki copy homepage / hero / stopki |
| `docs/migration/fundacja-status.md` | Co zmigrowane |
| `apps/web/src/app/(site)/` | Publiczny App Router |
| `apps/web/src/lib/sanity/` | GROQ |
| `private/` | Dumpy — poza gitem |
