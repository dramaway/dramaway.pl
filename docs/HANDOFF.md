# Handoff — DramaWay

**Aktualizuj ten plik na bieżąco** na końcu każdej sesji.  
Start: ten plik + `CLAUDE.md` + [migration/fundacja-status.md](migration/fundacja-status.md). Nie odtwarzaj historii z dumpów rozmów.

| | |
|--|--|
| **Ostatnia aktualizacja** | 2026-09-04 — nagłówki zawsze uppercase; wizualna skala vs outline HTML |
| **Gałąź / HEAD** | `main` @ `925fc12` |
| **Remote** | `origin` = `git@github.com:waether-the-strm/artgeneracje.git` |
| **Preview** | https://dramaway.netlify.app/ |
| **Studio** | https://dramaway.sanity.studio/ |
| **Working tree** | czyste |
| **Owner Sanity (na razie)** | Jan Mirecki |

---

## Co to jest

Redesign **fundacja.dramaway.pl**. MVP = jedna witryna. Art Generacje = serce. Czytelnia = dział (`drama_teatr`), nie drugi Next. Centrum = link zewnętrzny.

Stack: Next.js 15, Tailwind v4, shadcn/ui, Sanity Studio v6, Netlify. Kod/CMS EN · docs PL.

---

## Stan teraz

Treść fundacji jest w Sanity. Publiczne URL-e z IA działają. **Strona główna ma skład z Figmy plus polish desktopowy** (hero od góry kolumny, pasma pełnych kół przy krawędziach, naprzemienne kolory tytułów, klikalne kafelki) **i świadomy pass mobilny poniżej 1024 px** (sticky header + overlay, hero H1 → kadr w kole → lead, stacked split tekst → kadr 4:5). Nie pixel-perfect. Sprawdzone lokalnie: 375 (H1 w pierwszym ekranie, koło 227 px, brak overflow), 768, desktop (overlay header i portret bleed bez regresji).

- Dataset `production` (`tr2qdg9j`) publiczny. Next bez tokenu. Write token **tylko** `apps/studio/.env`.
- Mapa URL: `apps/web/src/lib/routes.ts` — prefiks IA + `slug.current`. Header: dokładnie 4 pozycje (Projekty, Baza wiedzy, O fundacji, Kontakt). `/metody` i `/zespol` zostają jako URL-e, nie ma ich w navie.
- Listingi `/projekty`, `/zespol`, `/fundacja` = widoki, nie dokumenty. `/` **nie** listuje już siatki projektów ani splitów „13 edycji”.
- `/projekty/[slug]` = `project` albo strona z sekcji projektów. `/[slug]` = reszta (w tym newsy pod starym aliasem korzenia).
- Stub `/czytelnia` (nav: „Baza wiedzy”) — heading, bez dumpa `drama_teatr`.
- `siteSettings` **jest w datasetcie** — hero zasilony; grupa `homepage` (about / methods / featured / czytelnia) jest w schemacie, w CMS pusta → fallbacki z `apps/web/src/lib/homepage-copy.ts`.
- `getResolvedSite()` zwraca `homepage` + `hero` + `footerNote` (zawsze string, cytat Boala jako fallback). Featured **H2** to tytuł `project.featured`; magenta etykieta „Projekty” to `homepage.featured.heading`.
- Newsy na `/`: `getHomepageNews()` — max 3, bez zdjęć, excerpt ~400 znaków (GROQ: `array::join(string::split(pt::text(body), "")[0...400], "")`, bo `pt::text(body)[0...400]` zwraca `null`). Daty kart: `publishedAt` (Figma: lipiec / maj / styczeń 2026). Trzeci news `news-placeholder-syrena` („Nowy projekt z Teatrem Syrena”) jest placeholderem z ramki — można usunąć ze Studia.
- `/preview` zostaje inwentarzem CMS.
- Netlify: `netlify.toml` w repo (`pnpm --filter web build`, `X-Robots-Tag: noindex`). Preview: https://dramaway.netlify.app/. Studio: https://dramaway.sanity.studio/.
- Mapa 301 na premierę = **osobne zadanie**, nie teraz.

Pełny kanon migracji: [fundacja-status.md](migration/fundacja-status.md).

### Warstwa wizualna (od 2026-08-30, skład `/` 2026-09-03, polish 2026-09-03, mobile 2026-09-03)

Figma zmierzona i przełożona na mały system. Kanon: [design/system.md](design/system.md), liczby źródłowe: [design/figma-baseline.md](design/figma-baseline.md), decyzja: [ADR-004](decisions/ADR-004-layout-architecture.md).

- Tokeny w `@theme` (`globals.css`), fonty MuseoModerno + Alexandria przez `next/font`.
- Klasy układu: `.page`, `.split` (pełny viewport, spad zdjęcia do krawędzi okna), `.cols-3`, `.stack`, `.stack-narrow`, `.footer-quote`.
- Sześć prymitywów: `Section`, `DotBand`, `PaletteRow`, `Blob`, `CtaLink`, `Media`.
- **Hero / nav:** na `lg+` wrapper `[data-home]` + `:has()` wyjmuje header z pionowego flow i kotwiczy go w lewej kolumnie (szerokość jak `.split-text`). Portret od góry prawej kolumny, spad do prawej krawędzi viewportu. Nav **nigdy** na zdjęciu. Poniżej `lg`: sticky pasek (logo + menu), overlay na `sand` z czterema pozycjami; hero to H1, kadr w kole, lead/CTA; stacked `.split` ma tekst, potem kadr inset 4:5 (`--media-split-max`).
- Pasmo kół: `--dot-size` 82 px (skok 48 px <768), bez `overflow: hidden`, koła z `radial-gradient(circle closest-side)` — bez `closest-side` promień idzie do narożnika kafla i zostaje szczelina. Szerokość rzędu `round(up, 50%, --dot-size)`: rzędy dobijają do krawędzi strony, reszta z zaokrąglenia ląduje na środku pod schodkiem. Ujemny margin nachodzi na krawędzie `Media`; prop `mirror` odbija schodek tam, gdzie zdjęcie jest po lewej.
- Paleta: 7 stykających się kół, `flex-shrink: 0`, wyśrodkowana jako grupa.
- `/` kolejność: Hero → DotBand → aktualności (H2 AKTUALNOŚCI `text-h2`, tytuł kart H3 `text-h4` i data `text-small` naprzemiennie magenta / navy, max 3, bez zdjęć, szersza rynna) → DotBand → Kim/Metody (`.split-reverse`; oba H2 na `text-h3` + `text-body`) → DotBand `mirror` → PaletteRow → Art Generacje + Czytelnia (`.stack-narrow`, H2 na `text-h3` + `text-body`) → PaletteRow → stopka (logo + cytat Boala `.footer-quote`).
- Sekcje: `home-news.tsx`, `home-about-methods.tsx`, `home-featured-and-reading.tsx`.
- Karty aktualności: `.news-card` trzyma wspólną linię bazową (tytuł na dwie linie, treść zbiera luz), więc rulki CTA są na jednym poziomie niezależnie od długości copy.
- Klikalne kafelki: `.card-link` rozciąga link tytułu na całą kartę, `CtaLink presentational` zamienia zdublowane CTA w `<span aria-hidden>`, `.cta-over` wynosi nad nakładkę CTA prowadzące gdzie indziej. Aktualność → artykuł; Art Generacje → `/projekty/art-generacje` przy CTA na listę `/projekty`; Czytelnia → `/czytelnia`.
- Zdjęcie „Kim jesteśmy” z `homepage.about.image`; puste = `fallbackSrc` na `public/about-photo.jpg` (kadr z draftu layoutu), nie piaskowy placeholder.
- Reguła `.cursor/rules/web-ui.mdc` kieruje lżejsze modele do obu dokumentów.

### Świadomie nie zrobione

- Pixel-perfect vs ramka (375 ma wygodny chrome i rytm, nie 1:1)
- Prawdziwe makiety mobilne od designerki — obecne reguły są autorskie; gdy przyjdą ekrany, rewizja
- Wypełnienie pól `siteSettings.homepage` w Studio (działa na fallbackach)
- `page.excerpt` na dwóch migracyjnych newsach nadal puste — karty tną `pt::text(body)` (placeholder Syrena ma excerpt z ramki)
- Zdjęcie „Kim jesteśmy” w Sanity — leci z `public/about-photo.jpg` jako `fallbackSrc`
- Pasmo kół pod „Kim jesteśmy?” ma odbity schodek zamiast figmowego (uzgodnione) — powód w [design/system.md](design/system.md)
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
3. Publiczne URL-e, nie `/preview`. Preview Netlify złapie polish z `origin/main` po deployu.

**Najpierw:** wgranie zdjęcia „Kim jesteśmy” do Sanity zamiast `public/about-photo.jpg`, i/lub zasilenie grupy `homepage` w Studio. Potem dump Czytelni (`drama_teatr`) albo podstrony na tym samym UI. Preview Netlify złapie pass mobilny po deployu z gałęzi.

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
