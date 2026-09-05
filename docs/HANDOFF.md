# Handoff — DramaWay

**Aktualizuj ten plik na bieżąco** na końcu każdej sesji.  
Start: ten plik + `CLAUDE.md` + [migration/fundacja-status.md](migration/fundacja-status.md). Nie odtwarzaj historii z dumpów rozmów.

| | |
|--|--|
| **Ostatnia aktualizacja** | 2026-09-05 — ustalenia IA/podstron zamknięte; handoff do Czytelni: [concept/ustalenia-2026-09-05.md](concept/ustalenia-2026-09-05.md) |
| **Gałąź / HEAD** | `main` @ `95360a6` |
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
- Mapa URL: `apps/web/src/lib/routes.ts` — prefiks IA + `slug.current`. Header **pierwszy poziom** nadal cztery etykiety z Figmy (Projekty, Baza wiedzy, O fundacji, Kontakt). **Baza wiedzy** to nadzbiór: hub + drugi poziom **Metody** (`/metody`) i **Czytelnia** (`/czytelnia`). Hub ma być prosty i da się go wyłączyć. W kodzie etykieta „Baza wiedzy” na razie prowadzi na stub `/czytelnia` — do zmiany. `/zespol` zostaje URL-em poza pierwszym poziomem menu.
- Listingi `/projekty`, `/zespol`, `/fundacja` = widoki, nie dokumenty. `/` **nie** listuje już siatki projektów ani splitów „13 edycji”.
- `/projekty/[slug]` = `project` albo strona z sekcji projektów. `/[slug]` = reszta (w tym newsy pod starym aliasem korzenia).
- Stub `/czytelnia` — heading, **0× `publication` w Sanity**. Dump **jest** lokalnie: `private/dumps/drama_teatr_1787254349.sql.gz`. To dziecko Bazy wiedzy, nie cała „Baza wiedzy”. Plan importu jest w osobnym chacie Cursor („Knowledge base data migration” / plan „Migracja Czytelni”) — zaktualizować o [ustalenia-2026-09-05.md](concept/ustalenia-2026-09-05.md).
- `siteSettings` **jest w datasetcie** — hero zasilony; grupa `homepage` (about / methods / featured / czytelnia) jest w schemacie, w CMS pusta → fallbacki z `apps/web/src/lib/homepage-copy.ts`. Grupa **Ikony** (`branding`): **SVG jako `image`** (Select w Media widzi m.in. już wrzucony `icon.svg`; strona serwuje surowy SVG z `asset.url`, nie raster CDN) / **ICO jako `file`** z podglądem 32×32 i natywnym pickerem (Media na polach `file` była pusta: 0 `fileAsset`) / PNG light+dark / Apple / 512 / OG. Puste pole = `public/brand`.
- `getResolvedSite()` zwraca `homepage` + `hero` + `footerNote` (zawsze string, cytat Boala jako fallback). Featured **H2** to tytuł `project.featured`; magenta etykieta „Projekty” to `homepage.featured.heading`.
- Newsy na `/`: `getHomepageNews()` — max 3, bez zdjęć, excerpt ~400 znaków. Daty kart: `publishedAt`. Trzeci news `news-placeholder-syrena` jest wypełniaczem z ramki — **do draftu** z adnotacją PL (wykaz: [fundacja-status.md](migration/fundacja-status.md) „Luki vs ramka”).
- `/preview` zostaje inwentarzem CMS.
- Studio: plugin **Media** (`sanity-plugin-media`) — zakładka w menu + źródło przy polach **`image`**. Pola **`file`** (ICO) zostają na wbudowanym pickerze Sanity: Media w trybie plików pokazuje tylko `sanity.fileAsset`, a tych jest zero. Typy `media.tag` / `media.folder` ukryte w desk. Credit line włączony. Deploy: `pnpm --filter studio deploy` → https://dramaway.sanity.studio/.
- Netlify: `netlify.toml` w repo (`pnpm --filter web build`, `X-Robots-Tag: noindex`). Preview: https://dramaway.netlify.app/.
- Zależności: catalog w `pnpm-workspace.yaml`, lockfile, Dependabot (tydzień), skrypty `pnpm deps:outdated` / `pnpm deps:update`. Kanwa: [guides/dependencies.md](guides/dependencies.md). Next 16 / TS 6+ / ESLint 10 zostają poza automatami.
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
- Prawdziwe makiety mobilne od designerki — **nie będzie**; kanon z `/` na podstrony
- Wypełnienie pól `siteSettings.homepage` w Studio (działa na fallbackach)
- `page.excerpt` na dwóch migracyjnych newsach nadal puste — karty tną `pt::text(body)` (placeholder Syrena ma excerpt z ramki)
- Zdjęcie „Kim jesteśmy” w Sanity — leci z `public/about-photo.jpg` jako `fallbackSrc`
- Pasmo kół pod „Kim jesteśmy?” ma odbity schodek zamiast figmowego (uzgodnione) — powód w [design/system.md](design/system.md)
- Podstrony na nowym UI — listingi `/projekty`, `/zespol`, `/fundacja` są nadal robocze z fazy migracji
- Mapa przekierowań (stare aliasy → nowe)
- Czytelnia — dump jest, importu nie ma; stub bez treści
- News jako osobny typ, newsletter, **formularz kontaktu (osobne zamówienie, jeśli będą chcieli)**, EN
- `person.role` (Drupal `field_funkcja`)
- Ręczna korekta części kotwic

---

## Następna sesja — start

**Nie kontynuować chatu makiet** (kontekst zużyty). Dwie osobne sesje:

1. **Skład podstron** — **nowy** chat, od razu tryb Plan. Prompt w [ustalenia-2026-09-05.md](concept/ustalenia-2026-09-05.md). Czytać ten plik + [design/system.md](design/system.md) + [concept/ia.md](concept/ia.md). Nie wołać Figmy bez potrzeby.
2. **Migracja Czytelni** — istniejący chat Cursor z planem „Migracja Czytelni”. Wkleić prompt z ustaleń; zaktualizować plan (Baza wiedzy ≠ `/czytelnia`).

`pnpm dev:all` jeśli porty wolne. Publiczne URL-e, nie `/preview`.

### Decyzje z makiet (2026-09-05) — zamknięte

Pełny zapis + most do planu Czytelni: **[concept/ustalenia-2026-09-05.md](concept/ustalenia-2026-09-05.md)**. IA: [concept/ia.md](concept/ia.md). Makieta: [design/wireframes.html](design/wireframes.html).

- **Baza wiedzy** = nadzbiór: hub (wyłączalny) + drugi poziom **Metody** `/metody` i **Czytelnia** `/czytelnia`.
- **Czytelnia nie jest `project`.** Prezentacja na `/projekty` dozwolona; Sanity = `publication`.
- **Wiersz z plamą** = jedna sekcja, tablica `{title, lead, href}` — `/projekty`, edycje AG, Czytelnia.
- **Edycja AG:** `/projekty/art-generacje/[slug]`; w CMS obiekt na `project`.
- **Listing = CMS.** Luki: [fundacja-status.md](migration/fundacja-status.md). Placeholder Syrena → draft (jeszcze nie zrobione).
- **Kontakt bez formularza.** Formularz = osobne zamówienie później.
- **Mobile bez ramek.** Kanon z `/`.
- **Kolejność UI:** cegły (hero podstrony + wiersz) → `/projekty` → AG + URL edycji → Baza (hub, nav L2, `/metody`, `/czytelnia`) → `/fundacja` → `/kontakt`.

Nie odtwarzać siatki projektów ani wyróżnionego splitu na `/`.

### Pytania do designerki (niewysłane)

Ze składu homepage (2026-09-03):

- Zespół poza navem — jak do niego dojść oprócz CTA / głębokiego URL-a? (Metody: drugi poziom Bazy wiedzy — ustalone 2026-09-05.)
- Centrum i szkolenia całkiem poza headerem?
- CTA Czytelni „poznajmy się” zostaje jako kopia CTA przy „Kim jesteśmy”?
- Drugi poziom menu Bazy wiedzy — designerka nie rysowała dropdownu; do pokazania przy okazji, nie bloker.

Z baseline (wcześniej): brak ekranów mobilnych · logo jako raster zamiast SVG · sześć wystąpień Poppins · nawigacja 4 pozycje wobec 7 z IA · zielony `#369125` nie przechodzi kontrastu WCAG AA. Uzasadnienia: [figma-baseline.md](design/figma-baseline.md).

---

## Komendy

```bash
cd /Users/jmirecki-letsreg/Code/waether-the-strm/drama
pnpm dev:all                  # :3000 + :3333
pnpm deps:outdated            # co odstaje
pnpm deps:update              # bump w ramach ^/~
pnpm --filter studio deploy   # https://dramaway.sanity.studio/
```

Nie odpalaj ponownie `migrate:fundacja` / `migrate:art-generacje` bez potrzeby — nadpisze ręczną korektę.

---

## Mapa

| Ścieżka | Rola |
|--------|------|
| `docs/HANDOFF.md` | Teraz |
| `docs/concept/ustalenia-2026-09-05.md` | **Transplant sesji** — IA/podstrony + delta dla planu Czytelni + prompty |
| `docs/design/system.md` | **Kanon UI** — tokeny, klasy, prymitywy, jak dołożyć sekcję |
| `docs/design/figma-baseline.md` | Pomiary z Figmy (node ID, kolory, geometria) |
| `docs/design/wireframes.html` | Makiety podstron — otwórz dwuklikiem |
| `docs/concept/ia.md` | IA / URL-e |
| `apps/web/src/lib/routes.ts` | Kanon publicznych ścieżek |
| `apps/web/src/lib/homepage-copy.ts` | Fallbacki copy homepage / hero / stopki |
| `docs/migration/fundacja-status.md` | Co zmigrowane |
| `apps/web/src/app/(site)/` | Publiczny App Router |
| `apps/web/src/lib/sanity/` | GROQ |
| `apps/studio/` | Sanity Studio (schema + Media) |
| `private/` | Dumpy — poza gitem |
