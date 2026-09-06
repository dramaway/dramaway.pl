# Handoff — DramaWay

**Aktualizuj ten plik na bieżąco** na końcu każdej sesji.  
Start: ten plik + `CLAUDE.md` + [migration/fundacja-status.md](migration/fundacja-status.md). Nie odtwarzaj historii z dumpów rozmów.

| | |
|--|--|
| **Ostatnia aktualizacja** | 2026-09-07 — puste pole CMS = brak bloku; AG `summary` + pełne `body` |
| **Gałąź / HEAD** | `main` |
| **Remote** | `origin` = `git@github.com:waether-the-strm/artgeneracje.git` |
| **Preview** | https://dramaway.netlify.app/ |
| **Studio** | https://dramaway.sanity.studio/ (`readingMethod` = Category; `publication.methods` = Categories; publiczne `publication.format`) |
| **Working tree** | Fala 0+1 + ta iteracja na `main`, bez pusha |
| **Owner Sanity (na razie)** | Jan Mirecki |

---

## Co to jest

Redesign **fundacja.dramaway.pl**. MVP = jedna witryna. Art Generacje = serce. Czytelnia = dział (`drama_teatr`), nie drugi Next. Centrum = link zewnętrzny.

Stack: Next.js 15, Tailwind v4, shadcn/ui, Sanity Studio v6, Netlify. Kod/CMS EN · docs PL.

---

## Stan teraz

Treść fundacji jest w Sanity. Publiczne URL-e z IA działają. **Strona główna ma skład z Figmy plus polish desktopowy** (hero od góry kolumny, pasma pełnych kół przy krawędziach, naprzemienne kolory tytułów, klikalne kafelki) **i świadomy pass mobilny poniżej 1024 px** (sticky header + overlay, hero H1 → kadr w kole → lead, stacked split tekst → kadr 4:5). Nie pixel-perfect. Sprawdzone lokalnie: 375 (H1 w pierwszym ekranie, koło 227 px, brak overflow), 768, desktop (overlay header i portret bleed bez regresji).

- Dataset `production` (`tr2qdg9j`) publiczny. Next bez tokenu. Write token **tylko** `apps/studio/.env`.
- Mapa URL: `apps/web/src/lib/routes.ts` — prefiks IA + `slug.current`. Header: Projekty, **Baza wiedzy** (`/baza-wiedzy`) z drugim poziomem Metody / Czytelnia (desktop disclosure, mobile overlay), O fundacji, Kontakt. `/zespol` poza pierwszym poziomem.
- Listingi: `/projekty` = paleta po hero, aktywne + opcjonalny wiersz Czytelni z `landing-projekty.czytelniaTeaser` (`BlobRow width="wide"`), druga paleta + pasmo, archiwum `density="compact"`. Hero listingu (tytuł, lead, CTA, zdjęcie) = singleton **`landingPage`**; puste pole = blok znika, bez fallbacku z kodu. `/fundacja` = singleton **`aboutPage`**: hero, wartości, zespół (zdjęcie nad opisem, imię bez uppercase), `DotBand` między zespołem a historią i pod dokumentami (`data-no-palette` chowa paletę stopki), paleta między historią a dokumentami, historia `.stack-narrow`, dokumenty `.document-list`. Pusta lista wartości/zespołu/dokumentów = sekcja znika. `/kontakt` = `PageHero` z `page.title` + `page.body`, **`data-no-palette`** (bez kółek marki przed stopką); maile tylko z `person.email`; opcjonalne `heroImage` / CTA na `page`. `/czytelnia` = opcjonalne CTA rodzaju + sekcje kategorii (`listed`); hero z `landing-czytelnia` (puste = brak hero). `/` **nie** listuje siatki projektów ani splitów „13 edycji”.
- `/projekty/[slug]` = `project` albo strona z sekcji projektów. Edycje: `/projekty/[slug]/[edition]` (AG ma 13 unikalnych slugów, w tym trzy `edycja-vi-20xx`). `/[slug]` = reszta (newsy). **AG i inne projekty:** hero lead = `project.summary` (puste = brak leadu). Całe `body` w kolejności z CMS (YouTube zostaje w miejscu, nie jest wyciągane na górę). Lista edycji to kopia posortowana malejąco po `year`. Afterword + `partners` / `sponsors` w `FoldList` (`details`, domyślnie zamknięte); niepuste pole wygrywa z H2 Partnerzy/Sponsorzy.
- `/czytelnia` — rodzaj: CTA tylko gdy ≥2 szuflady mają `listed`. Kategorie: sekcje z magenta Light + `(n)` szare, domyślnie otwarte, hover „zwiń” / „pokaż wszystkie”. Jeśli w danym rodzaju nikt nie ma tagu — płaska lista, bez „Pozostałe”. Publikacja z wieloma tagami jest w wielu sekcjach. GROQ **`listed == true`**. `pnpm patch:publication-listed` **odpalony** (wszystkie `publication` w spisie). Artykuł: autorzy, etykiety `readingMethod`, link PDF (`file`), cover z pierwszego obrazka w `body`. W Sanity **81× `publication`** (import 82 minus śmieć `metody-tzs`) + **6× `readingMethod`**. Dwie osie: `publication.format` (`articles` \| `books` \| `scripts` \| `multimedia`); tagi → `methods`. `pnpm patch:publication-format` **odpalony**. Dump **jest**: `private/dumps/drama_teatr_1787254349.sql.gz`. Hub Bazy: `/baza-wiedzy`. Hosted Studio: po zmianie schematu `pnpm --filter studio run deploy`.
- Chrome UI (etykiety filtrów, „więcej”, puste listy) w `homepage-copy.ts` / `subpage-copy.ts`. Treść editorialna tylko z CMS (`aboutPage`, `landingPage`, `siteSettings.hero` / `homepage`, `project.summary`). **Puste pole = nic na stronie**, bez fallbacku z kodu. Wyjątki chrome: [design/system.md](design/system.md) „Copy chrome vs Figma”. Grupa **Ikony** (`branding`): **SVG jako `image`** (Select w Media widzi m.in. już wrzucony `icon.svg`; strona serwuje surowy SVG z `asset.url`, nie raster CDN) / **ICO jako `file`** z podglądem 32×32 i natywnym pickerem (Media na polach `file` była pusta: 0 `fileAsset`) / PNG light+dark / Apple / 512 / OG. Puste pole = `public/brand`.
- `getResolvedSite()` zwraca `homepage` + `hero` + `footer` (logo, adres, cytat, atrybucja). Puste pole = brak bloku (adres: `footer.address` albo legacy `footerNote`). Featured **H2** to tytuł `project.featured`; magenta etykieta to `homepage.featured.label` — pusta = brak etykiety. Teaser AG na `/` bierze `project.summary`, gdy `homepage.featured.lead` jest puste.
- Newsy na `/`: `getHomepageNews()` — max 3, bez zdjęć, excerpt ~400 znaków. Daty kart: `publishedAt`. Trzeci news `news-placeholder-syrena` jest wypełniaczem z ramki — **do draftu** z adnotacją PL (wykaz: [fundacja-status.md](migration/fundacja-status.md) „Luki vs ramka”).
- `/preview` zostaje inwentarzem CMS.
- Studio: plugin **Media** (`sanity-plugin-media`) — zakładka w menu + źródło przy polach **`image`**. Pola **`file`** (ICO) zostają na wbudowanym pickerze Sanity: Media w trybie plików pokazuje tylko `sanity.fileAsset`, a tych jest zero. Typy `media.tag` / `media.folder` ukryte w desk. Credit line włączony. **Content (góra):** Strona główna (`siteSettings`), Projekty / Baza wiedzy / Czytelnia / Zespół (`landingPage`), Art Generacje (`project`), Metody / Kontakt (`page`), O fundacji (`aboutPage`). Page lista **bez** metody/kontakt. Site settings nadal na dole (ten sam dokument co Strona główna). Portable Text: styl **Termin** (`term`) — blob + krój body, Strong opcjonalnie; lista **Indent** (Tab = głębsze wcięcie); obiekt **Columns** (2 albo 3, stack poniżej `lg`). Quote bez zmian. Deploy: `pnpm --filter studio run deploy` → https://dramaway.sanity.studio/.
- Netlify: `netlify.toml` w repo (`pnpm --filter web build`, `X-Robots-Tag: noindex`). Preview: https://dramaway.netlify.app/.
- Zależności: catalog w `pnpm-workspace.yaml`, lockfile, Dependabot (tydzień), skrypty `pnpm deps:outdated` / `pnpm deps:update`. Kanwa: [guides/dependencies.md](guides/dependencies.md). Next 16 / TS 6+ / ESLint 10 zostają poza automatami.
- Mapa 301 na premierę = **osobne zadanie**, nie teraz.

Pełny kanon migracji: [fundacja-status.md](migration/fundacja-status.md).

### Warstwa wizualna (od 2026-08-30, skład `/` 2026-09-03, polish 2026-09-03, mobile 2026-09-03)

Figma zmierzona i przełożona na mały system. Kanon: [design/system.md](design/system.md), liczby źródłowe: [design/figma-baseline.md](design/figma-baseline.md), decyzja: [ADR-004](decisions/ADR-004-layout-architecture.md). **FileKey:** `Tf7i787tVTBTE4j7LFXXUX` (kopia Pro). Stary `yjpLV44NfMXZtU774I1ZRY` to Untitled na Starterze (20 MCP / mies.) — nie wołać.

- Tokeny w `@theme` (`globals.css`), fonty MuseoModerno + Alexandria przez `next/font`.
- Klasy układu: `.page`, `.split` (pełny viewport, spad zdjęcia do krawędzi okna), `.cols-3`, `.stack`, `.stack-narrow`, `.stack-wide`, `.footer-quote`.
- Copy ramek: `apps/web/src/lib/subpage-copy.ts` (tylko chrome UI — filtry, „więcej”). `PageHero` to ten sam split i kadr w kole co `/`, z overlayem nawigacji od `lg` przez `data-split-hero` (nie `data-home` — to chowa paletę stopki). H1 ma `.hero-title` (sentence case). Edycja: `layout="stack"` (bez foto, overlayu i pasma). Puste zdjęcie hero = brak kadru, slot zostaje (szerokość tekstu jak ze zdjęciem). Puste title/lead/CTA = te elementy znikają; całkowicie pusty hero = brak sekcji. Paleta przed stopką leży w layoucie witryny i chowa się na `/`, `/fundacja` i `/kontakt`. `BlobRow` ma `width`: `page` (domyślnie, pełne `.page`), `narrow` (`.stack-narrow`), `wide` (`.stack-wide` / `--content-wide`); `density="compact"` zostaje dwukolumnowe na pełnym `.page`.
- **Hero / nav:** na `lg+` wrapper `[data-home]` albo `[data-split-hero]` + `:has()` wyjmuje header z pionowego flow i kotwiczy go w lewej kolumnie (szerokość jak `.split-text`). Portret od góry prawej kolumny, spad do prawej krawędzi viewportu; na podstronach kadr jest ograniczony `--hero-media-max`, żeby dół zdjęcia + nachodzące pasmo mieściły się w `100vh`. Brak CMS photo = ten sam slot, bez kadru. Nav **nigdy** na zdjęciu. Poniżej `lg`: sticky pasek (logo + menu), overlay na `sand` z L1 plus Metody/Czytelnia; hero to H1, kadr w kole (albo pusty slot), lead/CTA; stacked `.split` ma tekst, potem kadr inset 4:5 (`--media-split-max`). Od `lg` disclosure pod „Baza wiedzy”: piaskowa chmurka obejmuje rodzica i L2, opcje wjeżdżają transformacją; zamyka się po przejściu na podstronę.
- Pasmo kół: `--dot-size` 82 px (skok 48 px <768), bez `overflow: hidden`, koła z `radial-gradient(circle closest-side)` — bez `closest-side` promień idzie do narożnika kafla i zostaje szczelina. Szerokość rzędu `round(up, 50%, --dot-size)`: rzędy dobijają do krawędzi strony, reszta z zaokrąglenia ląduje na środku pod schodkiem. Ujemny margin nachodzi na krawędzie `Media`; prop `mirror` odbija schodek tam, gdzie zdjęcie jest po lewej.
- Paleta: 7 stykających się kół, `flex-shrink: 0`, wyśrodkowana jako grupa. Przed stopką na podstronach; `/`, `/fundacja` i `/kontakt` ją chowają.
- `/` kolejność: Hero → DotBand → aktualności (H2 AKTUALNOŚCI `text-h2`, tytuł kart H3 `text-h4` i data `text-small` naprzemiennie magenta / navy, max 3, bez zdjęć, szersza rynna) → DotBand → Kim/Metody (`.split-reverse`; oba H2 na `text-h3` + `text-body`) → DotBand `mirror` → PaletteRow → Art Generacje + Czytelnia (`.stack-narrow`, H2 na `text-h3` + `text-body`) → PaletteRow → stopka (lewa: logo + adres; prawa: cytat Boala).
- Sekcje: `home-news.tsx`, `home-about-methods.tsx`, `home-featured-and-reading.tsx`.
- Karty aktualności: `.news-card` trzyma wspólną linię bazową (tytuł na dwie linie, treść zbiera luz), więc rulki CTA są na jednym poziomie niezależnie od długości copy.
- Klikalne kafelki: `.card-link` rozciąga link tytułu na całą kartę, `CtaLink presentational` zamienia zdublowane CTA w `<span aria-hidden>`, `.cta-over` wynosi nad nakładkę CTA prowadzące gdzie indziej. Aktualność → artykuł; Art Generacje → `/projekty/art-generacje` przy CTA na listę `/projekty`; Czytelnia → `/czytelnia`.
- Zdjęcie „Kim jesteśmy” z `homepage.about.image`; puste = brak kadru (slot zostaje), nie `public/about-photo.jpg`.
- Reguła `.cursor/rules/web-ui.mdc` kieruje lżejsze modele do obu dokumentów.

### Świadomie nie zrobione

- Pixel-perfect vs ramka (375 ma wygodny chrome i rytm, nie 1:1)
- Prawdziwe makiety mobilne od designerki — **nie będzie**; kanon z `/` na podstrony
- Wypełnienie pól `siteSettings.homepage` w Studio — **zrobione 2026-09-07** (Kim / Metody / featured / Czytelnia + zdjęcie). Dalsza korekta copy = Studio, nie kod.
- `page.excerpt` na dwóch migracyjnych newsach nadal puste — karty tną `pt::text(body)` (placeholder Syrena ma excerpt z ramki)
- Zdjęcie „Kim jesteśmy” w Sanity — puste, dopóki ktoś nie wgra w `homepage.about.image`
- Pasmo kół pod „Kim jesteśmy?” ma odbity schodek zamiast figmowego (uzgodnione) — powód w [design/system.md](design/system.md)
- `/zespol` listing = `PageHero` + `TeamRow` (małe koła, wszyscy `person`). `/fundacja` pokazuje zespół jako `TeamBios` — skład i kolejność z `aboutPage.team.people`. Profil osoby `/zespol/[slug]` nadal z fazy migracji (`ArticleShell`)
- Timeline „historia fundacji” — sekcja jest; **pusta lista w Studio = brak bloku na stronie**. Nie wklejać lorem `‘11`/`‘12`/`‘13` z bio Aldony; wpisywać prawdziwe daty w `aboutPage.history`.
- Mapa przekierowań (stare aliasy `teatrzaangazowany…` → `/czytelnia/[slug]`)
- News jako osobny typ, newsletter, **formularz kontaktu (osobne zamówienie, jeśli będą chcieli)**, EN
- `person.role` (Drupal `field_funkcja`)
- Ręczna korekta części kotwic (albumy FB ucięte w środku słowa; ucięte bilety Evently)

---

## Następna sesja — start

Ten plik + [fundacja-status.md](migration/fundacja-status.md) + [ustalenia-2026-09-05.md](concept/ustalenia-2026-09-05.md). Nie odtwarzać dumpów rozmów. Nie wołać Figmy bez potrzeby.

**Baza wiedzy ≠ Czytelnia.** Hub `/baza-wiedzy` + Metody `/metody` + Czytelnia `/czytelnia`. Faza 2 kanału Czytelni **zrobiona**. Listing: wszystkie `publication` mają `listed` (`pnpm patch:publication-listed`).

Ramki Figmy podstron są na `main`. Portable Text: **Termin** / **Indent** / **Columns** — po schemacie `pnpm --filter studio run deploy`. Stopka: Studio → Site settings albo **Strona główna** → Stopka.

1. Draft `news-placeholder-syrena` w Studio — jeszcze nie. Profile `/zespol/[slug]` nadal robocze.
2. **Nie odpalaj** `migrate:czytelnia` / `migrate:fundacja` / `migrate:art-generacje` — nadpisze ręczną korektę, **odtworzy** `metody-tzs` i dosłowne `&nbsp;` w `summary`. Format: `pnpm patch:publication-format`. Listing: `pnpm patch:publication-listed` (już odpalony).
3. Pola Studio pod ramki: tabela niżej. `landingPage` i `siteSettings.homepage` **wypełnione** 2026-09-07 (kanon z ramek). Ucięte bilety Evently w newsie „W kolejce do lasu” — ręcznie w Studio (skrypt tylko raportuje).

### Studio — podstrony vs Figma

Ręcznie, nie w kodzie i nie przez `migrate:*`. Grupa `homepage` **wypełniona** 2026-09-07.

| Pole | Stan | Co zrobić |
|------|------|-----------|
| `edition.theme` | puste na 13 edycjach | Wypełnić, żeby H1/wiersze były jak `2026: W kolejce do lasu`, nie dumpowe `Edycja XI - 2026` |
| `edition.summary` | krótsze niż lead z ramki | Dłuższy lead na stronie edycji |
| `edition.gallery` | XI ma 2 kadry | 1 landscape + 3 portrety; pierwsze = landscape |
| `edition.outcomes` | puste | Zostawić — kredyty są w `body` |
| AG `body` | YouTube + akapity | Całe body w kolejności z CMS, przed listą edycji |
| Cover projektu / `/fundacja` | brak kadru pionowego | Wgrać w `aboutPage.image`; puste = hero bez zdjęcia (slot zostaje) |
| Syrenka / Wielogłos | tylko lorem w ramce | **Nie tworzyć** projektów z Figmy |
| Historia fundacji | sekcja w `aboutPage.history` | Wpisz prawdziwe daty; pusta lista = brak bloku. Nie kopiować lorem z Figmy |
| Wartości na `/fundacja` | `aboutPage.methods.values` | Edytować w Studio; pusta lista = brak kół |
| Zespół na `/fundacja` | `aboutPage.team.people` | Kolejność i skład; pusta = brak sekcji |
| Dokumenty | `aboutPage.documents.items` | Strona i/lub PDF i/lub URL. Pusta = brak sekcji |
| `landingPage` (4×) | **wypełnione 2026-09-07** | H1/lead z kanonu ramek; `/projekty` ma CTA do AG i wiersz Czytelni |
| `siteSettings.homepage` | **wypełnione 2026-09-07** | Kim / Metody / featured / Czytelnia + zdjęcie about |

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
pnpm extract:czytelnia        # dump → gitignored JSON
pnpm repair:portable-text     # dry-run encji/linków; `-- --write` zapisuje
pnpm test:repair
pnpm patch:publication-format # legacyDrupal.format → format; nie zastępuje migrate:czytelnia
pnpm patch:publication-listed # listed=true na wszystkich publication
pnpm seed:about-page          # singleton O fundacji, jeśli nie istnieje
pnpm seed:landing-pages       # 4× landingPage (projekty, baza, czytelnia, zespół); puste pola
pnpm --filter studio run deploy   # https://dramaway.sanity.studio/
```

Nie odpalaj ponownie `migrate:fundacja` / `migrate:art-generacje` / `migrate:czytelnia` bez potrzeby — nadpisze ręczną korektę.

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
| `apps/web/src/lib/homepage-copy.ts` | Chrome UI homepage (CTA aktualności) — nie fallback treści |
| `apps/web/src/lib/subpage-copy.ts` | Chrome podstron (filtry, „więcej”) — nie fallback treści |
| `apps/web/src/lib/landing-page.ts` | Resolver singletonów listingów; puste = brak bloku |
| `docs/migration/fundacja-status.md` | Co zmigrowane |
| `apps/web/src/app/(site)/` | Publiczny App Router |
| `apps/web/src/lib/sanity/` | GROQ |
| `apps/studio/` | Sanity Studio (schema + Media) |
| `private/` | Dumpy — poza gitem |
