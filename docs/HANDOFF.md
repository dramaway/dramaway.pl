# Handoff — DramaWay

**Aktualizuj ten plik na bieżąco** na końcu każdej sesji.  
Start: ten plik + `CLAUDE.md` + [migration/fundacja-status.md](migration/fundacja-status.md). Nie odtwarzaj historii z dumpów rozmów.

| | |
|--|--|
| **Ostatnia aktualizacja** | 2026-10-28 — Na O fundacji kółka wartości unoszą się przy najechaniu; na desktopie pozostają w jednym rzędzie z dotychczasowym dopasowaniem etykiet, a na wąskim ekranie w pionie układają się w trzy rzędy 3–3–2 (drugi przesunięty, ostatni zaczyna się tam, gdzie pierwszy). Na mobile etykiety skalują się z kołem i nie dzielą wyrazów. Animacja respektuje `prefers-reduced-motion`. Wcześniej: na stronie Baza wiedzy dodano duże pasma schodkowych kół między esejem, sekcją „Polecane” i pełną biblioteką, w tym samym piaskowym kolorze co pozostałe pasma; odstęp pod nagłówkiem „Polecane” odpowiada odstępowi między tytułem publikacji a opisem. Na stronach edycji Teatru Codziennego zmniejszono biały odstęp przed sekcją „Rezultaty”. Baza wiedzy ma sekcję „Polecane” nad pełną biblioteką. Redakcja wybiera i układa publikacje w polu `featuredPublications` strony Baza wiedzy; wybrane pozycje zostają również w pełnej bibliotece. O fundacji ma edytowalną galerię zdjęć między Społecznością a Historią; pusta lista chowa galerię, pasmo kropek przed Historią usunięto, odstęp galerii od sąsiednich tekstów zmniejszono o połowę, a szare linie rozdzielające bloki Zespołu usunięto. Miniaturki w listingach edycji Art Generacje i Czytelni są poziomymi prostokątami 4:3 z zaokrąglonymi rogami, po lewej stronie tekstu. Nagłówki „Wszystkie odsłony Art Generacji” i „Pełna biblioteka” mają rozmiar H2. W Czytelni okładka to pierwszy obrazek w `body`, a bez zdjęcia zostaje piaskowy prostokąt; usunięto nakładki kolorystyczne i przesuwanie okładki pod tekst. Wcześniej: na mobile ostatni wpis osi historii rozwija się naturalnie, a po pełnym rozwinięciu nie zwija dalej w dół. Z listy Art Generacje usunięto paletę kolorowych kółek; palety usunięto też ze stron Projekty i O fundacji, pozostawiając piaskowe pasma kropek. Miniatury YouTube pokazują oryginalne kolory bez beżowego filtra; redakcja może ustawić własny cover w każdym bloku YouTube. Art Generacje może mieć edytowalny nagłówek nad listingiem edycji (`editionsHeading`). Produkcyjny build web uruchamia `next build` bez Turbopacka. Galeria `hero-trio` wypełnia szerokość rodzica. Studio korzysta z Sanity 6.18.0. Na mobile w pionie kółka można przeciągać palcem (przyciąganie, kolizje, odbicia od krawędzi). |
| **Gałąź / HEAD** | `fix/knowledge-page-dot-color` |
| **Zmiana bieżąca** | Newsletter w stopce nie nachodzi na pasmo kropek przy powiększeniu; poniżej 80rem desktopowego widoku układa się pionowo w prawej kolumnie, w białym obszarze między kołami. Zajawki w listingach są wyświetlane w całości i nie zależą od progów szerokości; skrót bio w kartach na O fundacji jest ograniczony do 3 linii. Kółka wartości na stronie O fundacji unoszą się przy najechaniu; na wąskim ekranie w pionie układają się w trzy rzędy 3–3–2 i można je przeciągać palcem (przyciąganie, kolizje, odbicia od krawędzi). |
| **Remote** | `origin` = `git@github.com:dramaway/dramaway.pl.git` (publiczne repo na koncie Fundacji; ruleset „Ochrona main”: tylko PR z zielonym `check`). Stary fork wykonawcy zarchiwizowany. |
| **Netlify** | Projekt przeniesiony do teamu `admin@dramaway.pl`, adres bez zmian. Env: `NEXT_PUBLIC_SANITY_*`, `NEXT_PUBLIC_SITE_URL`, `SANITY_REVALIDATE_SECRET` (tylko Production). |
| **Hasła** | Bitwarden Fundacji (bitwarden.eu): hasła i kody odzyskiwania kont. Fundacja dostaje master password. |
| **Preview** | https://dramaway.netlify.app/ |
| **Studio** | https://dramaway.sanity.studio/ (`readingMethod` = Category; `publication.methods` = Categories; publiczne `publication.format`) |
| **Working tree** | O fundacji: galeria zdjęć między Społecznością a Historią; schemat Studio wdrożony. Kolejna zmiana w toku: usunięcie szarych linii rozdzielających bloki Zespołu. Nadal do potwierdzenia przez redakcję: kanał YouTube w stopce (`UCqnZ4VG2xTkiTYDbrOLMfEQ`) i adres e-mail. |
| **Owner Sanity** | Organizacja na `admin@dramaway.pl`, plan NGO. `admin@dramaway.pl` = project Admin; redakcja = Editor |

---

## Co to jest

Redesign **fundacja.dramaway.pl**. MVP = jedna witryna. Art Generacje = serce. Czytelnia = dział (`drama_teatr`), nie drugi Next. Centrum = link zewnętrzny.

Stack: Next.js 15, Tailwind v4, shadcn/ui, Sanity Studio v6, Netlify. Kod/CMS EN · docs PL.

---

## Stan teraz

Treść fundacji jest w Sanity. Publiczne URL-e z IA działają. **Strona główna ma skład z Figmy plus polish desktopowy** (hero od góry kolumny, pasma pełnych kół przy krawędziach, naprzemienne kolory tytułów, klikalne kafelki) **i świadomy pass mobilny poniżej 1024 px** (sticky header + overlay, hero H1 → kwadratowe zdjęcie 1:1 → lead, stacked split tekst → kadr 4:5). Nie pixel-perfect. Nowy mobile hero wymaga sprawdzenia w deploy preview przy 375, 768 i desktopie (H1 w pierwszym ekranie, brak poziomego overflow, desktop bez zmian).

- Dataset `production` (`tr2qdg9j`) publiczny. Next bez tokenu. Write token **tylko** `apps/studio/.env`.
- Mapa URL: `apps/web/src/lib/routes.ts`. Prefiks bierze się z typu dokumentu: `project` → `/projekty/{slug}`, `person` → `/zespol/{slug}`, `publication` → `/czytelnia/{slug}`, `page` i `news` → `/{slug}`. Stary przedrostek `aktualnosc-` na stronie nadal się obcina. Menu tylko linkuje, nie składa adresu. Stary `/fundacja/{slug}` i `/projekty/{slug}` dla strony, która nie jest projektem, przekierowuje na `/{slug}`. Header czyta `siteSettings.navigation` (etykieta + strona z CMS albo adres, jeden poziom dzieci). Pusta lista = menu wbudowane: Projekty, **Baza wiedzy** (`/baza-wiedzy`, zwykła strona z opisem metod) z dzieckiem Czytelnia (desktop disclosure, mobile overlay), O fundacji, Kontakt. `/metody` przekierowuje na `/baza-wiedzy`. `/zespol` poza menu, dopóki ktoś go nie doda. Seed: `pnpm seed:navigation` (nie nadpisuje istniejącej listy). Hosted Studio widzi grupę Nawigacja po `pnpm --filter studio run deploy`.
- Listingi: `/projekty` = hero (z pasmem kół; **bez palety pod hero** — usunięta 2026-10-21 jako błąd), potem albo sekcje z `landing-projekty.sections` (te same Kafelki / Aktualności co `/` i `page.sections`), albo — gdy lista pusta — wiersz aktywnych + opcjonalna Czytelnia (`showCzytelnia`; copy z `landing-czytelnia`). Paleta pod dalszą treścią usunięta 2026-10-24; pasmo kropek przechodzi bezpośrednio do archiwum `density="compact"` (magenta „Zakończone projekty”, wycinek 3 linie, lekki offset prawej kolumny). **Archiwum w CMS (2026-09-07):** Teatr Codzienny ma 6 edycji + 20 rezultatów spektakli; TO MI GRA i BOAL bez fałszywych edycji (FoldList / Columns); Wielogłos jest `project` ze strony leftover `projekty-zakonczone`. Hero listingu (tytuł, lead, CTA, zdjęcie) = singleton **`landingPage`**; puste pole = blok znika, bez fallbacku z kodu. `/fundacja` = singleton **`aboutPage`**: hero, wartości (poniżej `lg` jeden przewijany rząd), zespół/zarząd (od 30 rem zdjęcie obok opisu, imię bez uppercase, opcjonalny `team.body` Portable Text), galeria zdjęć między Społecznością a Historią (pusta lista = brak sekcji; bez pasma kropek przed Historią), pasmo przed stopką (`data-no-palette` chowa drugie pasmo z layoutu); paleta między historią a dokumentami usunięta 2026-10-24. Historia `.stack-narrow` (lead = Portable Text, opisy zwijane; od `lg` falka, układ z `history.layout`), dokumenty `.document-list`. **Od 2026-10-07 jeden rytm `.fundacja-flow` i jedna linia lewej krawędzi**; nagłówki Zarząd / Zespół / Społeczność / Historia / Dokumenty mają tę samą rangę (`text-h3`) i renderuje je `TeamBios`, nie Portable Text. **Od 2026-10-21 Zespół stoi pod Zarządem** (`.team-block`): Zarząd → Zespół → Społeczność, jeden odstęp, bez linii rozdzielających bloki. Od `lg` bloki dzielą dwie ścieżki `--team-gap` — dwie karty Zarządu obok siebie, roster Zespołu w dwóch kolumnach na tych samych pionach. Historia i Dokumenty zostają w `.stack-narrow`. Rząd kół wartości zostaje wyśrodkowany (pasmo graficzne). Lead metod na pełną szerokość `.page` (od 2026-10-22, bez `.measure`). **Treść artykułów bez limitu 62ch** (`.article-body`, od 2026-10-21) — `.measure` tylko na leadach i kolumnach listingów. Pole `history.lead` nazywa się w Studio **Tekst nad osią** — to zwykła treść, nie lead, i renderuje się jak każdy inny tekst. Pusta lista wartości/dokumentów = sekcja znika; zespół znika gdy puste są i osoby, i `team.body`. `/kontakt` = `PageHero` z `page.title` + `page.body`, nad stopką jedno piaskowe pasmo (pasmo hero, bez drugiego z layoutu, gdy nic po nim nie stoi); maile tylko z `person.email`; opcjonalne `heroImages` / CTA na `page`. `/czytelnia` = opcjonalne CTA rodzaju + sekcje kategorii (`listed`); hero z `landing-czytelnia` (puste = brak hero). `/` **nie** listuje siatki projektów ani splitów „13 edycji”.
- `/projekty/[slug]` = tylko `project`. Strona `page` o tym samym slugu przekierowuje na `/{slug}`. Wydawnictwo jest w korzeniu: `/wydawnictwo`. Pusty duplikat `wydawnictwo-1` jest szkicem. Edycje: `/projekty/[slug]/[edition]` (AG ma 13 unikalnych slugów, w tym trzy `edycja-vi-20xx`; Teatr Codzienny: `edycja-2012` … `edycja-2017`). `/[slug]` = reszta (newsy). **AG i inne projekty:** hero lead = `project.summary` (puste = brak leadu). Całe `body` w kolejności z CMS (YouTube zostaje w miejscu, nie jest wyciągane na górę). Lista edycji to kopia posortowana malejąco po `year`; na Art Generacjach każdy wiersz ma pierwsze zdjęcie galerii po lewej, a brak zdjęcia oznacza brak miniaturki i kropki. Afterword + `partners` / `sponsors` w `FoldList` (`details`, domyślnie zamknięte); niepuste pole wygrywa z H2 Partnerzy/Sponsorzy. **Galerie:** `edition.gallery` i sąsiednie obrazy w Portable Text to mozaika (max. 4 kafelki, `--gallery-gap`, przepisy `one` / `pair` / `hero-pair` / `hero-trio`). `hero-trio` wypełnia szerokość rodzica i zachowuje proporcje bez limitu wysokości; od `lg` to jeden kadr po lewej i trzy po prawej, poniżej `lg` zostaje 1+2. Na edycji galeria i treść są w jednej sekcji. Reszta i kadry ze krótszym bokiem < 400 px (z `asset._ref`) tylko w lightboxie (`yet-another-react-lightbox` + Zoom). Brak nowego typu w Studio. Pusta galeria = brak bloku.
- `/czytelnia` — rodzaj: CTA tylko gdy ≥2 szuflady mają `listed` (`?rodzaj=`). Kategorie: sekcje z magenta Light + `(n)` szare. Nagłówek zwija i rozwija swoją sekcję (hover „zwiń” / „pokaż wszystkie”). Wejście z `?kategoria=` (slug `readingMethod`, np. `teatr-forum`) otwiera tylko tę jedną; adres trzyma parametr, dopóki otwarta jest dokładnie jedna. Chip rodzaju zachowuje `kategoria`. Jeśli w danym rodzaju nikt nie ma tagu — płaska lista, bez „Pozostałe”. Publikacja z wieloma tagami jest w wielu sekcjach. GROQ **`listed == true`**. `pnpm patch:publication-listed` **odpalony** (wszystkie `publication` w spisie). Artykuł albo scenariusz z PDF: wiersz otwiera plik („pobierz PDF”), a `/czytelnia/{slug}` robi 307 na ten plik i nie wchodzi do sitemapy. Książka, multimedia, YouTube w `body` (także w Columns) albo brak pliku: podstrona i „więcej”. Okładka w spisie = pierwszy obrazek w `body` (hotspot), poziomy prostokąt 4:3 z zaokrąglonymi rogami po lewej stronie tekstu; bez obrazka zostaje piaskowy prostokąt. Nagłówek „Pełna biblioteka” ma rozmiar H2. Na podstronie: autorzy, etykiety `readingMethod`, link PDF (`file`). W Sanity **81× `publication`** (import 82 minus śmieć `metody-tzs`) + **6× `readingMethod`**. Dwie osie: `publication.format` (`articles` \| `books` \| `scripts` \| `multimedia`); tagi → `methods`. `pnpm patch:publication-format` **odpalony**. Dump **jest**: `private/dumps/drama_teatr_1787254349.sql.gz`. Baza wiedzy: `/baza-wiedzy` (dokument `page`, opis metod). Hosted Studio: po zmianie schematu `pnpm --filter studio run deploy`.
- Chrome UI (etykiety filtrów, „więcej”, puste listy) w `homepage-copy.ts` / `subpage-copy.ts`. Treść editorialna tylko z CMS (`aboutPage`, `landingPage`, `siteSettings.hero` / `homepage`, `project.summary`). **Puste pole = nic na stronie**, bez fallbacku z kodu. Wyjątki chrome: [design/system.md](design/system.md) „Copy chrome vs Figma”. Grupa **Ikony** (`branding`): **SVG jako `image`** (Select w Media widzi m.in. już wrzucony `icon.svg`; strona serwuje surowy SVG z `asset.url`, nie raster CDN) / **ICO jako `file`** z podglądem 32×32 i natywnym pickerem (Media na polach `file` była pusta: 0 `fileAsset`) / PNG light+dark / Apple / 512 / OG. Puste pole = `public/brand`.
- `getResolvedSite()` zwraca `homepageSections` + `hero` + `footer` (logo, adres, `links` z `lib/footer-links.ts`, włącznik newslettera). Niepoprawny wpis linku (zły mail, obcy schemat) po prostu znika ze stopki. Puste pole = brak bloku (adres: `footer.address` albo legacy `footerNote`). Sekcje strony głównej to tablica `newsFeedModule` (trzy najnowsze `news`) i `contentModule` (do 3 kafelków, opcjonalne zdjęcie). Ten sam zestaw pól jest na dokumencie `page` (`sections` nad `body`, `sectionsAfterBody` pod `body`) i na listingu projektów (`landingPage.sections`, tylko trasa `projekty`, nad archiwum). Na `/baza-wiedzy` `sectionsAfterBody` pozwala wstawić kafelki między artykułem a biblioteką. Oba pola na `page` przyjmują też moduł **Cytat** (`quoteModule`: tekst + autor, między dwoma rzędami palety). Pusta lista na `/projekty` zostawia automatyczny wiersz aktywnych. Kafelek wskazuje dokument (`page`, `project`, `publication`, `landingPage`, `aboutPage`, `person`) albo ścieżkę; puste tytuł/opis/etykieta biorą się z dokumentu. Cały kafelek to jeden link. Układ bez zdjęcia: `grid` albo `list`. Ze zdjęciem strona kadru lewo/prawo liczy się sama (pierwszy moduł ze zdjęciem = lewo). Seed starych slotów: `pnpm seed:homepage-sections` (nie nadpisuje niepustej listy).
- Newsy na `/`: sekcja `newsFeedModule` — domyślnie 3 najnowsze dokumenty `news` (data publikacji, inaczej `_createdAt`). W Studio typ nazywa się **News**, obok Project / Person / Page. Pola: tytuł, slug, data, zajawka, treść. CTA puste = „czytaj więcej” na podstronę newsa. Inny adres (ścieżka albo https) wymaga własnej etykiety; tytuł karty zostaje linkiem do artykułu. W sekcji: limit (1–12) i rodzaje (News, strony, osoby, projekty, publikacje). `pnpm migrate:news` przenosi stare `page` z przedrostkiem `aktualnosc-` (nowy `_id`, bo Sanity nie zmienia typu przy starym; ucina przedrostek i `[Aktualność]` w tytule). Trzeci news `news-syrena` jest wypełniaczem z ramki — **do draftu** z adnotacją PL (wykaz: [fundacja-status.md](migration/fundacja-status.md) „Luki vs ramka”).
- Skip-link (`Przejdź do treści`) i strony 404 / błąd — **są** w kodzie (chrome w `subpage-copy.ts`).
- Studio: plugin **Media** (`sanity-plugin-media`) — zakładka w menu + źródło przy polach **`image`**. Pola **`file`** (ICO) zostają na wbudowanym pickerze Sanity: Media w trybie plików pokazuje tylko `sanity.fileAsset`, a tych jest zero. Typy `media.tag` / `media.folder` ukryte w desk. Credit line włączony. **Content (góra):** Strona główna zostaje na stałe (`siteSettings`). Dalej skróty z `siteSettings.navigation` (ta sama lista co menu witryny, z jednym poziomem dzieci). Pusta lista = dotychczasowe skróty: Projekty / Czytelnia / Zespół (`landingPage`), Art Generacje (`project`), Baza wiedzy / Kontakt (`page`), O fundacji (`aboutPage`). Lista Page ukrywa strony, które są już skrótem. Site settings nadal na dole (ten sam dokument co Strona główna). Portable Text: styl **Termin** (`term`) — blob + krój body, Strong opcjonalnie; lista **Indent** (Tab = głębsze wcięcie); lista **Roles** (`roster`) — wiersze `rola: imiona`, render jako `.roster` (hairline’y, bez karty); obiekt **Wykaz twórców** (`credits`) — grupy (Autorstwo / Obsada / Realizacja / Produkcja / Partnerzy) z wierszami `rola` + opcjonalny `dopisek` + `osoby`, blok **Lista bez ról** dla obsady i opcjonalna notka końcowa; ten sam `.roster` co Roles; obiekt **Columns** (2 albo 3, stack poniżej `lg`); obiekt **Button** (`ctaButton`) — zielone CTA w osobnym wierszu, do lewej, z wcięciem 0–3 stopnie jak lista Indent; cel to dokument, plik albo adres, a `#` i `?` są w zwiniętym Zaawansowane; separator **Czytaj więcej** (`readMoreBreak`) — max jeden w głównym `body`, tylko w środku (nie na początku/końcu), treść poniżej zwinięta na stronie (copy: „Czytaj więcej” / „Zwiń”); nie w kolumnach. Quote bez zmian. Nie zgadywać listy ról z dwukropków w prozie **w runtime** — redaktor zaznacza Roles / Wykaz twórców w toolbarze. Jednorazowy wyjątek offline: `pnpm patch:project-credits` (parser → ręcznie przejrzany `scripts/project-credits.json` → zapis), odpalony 2026-10-07. Deploy: `pnpm --filter studio run deploy` → https://dramaway.sanity.studio/.
- **Publikacja w Studio:** Next trzyma HTML do 60 s (ISR). Żeby nie czekać: webhook Sanity → `POST /api/revalidate` (`revalidateTag` + `revalidatePath`). Koszt ≈ 0 (webhook Sanity darmowy, kilka wywołań Netlify dziennie). **Skonfigurowane 2026-10-23:** sekret w Netlify (`SANITY_REVALIDATE_SECRET`, kontekst Production, oznaczony jako secret) i webhook w Sanity Manage → API → Webhooks (`https://dramaway.netlify.app/api/revalidate`, header `Authorization: Bearer <sekret>`, dataset `production`, create/update/delete, bez draftów, pole „Secret” puste). Sekret w Bitwardenie. Po cutoverze URL hooka na docelową domenę. Test: `POST` bez sekretu → 401 (503 = zmienna nie dotarła, trzeba redeploy).
  Fallback 60 s zostaje, gdy hook nie dojdzie.
- Netlify: `netlify.toml` w repo (`pnpm --filter web build`, `X-Robots-Tag: noindex` na static). Preview: https://dramaway.netlify.app/. Next: `metadata.robots` + `headers()` (CSP, noindex dopóki `NEXT_PUBLIC_SITE_INDEX` nie jest `true`).
- **Indeksacja (cutover):** w Netlify `NEXT_PUBLIC_SITE_URL=https://fundacja.dramaway.pl` i `NEXT_PUBLIC_SITE_INDEX=true` — wtedy robots/sitemap/canonical żyją. Do tego czasu Google ma nie indeksować roboczego netlify.app.
- CI: `.github/workflows/ci.yml` — `pnpm install`, lint, `web` build, `test:repair` / `test:archive-projects` / `test:web`.
- Studio deploy: `.github/workflows/studio-deploy.yml` po merge'u zmian w `apps/studio/**` do `main` (sekret repo `SANITY_AUTH_TOKEN`, token „Deploy Studio”).
- Zmiany w kodzie po przekazaniu: Copilot coding agent (zgłoszenie „Zmiana na stronie” → PR → Netlify Deploy Preview → merge). Środowisko agenta: `.github/workflows/copilot-setup-steps.yml`, zasady: `AGENTS.md`, instrukcja: [redakcja/zmiany-w-kodzie.md](redakcja/zmiany-w-kodzie.md).
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

Rollback: poprzedni deploy Netlify (Deploys → Publish deploy) + eksport datasetu z dysku Fundacji.


### Sanity — role i przekazanie (2026-09-07)

Billing jest w **organizacji**, nie w project Admin. Kanon: [guides/sanity-roles.md](guides/sanity-roles.md).

- `admin@dramaway.pl` — właściciel organizacji i **project Administrator**; pełne zarządzanie, nie codzienny CMS.
- Osoba od kodu / zlecony wykonawca — **Developer** na czas zlecenia, potem usunąć.
- Osoby edytujące treści — **Editor** (żeby nie ruszyć tokenów / CORS / datasetu).
- Contributor / Viewer / Blueprints editor — na start nie. Viewer = podgląd (darmowe miejsce). Contributor = szkice bez publikacji.
- Dane billingowe doda klient przy **migracji serwisu** (org-admin).
- Kopia treści: eksport datasetu (`sanity datasets export production`) na dysku Fundacji; chmurowa kopia datasetu nie jest na planie. Kod sprzed startu redakcji: tag `snapshot-2026-09-07-pre-client`.

### Warstwa wizualna (od 2026-08-30, skład `/` 2026-09-03, polish 2026-09-03, mobile 2026-09-03)

Figma zmierzona i przełożona na mały system. Kanon: [design/system.md](design/system.md), liczby źródłowe: [design/figma-baseline.md](design/figma-baseline.md), decyzja: [ADR-004](decisions/ADR-004-layout-architecture.md). **FileKey:** `Tf7i787tVTBTE4j7LFXXUX` (kopia Pro). Stary `yjpLV44NfMXZtU774I1ZRY` to Untitled na Starterze (20 MCP / mies.) — nie wołać.

- Tokeny w `@theme` (`globals.css`), fonty MuseoModerno + Alexandria przez `next/font`.
- Klasy układu: `.page`, `.split` (pełny viewport, spad zdjęcia do krawędzi okna), `.cols-3`, `.stack`, `.stack-narrow`, `.stack-wide`, `.footer-newsletter`.
- Copy ramek: `apps/web/src/lib/subpage-copy.ts` (tylko chrome UI — filtry, „więcej”). `PageHero` to ten sam split co `/` (od `lg` kadr do wysokości tekstu, poniżej `lg` kwadrat 1:1 na całą szerokość treści, z odstępami i zaokrąglonymi rogami), z overlayem nawigacji od `lg` przez `data-split-hero` (nie `data-home` — to chowa pasmo stopki z layoutu, bo `/` maluje własne). H1 ma `.hero-title` (sentence case). Edycja: `layout="stack"` (bez foto, overlayu i pasma). Puste zdjęcie hero = brak kadru, slot zostaje (szerokość tekstu jak ze zdjęciem). Puste title/lead/CTA = te elementy znikają; całkowicie pusty hero = brak sekcji. Pasmo nad stopką: na `/` i `/fundacja` własne `DotBand`, na reszcie `.footer-dots` w layoucie. `BlobRow` ma `width`: `page` (domyślnie, pełne `.page`), `narrow` (`.stack-narrow`), `wide` (`.measure`, 62ch). Te kolumny, body w `.measure` i hero tekstowy edycji trzymają lewą krawędź `.page` — luz zostaje po prawej. `density="compact"` dwukolumnowo od `lg`, etykieta magenta zdaniowa, offset prawej kolumny.
- **Hero / nav:** zdjęcia hero to tylko lista do 5 (`heroImages` na `siteSettings`, `landingPage`, `aboutPage`, `page`, `project`). Pusta lista = brak kadru (na projekcie zostaje osobny fallback: galeria edycji albo pierwszy obraz w `body`). Jedno zdjęcie zostaje statycznym kadrem — bez nawigatora, więc podpis slajdu tam nie wychodzi. Od dwóch: przenikanie, miniatury w kropkach (ciasny kadr wokół hotspotu), nieaktywna kropka przygaszona (`opacity` 0.5, hover do 1), aktywna z pierścieniem czasu slajdu (od góry, zgodnie z ruchem wskazówek; pauza go zatrzymuje). Tło `sand` + blur. Od `lg` pasek jest sticky w prawym górnym rogu zdjęcia (`2rem` od krawędzi viewportu, opacity 0.65, przy kursorze albo fokusie 1) i jedzie z scrollem, aż zatrzyma się przy dole zdjęcia. Nieaktywna kropka ma średnicę pierścienia aktywnej (`1.875rem`). Bez animacji przy `prefers-reduced-motion`. Poniżej `lg` pasek jest zawsze, dosunięty do prawej krawędzi treści strony. Podpis (`caption`) to tooltip kropki; pusty = brak tooltipu. Alt i podpis da się skopiować jednym kliknięciem w Studio, gdy wypełnione jest dokładnie jedno. Czas klatki i autoodtwarzanie są w `siteSettings.heroSlider`. Stare klucze (`heroImage`, `landingPage.image`, `aboutPage.image`) zostały w danych do czasu `pnpm patch:hero-images -- --unset-legacy` — dopiero gdy Netlify serwuje ten front. Na `lg+` wrapper `[data-home]` albo `[data-split-hero]` + `:has()` wyjmuje header z pionowego flow i kotwiczy go w lewej kolumnie (szerokość jak `.split-text`). Zdjęcie od góry prawej kolumny, spad do prawej krawędzi viewportu. Od `lg` wysokość sekcji bierze się z tekstu (homepage i każdy `PageHero`); kadr wypełnia tę wysokość (`object-fit: cover` + hotspot), bez proporcji 481:823 i bez limitu `100vh`. Brak CMS photo = ten sam slot, bez kadru. Nav **nigdy** na zdjęciu. Poniżej `lg`: sticky pasek (logo + menu), overlay na `sand` z L1 plus Czytelnia pod Bazą wiedzy; hero to H1, kwadratowy kadr 1:1 (na całą szerokość treści (marginesy `--page-pad` jak w innych zdjęciach), zaokrąglone rogi) albo pusty slot, lead/CTA z odstępami 1.5–2rem; stacked `.split` ma tekst, potem kadr inset 4:5 (`--media-split-max`). Od `lg` disclosure pod „Baza wiedzy”: piaskowa chmurka obejmuje rodzica i L2, opcje wjeżdżają transformacją; zamyka się po przejściu na podstronę. Menu nie zawija: etykiety `text-nav`, to co nie mieści się w rzędzie idzie za trzy kropki (ta sama chmurka, hover + fokus).
- Pasmo kół: `--dot-size` 82 px (skok 48 px <768), bez `overflow: hidden`. Zanim JS zmierzy szerokość, koła rysuje `radial-gradient(circle closest-side)` — bez `closest-side` promień idzie do narożnika kafla i zostaje szczelina. Potem każde koło jest elementem (tyle, ile `round(up, 50%, --dot-size)`): rzędy dobijają do krawędzi strony, reszta z zaokrąglenia ląduje na środku pod schodkiem. Ujemny margin nachodzi na krawędzie `Media`; prop `mirror` odbija schodek tam, gdzie zdjęcie jest po lewej. Najechanie kropki (albo dotknięcie) puszcza wzdłuż jej rzędu falę kolorów marki w obie strony — fade `background-color`, bez innych transformacji. Koła nie łapią kliknięć. `prefers-reduced-motion` zostawia piasek.
- Paleta: 7 stykających się kół, `flex-shrink: 0`, wyśrodkowana jako grupa. Na `/` poprzedza pierwszą listę. Na `/projekty` i `/fundacja` usunięta 2026-10-24; nad stopką jej nie ma.
- `/` kolejność zależy od `siteSettings.homepageSections` (pod hero): po hero zawsze `DotBand`; między sekcjami zwykły `DotBand` (lewe kółka niżej niż prawe; przed pierwszą listą bez zdjęcia pasmo odpada, wchodzi paleta); paleta przed pierwszą sekcją `list`; nad stopką znowu `DotBand` (nie paleta). Siatka = `.cols-3`, lista = `.stack-narrow`, zdjęcie = `.content-split` (połowa viewportu minus `--module-center-inset`, krawędzie na osi kółek). Jeden kafelek przy zdjęciu jest wyśrodkowany w pionie; dwa lub trzy skracają opis do 3 linii.
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
- Timeline „historia fundacji” — sekcja jest; **pusta lista w Studio = brak bloku na stronie**. Lead nad osią to Portable Text (`history.lead`). Opisy zwinięte: scroll rozwija 2–3 lata przy środku viewportu (ucięcie zanika gradientem aż do pełnego otwarcia). Tytuł stoi na baseline roku w kropce. Rozwinięcie i zwinięcie zależą wyłącznie od pozycji na ekranie (bez timerów): rok jest w pełni otwarty, gdy kropka przechodzi przez strefę buforową w górnej części ekranu, i zwija się dopiero przy dalszym przewijaniu; długi opis zostaje otwarty, dopóki jego koniec nie podjedzie wyżej. Jeden przycisk „rozwiń całość” / „zwiń całość” otwiera wszystko do czytania i wyłącza efekt scrolla. Od `lg` pionowa oś ma falkę SVG w prawo, trochę mniejsze kropki (rok bez zmiany wielkości) i większe odstępy. `history.layout`: `vertical` (domyślnie, też puste pole) albo `horizontal` (sticky, pionowy scroll przesuwa oś w lewo; telefon i `prefers-reduced-motion` zawsze pion, bez falki). Nie wklejać lorem `‘11`/`‘12`/`‘13` z bio Aldony; wpisywać prawdziwe daty w `aboutPage.history`.
- Mapa przekierowań (stare aliasy `teatrzaangazowany…` → `/czytelnia/[slug]`)
- Podpięcie MailerLite (formularz w stopce jest; `POST /api/newsletter` zwraca 501), **formularz kontaktu (osobne zamówienie, jeśli będą chcieli)**, EN
- `person.role` (Drupal `field_funkcja`)
- Ręczna korekta części kotwic (albumy FB ucięte w środku słowa; ucięte bilety Evently)

---

## Następna sesja — start

Ten plik + [fundacja-status.md](migration/fundacja-status.md) + [ustalenia-2026-09-05.md](concept/ustalenia-2026-09-05.md). Nie odtwarzać dumpów rozmów. Nie wołać Figmy bez potrzeby.

### Dokończyć kadry manuala

Spis braków: [guides/zrzuty-manuala.md](guides/zrzuty-manuala.md). Wstawić plik do `docs/redakcja/img/` i obrazek pod znacznikiem `<!-- screen: ... -->` w podanym pliku. Nie naciskać **Publish**.

Gdzie się logować:

- **Reszta kadrów ze Studia** — lokalnie, już zalogowane: [http://localhost:3333](http://localhost:3333) (`pnpm dev:studio`). Ten sam dataset `production` co hosted Studio. Hosted, gdy lokalne nie wstanie: [https://dramaway.sanity.studio/](https://dramaway.sanity.studio/).
- **`studio-adres` (ekran logowania)** — okno prywatne na [https://dramaway.sanity.studio/](https://dramaway.sanity.studio/) **zanim** wpiszesz hasło. Nie wylogowywać zwykłej sesji. W kadrze ma być pasek adresu Studia, nie strony fundacji.
- **`role-zaproszenie`** — to nie Studio. [https://www.sanity.io/manage](https://www.sanity.io/manage) → projekt Dramaway (`tr2qdg9j`) → członkowie. W kadrze Editor przy redakcji i Administrator przy `admin@dramaway.pl`.

Zostało: `studio-adres`, `role-zaproszenie`, `studio-publish`, `studio-obraz`, `studio-link`, `strony-skroty`, `strony-listing`, `czytelnia-dokument`, `czytelnia-okladka`, `fundacja-dokumenty`, `fundacja-historia`, `tekst-toolbar`, `tekst-termin`, `tekst-indent`, `tekst-columns`, `tekst-button`.

Cutover kont: skrzynka, GitHub, Netlify i Sanity (plan NGO, organizacja na `admin@dramaway.pl`) zrobione 2026-10-23. Został eksport datasetu, nowy token zapisu i dzień domeny: [guides/cutover.md](guides/cutover.md).

**Baza wiedzy ≠ Czytelnia.** `/baza-wiedzy` to strona z opisem metod. Czytelnia zostaje `/czytelnia` (dziecko w menu). `/metody` przekierowuje na `/baza-wiedzy`. Faza 2 kanału Czytelni **zrobiona**. Listing: wszystkie `publication` mają `listed` (`pnpm patch:publication-listed`).

Ramki Figmy podstron są na `main`. Portable Text: **Termin** / **Indent** / **Roles** / **Columns** / **Button** / **Czytaj więcej (separator)** — po schemacie `pnpm --filter studio run deploy`. Stopka: Studio → Site settings albo **Strona główna** → Stopka.

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
| Cover projektu / `/fundacja` | kadr z `heroImages` | `/fundacja`: `aboutPage.heroImages` (2026-10-01 kopia starego `image`). Projekt: pusta lista = pierwszy kadr galerii edycji albo obraz w `body`. Puste = hero bez zdjęcia (slot zostaje) |
| Syrenka / Wielogłos | tylko lorem w ramce | **Nie tworzyć** projektów z Figmy |
| Historia fundacji | sekcja w `aboutPage.history` | Lead = Portable Text; wpisy z datami; układ pion/poziom (`layout`, puste = pion). Pusta lista = brak bloku. Nie kopiować lorem z Figmy |
| Wartości na `/fundacja` | `aboutPage.methods.values` | Edytować w Studio; pusta lista = brak kół. Mobile: jeden przewijany rząd |
| Zespół na `/fundacja` | `aboutPage.team` | Nagłówek (Zarząd) + osoby + `team.body` (Zespół / Społeczność). Puste osoby i puste body = brak sekcji |
| Dokumenty | `aboutPage.documents.items` | Strona i/lub PDF i/lub URL. Pusta = brak sekcji |
| `landingPage` (3×) | **wypełnione 2026-09-07** | H1/lead z kanonu ramek na `/projekty`, `/czytelnia`, `/zespol`. `/projekty`: CTA do AG, lista **Sekcje** (pusta = wiersz aktywnych) i włącznik Czytelni (`showCzytelnia`, tylko przy pustych sekcjach; copy z dokumentu Czytelnia). `/baza-wiedzy` od 2026-09-29 jest `page`, nie landingiem |
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
cd dramaway.pl                # katalog z klonem repo
pnpm dev:all                  # :3000 + :3333
pnpm deps:outdated            # co odstaje
pnpm deps:update              # bump w ramach ^/~
pnpm extract:czytelnia        # dump → gitignored JSON
pnpm repair:portable-text     # dry-run encji/linków; `-- --write` zapisuje
pnpm test:repair
pnpm test:archive-projects
pnpm test:web                 # allowlista URL + YouTube + menu z CMS
pnpm patch:publication-format # legacyDrupal.format → format; nie zastępuje migrate:czytelnia
pnpm patch:hero-images        # legacy kadr → heroImages gdy pusta; przepisuje _type image → heroSlide; nie zdejmuje starych kluczy
pnpm patch:project-credits -- --scan      # parsuje wykazy twórców, raport + szkic scripts/project-credits.json, nic nie zapisuje
pnpm patch:project-credits -- --dry-run   # diff z przejrzanego pliku
pnpm patch:project-credits                # zapis (odpalony 2026-10-07; nie odpalać drugi raz)
pnpm repair:credit-keys       # dry-run: grupy/wiersze credits bez _key
pnpm repair:credit-keys -- --write  # dopisuje _key (odpalony 2026-10-12; drugi raz jest no-op)
pnpm test:credits             # parser wykazów
# pnpm patch:hero-images -- --unset-legacy  # dopiero gdy Netlify serwuje front czytający wyłącznie heroImages
pnpm seed:about-page          # singleton O fundacji, jeśli nie istnieje
pnpm seed:landing-pages       # 4× landingPage (projekty, baza, czytelnia, zespół); puste pola
pnpm seed:navigation          # pusta siteSettings.navigation → obecne menu; nie nadpisuje listy
pnpm --filter studio run deploy   # https://dramaway.sanity.studio/
# snapshot CMS: apps/studio → sanity datasets export production ../../private/sanity-snapshots/….tar.gz
```

Hosted Studio: **2026-10-12 `pnpm --filter studio run deploy` przeszedł** (Studio + 1/1 schematów, w tym `credits`) po zalogowaniu `sanity login` kontem z grantami. Wcześniej (2026-10-01) deploy z samym tokenem zapisu budował paczkę i odmawiał — brak grantów `sanity.project/deployStudio` i `sanity.project/deploySchema`. Po każdej zmianie schematu trzeba go powtórzyć.

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
