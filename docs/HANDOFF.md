# Handoff — DramaWay

**Aktualizuj ten plik na bieżąco** na końcu każdej sesji.  
Start: ten plik + `CLAUDE.md` + [migration/fundacja-status.md](migration/fundacja-status.md). Nie odtwarzaj historii z dumpów rozmów.

| | |
|--|--|
| **Ostatnia aktualizacja** | 2026-09-30 — Edycja: galeria `hero-trio` mieści się w oknie (od `lg` duży kadr po lewej i trzy po prawej, poniżej `lg` 1+2) i siedzi w jednej sekcji z treścią. |
| **Gałąź / HEAD** | `main` |
| **Remote** | `origin` = `git@github.com:waether-the-strm/artgeneracje.git` |
| **Preview** | https://dramaway.netlify.app/ |
| **Studio** | https://dramaway.sanity.studio/ (`readingMethod` = Category; `publication.methods` = Categories; publiczne `publication.format`) |
| **Working tree** | Fala 0+1 + archiwum projektów na `main` |
| **Owner Sanity (na razie)** | Jan = project Admin; backup klienta = `admin@dramaway.pl`; redakcja = Editor |

---

## Co to jest

Redesign **fundacja.dramaway.pl**. MVP = jedna witryna. Art Generacje = serce. Czytelnia = dział (`drama_teatr`), nie drugi Next. Centrum = link zewnętrzny.

Stack: Next.js 15, Tailwind v4, shadcn/ui, Sanity Studio v6, Netlify. Kod/CMS EN · docs PL.

---

## Stan teraz

Treść fundacji jest w Sanity. Publiczne URL-e z IA działają. **Strona główna ma skład z Figmy plus polish desktopowy** (hero od góry kolumny, pasma pełnych kół przy krawędziach, naprzemienne kolory tytułów, klikalne kafelki) **i świadomy pass mobilny poniżej 1024 px** (sticky header + overlay, hero H1 → kadr w kole → lead, stacked split tekst → kadr 4:5). Nie pixel-perfect. Sprawdzone lokalnie: 375 (H1 w pierwszym ekranie, koło 227 px, brak overflow), 768, desktop (overlay header i portret bleed bez regresji).

- Dataset `production` (`tr2qdg9j`) publiczny. Next bez tokenu. Write token **tylko** `apps/studio/.env`.
- Mapa URL: `apps/web/src/lib/routes.ts`. Prefiks bierze się z typu dokumentu: `project` → `/projekty/{slug}`, `person` → `/zespol/{slug}`, `publication` → `/czytelnia/{slug}`, `page` i `news` → `/{slug}`. Stary przedrostek `aktualnosc-` na stronie nadal się obcina. Menu tylko linkuje, nie składa adresu. Stary `/fundacja/{slug}` i `/projekty/{slug}` dla strony, która nie jest projektem, przekierowuje na `/{slug}`. Header czyta `siteSettings.navigation` (etykieta + strona z CMS albo adres, jeden poziom dzieci). Pusta lista = menu wbudowane: Projekty, **Baza wiedzy** (`/baza-wiedzy`, zwykła strona z opisem metod) z dzieckiem Czytelnia (desktop disclosure, mobile overlay), O fundacji, Kontakt. `/metody` przekierowuje na `/baza-wiedzy`. `/zespol` poza menu, dopóki ktoś go nie doda. Seed: `pnpm seed:navigation` (nie nadpisuje istniejącej listy). Hosted Studio widzi grupę Nawigacja po `pnpm --filter studio run deploy`.
- Listingi: `/projekty` = paleta po hero, aktywne + opcjonalny wiersz Czytelni (`showCzytelnia`; copy z `landing-czytelnia`), druga paleta + pasmo, archiwum `density="compact"` (magenta „Zakończone projekty”, wycinek 3 linie, lekki offset prawej kolumny). **Archiwum w CMS (2026-09-07):** Teatr Codzienny ma 6 edycji + 20 rezultatów spektakli; TO MI GRA i BOAL bez fałszywych edycji (FoldList / Columns); Wielogłos jest `project` ze strony leftover `projekty-zakonczone`. Hero listingu (tytuł, lead, CTA, zdjęcie) = singleton **`landingPage`**; puste pole = blok znika, bez fallbacku z kodu. `/fundacja` = singleton **`aboutPage`**: hero, wartości (poniżej `lg` jeden przewijany rząd), zespół/zarząd (zdjęcie nad opisem, imię bez uppercase, opcjonalny `team.body` Portable Text), `DotBand` między zespołem a historią i pod dokumentami (`data-no-palette` chowa paletę stopki), paleta między historią a dokumentami, historia `.stack-narrow` (lead = Portable Text), dokumenty `.document-list`. Pusta lista wartości/dokumentów = sekcja znika; zespół znika gdy puste są i osoby, i `team.body`. `/kontakt` = `PageHero` z `page.title` + `page.body`, **`data-no-palette`** (bez kółek marki przed stopką); maile tylko z `person.email`; opcjonalne `heroImage` / CTA na `page`. `/czytelnia` = opcjonalne CTA rodzaju + sekcje kategorii (`listed`); hero z `landing-czytelnia` (puste = brak hero). `/` **nie** listuje siatki projektów ani splitów „13 edycji”.
- `/projekty/[slug]` = tylko `project`. Strona `page` o tym samym slugu przekierowuje na `/{slug}`. Wydawnictwo jest w korzeniu: `/wydawnictwo`. Pusty duplikat `wydawnictwo-1` jest szkicem. Edycje: `/projekty/[slug]/[edition]` (AG ma 13 unikalnych slugów, w tym trzy `edycja-vi-20xx`; Teatr Codzienny: `edycja-2012` … `edycja-2017`). `/[slug]` = reszta (newsy). **AG i inne projekty:** hero lead = `project.summary` (puste = brak leadu). Całe `body` w kolejności z CMS (YouTube zostaje w miejscu, nie jest wyciągane na górę). Lista edycji to kopia posortowana malejąco po `year`. Afterword + `partners` / `sponsors` w `FoldList` (`details`, domyślnie zamknięte); niepuste pole wygrywa z H2 Partnerzy/Sponsorzy. **Galerie:** `edition.gallery` i sąsiednie obrazy w Portable Text to mozaika (max. 4 kafelki, `--gallery-gap`, przepisy `one` / `pair` / `hero-pair` / `hero-trio`). `hero-trio` od `lg` to jeden kadr po lewej i trzy po prawej, wysokość mieści się w oknie (`70vh`); poniżej `lg` zostaje 1+2. Na edycji galeria i treść są w jednej sekcji. Reszta i kadry ze krótszym bokiem < 400 px (z `asset._ref`) tylko w lightboxie (`yet-another-react-lightbox` + Zoom). Brak nowego typu w Studio. Pusta galeria = brak bloku.
- `/czytelnia` — rodzaj: CTA tylko gdy ≥2 szuflady mają `listed` (`?rodzaj=`). Kategorie: sekcje z magenta Light + `(n)` szare. Nagłówek zwija i rozwija swoją sekcję (hover „zwiń” / „pokaż wszystkie”). Wejście z `?kategoria=` (slug `readingMethod`, np. `teatr-forum`) otwiera tylko tę jedną; adres trzyma parametr, dopóki otwarta jest dokładnie jedna. Chip rodzaju zachowuje `kategoria`. Jeśli w danym rodzaju nikt nie ma tagu — płaska lista, bez „Pozostałe”. Publikacja z wieloma tagami jest w wielu sekcjach. GROQ **`listed == true`**. `pnpm patch:publication-listed` **odpalony** (wszystkie `publication` w spisie). Artykuł albo scenariusz z PDF: wiersz otwiera plik („pobierz PDF”), a `/czytelnia/{slug}` robi 307 na ten plik i nie wchodzi do sitemapy. Książka, multimedia, YouTube w `body` (także w Columns) albo brak pliku: podstrona i „więcej”. Okładka kółka na spisie = pierwszy obrazek w `body` (hotspot). Na podstronie: autorzy, etykiety `readingMethod`, link PDF (`file`). W Sanity **81× `publication`** (import 82 minus śmieć `metody-tzs`) + **6× `readingMethod`**. Dwie osie: `publication.format` (`articles` \| `books` \| `scripts` \| `multimedia`); tagi → `methods`. `pnpm patch:publication-format` **odpalony**. Dump **jest**: `private/dumps/drama_teatr_1787254349.sql.gz`. Baza wiedzy: `/baza-wiedzy` (dokument `page`, opis metod). Hosted Studio: po zmianie schematu `pnpm --filter studio run deploy`.
- Chrome UI (etykiety filtrów, „więcej”, puste listy) w `homepage-copy.ts` / `subpage-copy.ts`. Treść editorialna tylko z CMS (`aboutPage`, `landingPage`, `siteSettings.hero` / `homepage`, `project.summary`). **Puste pole = nic na stronie**, bez fallbacku z kodu. Wyjątki chrome: [design/system.md](design/system.md) „Copy chrome vs Figma”. Grupa **Ikony** (`branding`): **SVG jako `image`** (Select w Media widzi m.in. już wrzucony `icon.svg`; strona serwuje surowy SVG z `asset.url`, nie raster CDN) / **ICO jako `file`** z podglądem 32×32 i natywnym pickerem (Media na polach `file` była pusta: 0 `fileAsset`) / PNG light+dark / Apple / 512 / OG. Puste pole = `public/brand`.
- `getResolvedSite()` zwraca `homepageSections` + `hero` + `footer` (logo, adres, cytat, atrybucja). Puste pole = brak bloku (adres: `footer.address` albo legacy `footerNote`). Sekcje strony głównej to tablica `newsFeedModule` (trzy najnowsze `news`) i `contentModule` (do 3 kafelków, opcjonalne zdjęcie). Ten sam zestaw pól jest na dokumencie `page` (`sections` nad `body`). Kafelek wskazuje dokument (`page`, `project`, `publication`, `landingPage`, `aboutPage`, `person`) albo ścieżkę; puste tytuł/opis/etykieta biorą się z dokumentu. Cały kafelek to jeden link. Układ bez zdjęcia: `grid` albo `list`. Ze zdjęciem strona kadru lewo/prawo liczy się sama (pierwszy moduł ze zdjęciem = lewo). Seed starych slotów: `pnpm seed:homepage-sections` (nie nadpisuje niepustej listy).
- Newsy na `/`: sekcja `newsFeedModule` — domyślnie 3 najnowsze dokumenty `news` (data publikacji, inaczej `_createdAt`). W Studio typ nazywa się **News**, obok Project / Person / Page. Pola: tytuł, slug, data, zajawka, treść. CTA puste = „czytaj więcej” na podstronę newsa. Inny adres (ścieżka albo https) wymaga własnej etykiety; tytuł karty zostaje linkiem do artykułu. W sekcji: limit (1–12) i rodzaje (News, strony, osoby, projekty, publikacje). `pnpm migrate:news` przenosi stare `page` z przedrostkiem `aktualnosc-` (nowy `_id`, bo Sanity nie zmienia typu przy starym; ucina przedrostek i `[Aktualność]` w tytule). Trzeci news `news-syrena` jest wypełniaczem z ramki — **do draftu** z adnotacją PL (wykaz: [fundacja-status.md](migration/fundacja-status.md) „Luki vs ramka”).
- Skip-link (`Przejdź do treści`) i strony 404 / błąd — **są** w kodzie (chrome w `subpage-copy.ts`).
- Studio: plugin **Media** (`sanity-plugin-media`) — zakładka w menu + źródło przy polach **`image`**. Pola **`file`** (ICO) zostają na wbudowanym pickerze Sanity: Media w trybie plików pokazuje tylko `sanity.fileAsset`, a tych jest zero. Typy `media.tag` / `media.folder` ukryte w desk. Credit line włączony. **Content (góra):** Strona główna zostaje na stałe (`siteSettings`). Dalej skróty z `siteSettings.navigation` (ta sama lista co menu witryny, z jednym poziomem dzieci). Pusta lista = dotychczasowe skróty: Projekty / Czytelnia / Zespół (`landingPage`), Art Generacje (`project`), Baza wiedzy / Kontakt (`page`), O fundacji (`aboutPage`). Lista Page ukrywa strony, które są już skrótem. Site settings nadal na dole (ten sam dokument co Strona główna). Portable Text: styl **Termin** (`term`) — blob + krój body, Strong opcjonalnie; lista **Indent** (Tab = głębsze wcięcie); lista **Roles** (`roster`) — wiersze `rola: imiona`, render jako `.pt-roster` (lekka karta); obiekt **Columns** (2 albo 3, stack poniżej `lg`); obiekt **Button** (`ctaButton`) — zielone CTA w osobnym wierszu, do lewej, z wcięciem 0–3 stopnie jak lista Indent; cel to dokument, plik albo adres, a `#` i `?` są w zwiniętym Zaawansowane. Quote bez zmian. Nie zgadywać listy ról z dwukropków w prozie — redaktor zaznacza Roles w toolbarze. Deploy: `pnpm --filter studio run deploy` → https://dramaway.sanity.studio/.
- **Publikacja w Studio:** Next trzyma HTML do 60 s (ISR). Żeby nie czekać: webhook Sanity → `POST /api/revalidate` (`revalidateTag` + `revalidatePath`). Koszt ≈ 0 (webhook Sanity darmowy, kilka wywołań Netlify dziennie). **Do skonfigurowania po deployu** (nie da się z repo):
  1. Losowy sekret (np. `openssl rand -hex 24`).
  2. Netlify → env `SANITY_REVALIDATE_SECRET` (server, nie `NEXT_PUBLIC_`). Przebudowa.
  3. Sanity Manage → API → Webhooks: URL `https://dramaway.netlify.app/api/revalidate`, header `Authorization: Bearer <sekret>`, dataset `production`, trigger create/update/delete na opublikowanych. Po cutoverze ten sam hook na docelową domenę.
  Fallback 60 s zostaje, gdy hook nie dojdzie.
- Netlify: `netlify.toml` w repo (`pnpm --filter web build`, `X-Robots-Tag: noindex` na static). Preview: https://dramaway.netlify.app/. Next: `metadata.robots` + `headers()` (CSP, noindex dopóki `NEXT_PUBLIC_SITE_INDEX` nie jest `true`).
- **Indeksacja (cutover):** w Netlify `NEXT_PUBLIC_SITE_URL=https://fundacja.dramaway.pl` i `NEXT_PUBLIC_SITE_INDEX=true` — wtedy robots/sitemap/canonical żyją. Do tego czasu Google ma nie indeksować roboczego netlify.app.
- CI: `.github/workflows/ci.yml` — `pnpm install`, lint, `web` build, `test:repair` / `test:archive-projects` / `test:web`.
- Zależności: catalog w `pnpm-workspace.yaml`, lockfile, Dependabot (tydzień), skrypty `pnpm deps:outdated` / `pnpm deps:update`. Kanwa: [guides/dependencies.md](guides/dependencies.md). Next 16 / TS 6+ / ESLint 10 zostają poza automatami.
- Mapa 301 na premierę = **osobne zadanie tuż przed DNS**, nie teraz. Kolejność przekazania kont i dnia domeny: [guides/cutover.md](guides/cutover.md). Mail/checklista dla Fundacji (RODO + analityka): [guides/cutover-foundation.md](guides/cutover-foundation.md). Manual redakcji: [redakcja/README.md](redakcja/README.md).

Pełny kanon migracji: [fundacja-status.md](migration/fundacja-status.md). Role i przekazanie: [guides/sanity-roles.md](guides/sanity-roles.md).

### Checklista premiery / cutover

Pełna kolejność (skrzynka, GitHub, Netlify, Sanity/NGO, legal, DNS): [guides/cutover.md](guides/cutover.md).

Preview (`dramaway.netlify.app`) **zostaje noindex** (`metadata.robots`, `X-Robots-Tag`, `robots.ts` Disallow `/`, `netlify.toml`). Indeksacji nie włączamy, dopóki domena nie jest docelowa.

Przy przejęciu `fundacja.dramaway.pl`:

- **301** — stary Drupal (`node/N`, aliasy `teatrzaangazowany…`, landingi edycji) → trasy z `apps/web/src/lib/routes.ts` / [ia.md](concept/ia.md). Mapa = osobne zadanie; nie zgadywać z palca. Sitemap indeksujący = ta sama fala (teraz `robots.ts` celowo nie wskazuje sitemapy).
- **Zdjąć noindex** — Netlify env `NEXT_PUBLIC_SITE_INDEX=true` + `NEXT_PUBLIC_SITE_URL=https://fundacja.dramaway.pl` (przebudowa). Potem `robots.ts` wpuszcza crawlera i wskazuje sitemap; `layout.tsx` / `next.config.ts` / `netlify.toml` `[[headers]]`. Świadomie, nie „przy okazji”.
- **Legal / RODO** — [guides/cutover-foundation.md](guides/cutover-foundation.md) (mail + checklista). Treści pisze Fundacja.
- **Treść** — `news-syrena` → draft; puste hero/cover.
- **Studio** — `pnpm --filter studio run deploy` po ostatniej zmianie schematu.
- **Netlify env** — `NEXT_PUBLIC_SANITY_*`, `SANITY_REVALIDATE_SECRET` (webhook, nie write). **Brak** `SANITY_API_WRITE_TOKEN`. CORS Studio: origin produkcji w Sanity Manage.
- **DNS / TLS** + smoke po wgraniu `_redirects`.

Rollback: poprzedni deploy Netlify + snapshot `private/sanity-snapshots/production-2026-09-07-pre-client.tar.gz`.


### Sanity — role i przekazanie (2026-09-07)

Billing jest w **organizacji**, nie w project Admin. Kanon: [guides/sanity-roles.md](guides/sanity-roles.md).

- Jan zostaje **project Administrator**; później ewentualnie **Developer**, gdy ktoś drugi będzie wspierać (też Dev).
- `admin@dramaway.pl` — świadomy **Admin** po stronie klienta, tylko backup pełnego zarządzania projektem, nie codzienny CMS.
- Osoby edytujące treści — **Editor** (żeby nie ruszyć tokenów / CORS / datasetu).
- Contributor / Viewer / Blueprints editor — na start nie. Viewer = podgląd (darmowe miejsce). Contributor = szkice bez publikacji.
- Dane billingowe doda klient przy **migracji serwisu** (org-admin).
- Snapshot treści przed startem redakcji: `private/sanity-snapshots/production-2026-09-07-pre-client.tar.gz` (chmurowa kopia datasetu nie jest na planie) + tag `snapshot-2026-09-07-pre-client`.

### Warstwa wizualna (od 2026-08-30, skład `/` 2026-09-03, polish 2026-09-03, mobile 2026-09-03)

Figma zmierzona i przełożona na mały system. Kanon: [design/system.md](design/system.md), liczby źródłowe: [design/figma-baseline.md](design/figma-baseline.md), decyzja: [ADR-004](decisions/ADR-004-layout-architecture.md). **FileKey:** `Tf7i787tVTBTE4j7LFXXUX` (kopia Pro). Stary `yjpLV44NfMXZtU774I1ZRY` to Untitled na Starterze (20 MCP / mies.) — nie wołać.

- Tokeny w `@theme` (`globals.css`), fonty MuseoModerno + Alexandria przez `next/font`.
- Klasy układu: `.page`, `.split` (pełny viewport, spad zdjęcia do krawędzi okna), `.cols-3`, `.stack`, `.stack-narrow`, `.stack-wide`, `.footer-quote`.
- Copy ramek: `apps/web/src/lib/subpage-copy.ts` (tylko chrome UI — filtry, „więcej”). `PageHero` to ten sam split co `/` (od `lg` kadr do wysokości tekstu, poniżej `lg` koło), z overlayem nawigacji od `lg` przez `data-split-hero` (nie `data-home` — to chowa paletę stopki). H1 ma `.hero-title` (sentence case). Edycja: `layout="stack"` (bez foto, overlayu i pasma). Puste zdjęcie hero = brak kadru, slot zostaje (szerokość tekstu jak ze zdjęciem). Puste title/lead/CTA = te elementy znikają; całkowicie pusty hero = brak sekcji. Paleta przed stopką leży w layoucie witryny i chowa się na `/`, `/fundacja` i `/kontakt`. `BlobRow` ma `width`: `page` (domyślnie, pełne `.page`), `narrow` (`.stack-narrow`), `wide` (`.measure`, 62ch). Te kolumny, body w `.measure` i hero tekstowy edycji trzymają lewą krawędź `.page` — luz zostaje po prawej. `density="compact"` dwukolumnowo od `lg`, etykieta magenta zdaniowa, offset prawej kolumny.
- **Hero / nav:** na `lg+` wrapper `[data-home]` albo `[data-split-hero]` + `:has()` wyjmuje header z pionowego flow i kotwiczy go w lewej kolumnie (szerokość jak `.split-text`). Zdjęcie od góry prawej kolumny, spad do prawej krawędzi viewportu. Od `lg` wysokość sekcji bierze się z tekstu (homepage i każdy `PageHero`); kadr wypełnia tę wysokość (`object-fit: cover` + hotspot), bez proporcji 481:823 i bez limitu `100vh`. Brak CMS photo = ten sam slot, bez kadru. Nav **nigdy** na zdjęciu. Poniżej `lg`: sticky pasek (logo + menu), overlay na `sand` z L1 plus Czytelnia pod Bazą wiedzy; hero to H1, kadr w kole (albo pusty slot), lead/CTA; stacked `.split` ma tekst, potem kadr inset 4:5 (`--media-split-max`). Od `lg` disclosure pod „Baza wiedzy”: piaskowa chmurka obejmuje rodzica i L2, opcje wjeżdżają transformacją; zamyka się po przejściu na podstronę.
- Pasmo kół: `--dot-size` 82 px (skok 48 px <768), bez `overflow: hidden`, koła z `radial-gradient(circle closest-side)` — bez `closest-side` promień idzie do narożnika kafla i zostaje szczelina. Szerokość rzędu `round(up, 50%, --dot-size)`: rzędy dobijają do krawędzi strony, reszta z zaokrąglenia ląduje na środku pod schodkiem. Ujemny margin nachodzi na krawędzie `Media`; prop `mirror` odbija schodek tam, gdzie zdjęcie jest po lewej.
- Paleta: 7 stykających się kół, `flex-shrink: 0`, wyśrodkowana jako grupa. Przed stopką na podstronach; `/`, `/fundacja` i `/kontakt` ją chowają.
- `/` kolejność zależy od `siteSettings.homepageSections` (pod hero): po hero zawsze `DotBand`; między sekcjami zwykły `DotBand` (lewe kółka niżej niż prawe; przed pierwszą listą bez zdjęcia pasmo odpada, wchodzi paleta); paleta przed pierwszą sekcją `list` i przed stopką. Siatka = `.cols-3`, lista = `.stack-narrow`, zdjęcie = `.content-split` (połowa viewportu minus `--module-center-inset`, krawędzie na osi kółek; paleta na końcu `/` też — dół kadru na osi kół, rząd nad zdjęciem). Jeden kafelek przy zdjęciu jest wyśrodkowany w pionie; dwa lub trzy skracają opis do 3 linii.
- Sekcje: `content-modules.tsx`, `content-tile.tsx`, `home-news.tsx`.
- Karty aktualności: `.news-card` trzyma wspólną linię bazową (tytuł na dwie linie, treść zbiera luz), więc rulki CTA są na jednym poziomie niezależnie od długości copy.
- Klikalne kafelki: `.card-link` rozciąga link tytułu na całą kartę, `CtaLink presentational` zamienia etykietę w `<span aria-hidden>`. Jeden kafelek = jeden adres.
- Zdjęcie modułu ze zdjęciem jest na `contentModule.image`. Puste = sam tekst (siatka albo lista), nie `public/about-photo.jpg`.
- Reguła `.cursor/rules/web-ui.mdc` kieruje lżejsze modele do obu dokumentów.

### Świadomie nie zrobione

- Pixel-perfect vs ramka (375 ma wygodny chrome i rytm, nie 1:1)
- Prawdziwe makiety mobilne od designerki — **nie będzie**; kanon z `/` na podstrony
- Wypełnienie sekcji `siteSettings.homepageSections` — **zrobione 2026-09-24** (`pnpm seed:homepage-sections`: aktualności, Kim/Metody ze zdjęciem, lista Art Generacje + Czytelnia). Dalsza korekta = Studio, nie kod.
- `page.excerpt` na dwóch migracyjnych newsach nadal puste — karty tną `pt::text(body)` (placeholder Syrena ma excerpt z ramki)
- Zdjęcie modułu na `/` — puste, dopóki redakcja nie wgra go w `contentModule.image`
- Pasmo kół pod „Kim jesteśmy?” ma odbity schodek zamiast figmowego (uzgodnione) — powód w [design/system.md](design/system.md)
- `/zespol` listing = `PageHero` + `TeamRow` (małe koła, wszyscy `person`). `/fundacja` pokazuje zespół jako `TeamBios` — nagłówek + skład z `aboutPage.team.people`, opcjonalny Portable Text `team.body` pod zdjęciami. Profil osoby `/zespol/[slug]` nadal z fazy migracji (`ArticleShell`)
- Timeline „historia fundacji” — sekcja jest; **pusta lista w Studio = brak bloku na stronie**. Lead nad osią to Portable Text (`history.lead`). Nie wklejać lorem `‘11`/`‘12`/`‘13` z bio Aldony; wpisywać prawdziwe daty w `aboutPage.history`.
- Mapa przekierowań (stare aliasy `teatrzaangazowany…` → `/czytelnia/[slug]`)
- News jako osobny typ, newsletter, **formularz kontaktu (osobne zamówienie, jeśli będą chcieli)**, EN
- `person.role` (Drupal `field_funkcja`)
- Ręczna korekta części kotwic (albumy FB ucięte w środku słowa; ucięte bilety Evently)

---

## Następna sesja — start

Ten plik + [fundacja-status.md](migration/fundacja-status.md) + [ustalenia-2026-09-05.md](concept/ustalenia-2026-09-05.md). Nie odtwarzać dumpów rozmów. Nie wołać Figmy bez potrzeby.

### Dokończyć kadry manuala (Jan)

Spis braków: [redakcja/screeny.md](redakcja/screeny.md). Wstawić plik do `docs/redakcja/img/` i obrazek pod znacznikiem `<!-- screen: ... -->` w podanym pliku. Nie naciskać **Publish**.

Gdzie się logować:

- **Reszta kadrów ze Studia** — lokalnie, już zalogowane: [http://localhost:3333](http://localhost:3333) (`pnpm dev:studio`). Ten sam dataset `production` co hosted Studio. Hosted, gdy lokalne nie wstanie: [https://dramaway.sanity.studio/](https://dramaway.sanity.studio/).
- **`studio-adres` (ekran logowania)** — okno prywatne na [https://dramaway.sanity.studio/](https://dramaway.sanity.studio/) **zanim** wpiszesz hasło. Nie wylogowywać zwykłej sesji. W kadrze ma być pasek adresu Studia, nie strony fundacji.
- **`role-zaproszenie`** — to nie Studio. [https://www.sanity.io/manage](https://www.sanity.io/manage) → projekt Dramaway (`tr2qdg9j`) → członkowie. W kadrze Editor przy redakcji i Administrator przy `admin@dramaway.pl`.

Zostało: `studio-adres`, `role-zaproszenie`, `studio-publish`, `studio-obraz`, `studio-link`, `strony-skroty`, `strony-listing`, `czytelnia-dokument`, `czytelnia-okladka`, `fundacja-dokumenty`, `tekst-toolbar`, `tekst-termin`, `tekst-indent`, `tekst-columns`, `tekst-button`.

Cutover kont (skrzynka, GitHub, Netlify, Sanity/NGO, domena) jest opisany, nieodpalony: [guides/cutover.md](guides/cutover.md).

**Baza wiedzy ≠ Czytelnia.** `/baza-wiedzy` to strona z opisem metod. Czytelnia zostaje `/czytelnia` (dziecko w menu). `/metody` przekierowuje na `/baza-wiedzy`. Faza 2 kanału Czytelni **zrobiona**. Listing: wszystkie `publication` mają `listed` (`pnpm patch:publication-listed`).

Ramki Figmy podstron są na `main`. Portable Text: **Termin** / **Indent** / **Roles** / **Columns** / **Button** — po schemacie `pnpm --filter studio run deploy`. Stopka: Studio → Site settings albo **Strona główna** → Stopka.

1. Draft `news-syrena` w Studio — jeszcze nie. Profile `/zespol/[slug]` nadal robocze.
2. **Nie odpalaj** `migrate:czytelnia` / `migrate:fundacja` / `migrate:art-generacje` — nadpisze ręczną korektę, **odtworzy** `metody-tzs` i dosłowne `&nbsp;` w `summary`. `migrate:art-generacje` pomija archiwum, które już ma edycje albo afterword. Format: `pnpm patch:publication-format`. Listing: `pnpm patch:publication-listed` (już odpalony). Archiwum projektów: `pnpm patch:archive-projects` (już odpalony; `-- --force` przebudowuje z leftover `page`). Copy `/fundacja` (Zarząd + Zespół jako Roles / Społeczność, migracja `history.lead`): `pnpm patch:about-copy` **odpalony**.
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
| Historia fundacji | sekcja w `aboutPage.history` | Lead = Portable Text; wpisy z datami. Pusta lista = brak bloku. Nie kopiować lorem z Figmy |
| Wartości na `/fundacja` | `aboutPage.methods.values` | Edytować w Studio; pusta lista = brak kół. Mobile: jeden przewijany rząd |
| Zespół na `/fundacja` | `aboutPage.team` | Nagłówek (Zarząd) + osoby + `team.body` (Zespół / Społeczność). Puste osoby i puste body = brak sekcji |
| Dokumenty | `aboutPage.documents.items` | Strona i/lub PDF i/lub URL. Pusta = brak sekcji |
| `landingPage` (3×) | **wypełnione 2026-09-07** | H1/lead z kanonu ramek na `/projekty`, `/czytelnia`, `/zespol`. `/projekty` ma CTA do AG i włącznik Czytelni (`showCzytelnia`; copy z dokumentu Czytelnia). `/baza-wiedzy` od 2026-09-29 jest `page`, nie landingiem |
| `siteSettings.homepageSections` | **wypełnione 2026-09-24** | Aktualności, Kim/Metody ze zdjęciem, lista Art Generacje + Czytelnia. Seed nie nadpisuje niepustej listy. |

`pnpm dev:all` jeśli porty wolne.

### Decyzje z makiet (2026-09-05) — zamknięte

Pełny zapis + most do planu Czytelni: **[concept/ustalenia-2026-09-05.md](concept/ustalenia-2026-09-05.md)**. IA: [concept/ia.md](concept/ia.md). Makieta: [design/wireframes.html](design/wireframes.html).

- **Baza wiedzy** = strona `/baza-wiedzy` (opis metod). Jedno dziecko w menu: **Czytelnia** `/czytelnia`. Ustalenie 2026-09-05 (hub + osobne `/metody`) zastąpione 2026-09-29.
- **Czytelnia nie jest `project`.** Prezentacja na `/projekty` dozwolona; Sanity = `publication`.
- **Wiersz z plamą** = jedna sekcja, tablica `{title, lead, href}` — `/projekty`, edycje AG, Czytelnia.
- **Edycja AG:** `/projekty/art-generacje/[slug]`; w CMS obiekt na `project`.
- **Listing = CMS.** Luki: [fundacja-status.md](migration/fundacja-status.md). Placeholder Syrena → draft (jeszcze nie zrobione).
- **Kontakt bez formularza.** Formularz = osobne zamówienie później.
- **Mobile bez ramek.** Kanon z `/`.
- **Kolejność UI:** cegły (hero podstrony + wiersz) → `/projekty` → AG + URL edycji → Baza (`/baza-wiedzy` + `/czytelnia`) → `/fundacja` → `/kontakt`.

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
pnpm test:archive-projects
pnpm test:web                 # allowlista URL + YouTube + menu z CMS
pnpm patch:publication-format # legacyDrupal.format → format; nie zastępuje migrate:czytelnia
pnpm seed:about-page          # singleton O fundacji, jeśli nie istnieje
pnpm seed:landing-pages       # 4× landingPage (projekty, baza, czytelnia, zespół); puste pola
pnpm seed:navigation          # pusta siteSettings.navigation → obecne menu; nie nadpisuje listy
pnpm --filter studio run deploy   # https://dramaway.sanity.studio/
# snapshot CMS: apps/studio → sanity datasets export production ../../private/sanity-snapshots/….tar.gz
```

Nie odpalaj ponownie `migrate:fundacja` / `migrate:art-generacje` / `migrate:czytelnia` bez potrzeby — nadpisze ręczną korektę. Archiwum z edycjami: `migrate:art-generacje` je pominie; przebudowa to `pnpm patch:archive-projects -- --force`.

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
| `docs/guides/sanity-roles.md` | Role Sanity / przekazanie |
| `docs/guides/cutover.md` | Przekazanie kont i dzień domeny |
| `docs/redakcja/README.md` | Manual redakcji (osoby nietechniczne) |
| `docs/migration/fundacja-status.md` | Co zmigrowane |
| `apps/web/src/app/(site)/` | Publiczny App Router |
| `apps/web/src/lib/sanity/` | GROQ |
| `apps/studio/` | Sanity Studio (schema + Media) |
| `private/` | Dumpy — poza gitem |
