# System wizualny — jak budować sekcje

**Czytaj to przed dotknięciem czegokolwiek w `apps/web/src`.** Liczby źródłowe: [figma-baseline.md](figma-baseline.md). Decyzja architektoniczna i odrzucone warianty: [ADR-004](../decisions/ADR-004-layout-architecture.md).

Trzy warstwy, nic więcej: **tokeny → prymitywy → sekcje**. Nie ma piętra „komponentów editorialowych" — sekcja jest jednorazowa i tak.

## Zasady, których nie łamiemy

1. **Zero wartości w pikselach w plikach sekcji.** Wszystko idzie z tokenów albo z klas kompozycyjnych. Jeśli czegoś nie da się wyrazić, dołóż klasę w `@layer components`, nie arbitrary value.
2. **Koła dekoracyjne rysujemy tłem, nie elementami.** Pasmo z Figmy to 270 identycznych kół. Jako DOM to 270 węzłów na stronę; jako `radial-gradient` to zero.
3. **Każda sekcja musi przeżyć puste dane.** Redaktor zostawi pole puste, galeria będzie miała zero zdjęć. Figma pokazuje stałą liczbę elementów, CMS ma zmienną — układ ma się nie rozsypać.
4. **Mobile: spójnie i wystarczająco dobrze.** Ramek telefonu w Figmie nie będzie. Podstrony biorą te same reguły co `/` (poniżej). Priorytet: czytelność, ograniczona wielkość obrazków, brak poziomego przepełnienia — nie pixel-perfect względem desktopowej ramki.
5. **Nie „poprawiamy" tokenów z powrotem do surowych liczb z Figmy.** Odstępstwa są świadome i opisane niżej.

## Tokeny

Wszystkie w bloku `@theme` w [apps/web/src/app/globals.css](../../apps/web/src/app/globals.css).

**Kolory:** `sand`, `ink`, `green`, `green-ink`, `magenta`, `navy` oraz `brand-1` … `brand-7`. W Tailwindzie to zwykłe utility: `bg-sand`, `text-magenta`.

**Typografia:** `font-display` (MuseoModerno 600/800/900) i `font-body` (Alexandria 300/400/600), ładowane przez `next/font` w [layout.tsx](../../apps/web/src/app/layout.tsx). Ciągły tekst jest Light (300) z `body`; nagłówki dostają `font-black` i `uppercase` (z `@layer base`, kopia w CMS zostaje w zdaniach — transform jest wizualny). **Wyjątek:** H1 hero (`.hero-title`) zostaje w kapitalizacji zdaniowej — wersaliki na 48 px Black są za ciężkie. Drugi: `.pub-cat-head` (kategorie Czytelni) — Alexandria Light magenta, bez uppercase. Trzeci: `.history-title` na `/fundacja` — Alexandria SemiBold, bez uppercase (jak ramka `130:1696`). Czwarty: `.team-bio-name` — Alexandria, bez uppercase. Piąty: `.pt-term` — Alexandria Light jak body, bez uppercase; pogrubienie tylko przez Strong. Szósty: `.blob-row-label` (archiwum na `/projekty`) — MuseoModerno SemiBold magenta, bez uppercase (ramka `73:1284` to 15 px Medium; kod: `text-small` 600). Skala na desktopie (clamp w dół na węższych): `text-display` / `text-h1` 48 — tytuł hero i strony; `text-h2` 32 — etykieta pasma (AKTUALNOŚCI); `text-h3` 24 — tytuły sekcji (Kim, Metody, Art Generacje, Czytelnia); `text-h4` 20 — tytuły kart aktualności; `text-lead` 20 — opis hero i bloki pisane; `text-body` 18 — teksty pod blokami na `/`; `text-small` 14 — daty, etykiety. **Klasa rozmiaru ≠ tag HTML.** Outline na `/`: jeden H1 (hero), H2 na każdą sekcję, H3 na karty aktualności — bez przeskoków. Wizualnie AKTUALNOŚCI jest większe niż Kim / teasery (`text-h2` vs `text-h3` na H2); tytuły newsów są H3 w `text-h4`.

**Layout:** `--page-max` (1440), `--page-pad`, `--page-indent`, `--pt-indent` (3 rem, stopień wcięcia w Portable Text), `--dot-size` (82 px, skok do 48 px poniżej 768 px — nie `clamp`), `--palette-size`, `--values-size` (koła wartości na `/fundacja`, max ~154 px; poniżej `lg` `--values-size-mobile`, jeden przewijany rząd wyśrodkowany jako blok), `--history-marker` / `--history-gap` (oś czasu na `/fundacja`, ciaśniejsza niż `--spacing-section`), `--site-header-space` (desktopowy overlay na `/` i na podstronach ze `data-split-hero`), `--site-header-bar` (kompaktowy pasek poniżej `lg`), `--touch-target` (44 px), `--hero-media-span` (70%), `--media-split-max` (42vh), `--footer-quote-max`, `--content-narrow` (773 px, teasery Art Generacje / Czytelnia), `--content-wide` (~1181 px, leady list na podstronach), `--body-image-small` (24 rem), `--body-image-wide` (`--content-wide`), `--body-image-max` (`min(36rem, 70vh)` — kadr **medium** w Portable Text), `--body-image-inline` (14rem) / `--body-image-inline-medium` (18rem) / `--body-image-inline-max` (20rem, opływanie), `--gallery-gap` (0.75 rem — rynna mozaiki, **nie** `--spacing-section`), `--archive-gap` / `--archive-stagger` (para archiwum na `/projekty`) oraz `spacing-section` jako rytm pionowy (`py-section`).

## Klasy kompozycyjne

| Klasa | Do czego |
|-------|----------|
| `.page` | kontener wyśrodkowany, `--page-max` z `--page-pad` |
| `.split` / `.split-text` / `.split-media` | pełna szerokość viewportu; tekst w kolumnie ograniczonej do ~2/3 `--page-max` z `--page-pad`; zdjęcie dobija do krawędzi **viewportu** (od `lg`). Poniżej `lg`: tekst pierwszy, kadr inset 4:5 z `--media-split-max` |
| `.content-split` | moduł kafelków ze zdjęciem. Od `lg`: połówki viewportu. Zdjęcie ma szerokość połowy minus 1,5 kropki (światło od środka, po stronie kadru). Tekst zaczyna się 1,5 kropki od środka, po swojej stronie. Górna i dolna krawędź zdjęcia leżą na osi kółek po jego stronie (lewe kółka niżej niż prawe). Paleta zamykająca stronę główną liczy się tak samo: dół zdjęcia kończy się na osi tych kół, a rząd leży nad kadrem. `.content-split-solo` wyśrodkowuje jeden kafelek w pionie. |
| `.content-tile-clamp` | opis kafelka ścięty do 3 linii, gdy w module są co najmniej dwa kafelki |
| `.split-reverse` | to samo, ale zdjęcie po lewej (spad do lewej krawędzi) |
| `.hero` / `.hero-title` / `.hero-heading` / `.hero-copy` / `.hero-media-wrap` / `.hero-media` / `.hero-media-empty` / `.hero-stack` | hero: od `lg` to `.split`, wysokość sekcji bierze się z kolumny tekstu, a zdjęcie wypełnia tę kolumnę (`object-fit: cover` + hotspot Sanity, bez stałej proporcji). Poniżej `lg` siatka H1 → kadr w kole (`--hero-media-span`) → lead/CTA. `.hero-heading` owija okruch + H1 na podstronach; `.hero-title` zostawia **każdy** H1 hero (homepage i podstrony) w kapitalizacji zdaniowej. `.hero-stack` = tekstowy hero edycji (bez `data-split-hero`); H1 i lead w kolumnie 62ch przy lewej krawędzi `.page`. `.hero-media-empty` = ten sam slot bez zdjęcia (CMS puste), żeby szerokość tekstu nie skakała |
| `[data-home]` / `[data-split-hero]` | od `lg` overlay headera w lewej kolumnie. `data-home` (`/`) oraz `data-no-palette` (`/fundacja`, `/kontakt`) chowają `.subpage-palette`. Kadr hero nie ma limitu `100vh` — rośnie i maleje z tekstem |
| `.site-header` / `.site-nav-desktop` / `.site-nav-toggle` / `.site-nav-overlay` / `.site-nav-item` / `.site-nav-flyout` / `.site-nav-cloud` / `.site-nav-sub` | chrome: poniżej `lg` sticky pasek + overlay (L2 w piaskowej chmurce); od `lg` poziomy rząd, L2 jako chmurka wokół rodzica (piasek, organiczny promień, zamyka się po nawigacji) |
| `.skip-link` | pierwszy w `.site-shell`: ukryty, aż dostanie fokus; skok do `#main-content`. Tokeny, nie px w sekcjach |
| `.cols-3` | 1 → 2 → 3 kolumny; aktualności, publikacje. Rynna szersza niż 36 px z ramki — świadomie więcej światła |
| `.news-card` + `.news-card-title` / `-body` / `-cta` | wspólna linia bazowa kart aktualności: tytuł zawsze na dwie linie, treść zbiera luz, rulka CTA na jednym poziomie niezależnie od długości tekstu |
| `.card-link` + `.cta-over` / `.card-hover` | klikalny kafelek: link tytułu rozciąga swój obszar kliknięcia na całą kartę. `.cta-over` wynosi nad nakładkę CTA prowadzące **gdzie indziej** niż kafelek (Art Generacje: kafelek → projekt, CTA → lista). `.card-hover` na karcie animuje rulkę CTA przy hoverze, gdy CTA tylko powtarza link kafelka |
| `.stack` / `.stack-item` | lista pionowa; `.stack` izoluje stacking, `.stack-item` pozycjonuje `Blob` — koło zostaje pod tekstem sąsiadów |
| `.stack-narrow` | ogranicza blok do `--content-narrow` i trzyma go przy lewej krawędzi `.page`; tekst w środku zostaje do lewej, luz zostaje po prawej |
| `.stack-wide` | to samo dla `--content-wide` (~1181 px) |
| `.measure` | kolumna czytania (62ch) przy lewej krawędzi rodzica (`.page` albo `.split-text`); nagłówki i treść w jednym bloku, tekst do lewej, luz po prawej |
| `.footer-quote` / `.footer-brand` / `.site-footer` | stopka: lewa logo+adres, prawa cytat (tekst do lewej w kolumnie, max `--footer-quote-max`). Paleta przed stopką; `/`, `/fundacja` i `/kontakt` ją chowają |
| `.gallery-mosaic` / `.gallery-tile` / `.gallery-mosaic-more` | galeria: max. 4 kafelki, `data-layout="one\|pair\|hero-pair\|hero-trio"`, rynna `--gallery-gap`. Poniżej `lg` trio to 1+2 (czwarty kafelek ukryty). Nadmiar i kadry ze krótszym bokiem < 400 px tylko w lightboxie; ostatni widoczny kafelek ma `+N`. Alias `.gallery-lead` usunięty |
| `.team-row` / `.team-photo` | siatka okrągłych portretów zespołu |
| `.values-row` / `.values-item` / `.values-label` | `/fundacja`: rząd stykających się kół wartości (etykieta **w** kole, `sand`; 8. koło = `brand-3`). Blok wyśrodkowany (`max-content` + `margin-inline: auto`). Poniżej `lg`: jeden rząd, `overflow-x`, etykieta `nowrap`, `--values-size-mobile` |
| `.history-list` / `.history-item` / `.history-marker` / `.history-title` | `/fundacja`: oś czasu w `.stack-narrow` (koło z rokiem + tytuł Alexandria, bez uppercase; `text-small`, `--history-gap`) |
| `.document-list` | `/fundacja`: lista CTA dokumentów; `gap` 1.5 rem, nie `--spacing-section` |
| `.team-bios` / `.team-bio` / `.team-bio-name` / `.team-bio-blurb` / `.team-copy` | `/fundacja`: dwa słupy w `.stack-wide` (koło **nad** imieniem; imię Alexandria bez uppercase). `.team-copy` = Portable Text pod siatką, ten sam lewy brzeg co Zarząd; H2 jak tytuł sekcji (`text-h3`); proza `62ch` |
| `.body-figure` / `-small` / `-medium` / `-wide` / `-left` / `-center` / `-right` / `-inline` + `.body-image` | obraz w Portable Text. Figure ma jawną szerokość, żeby Wide mogło wyjść poza `.measure` (62ch). Small: `--body-image-small` (24 rem, obie osie). Medium (domyślnie, także brak pola): szerokość kolumny, wysokość `--body-image-max`. Wide: `--body-image-wide`, wysokość `min(90vh, --body-image-wide)`. Wyrównanie: lewo / środek (domyślnie, także brak pola) / prawo. **Block** = własny wiersz. **Wrap** (`.body-figure-inline`) = tekst opływa; tylko lewo albo prawo, tylko Small albo Medium, od 40rem. Na węższym ekranie wrap wraca do bloku. Szerokość opływu: `--body-image-inline` 14rem (Medium 18rem), wysokość max `--body-image-inline-max`. `--radius-media`. Nie `w-full` strony. |
| `.portable-body` | wrapper Portable Text (`text-lead`); `overflow-wrap: anywhere` na wrapperze i linkach — długie URL-e z dumpa nie rozpychają kolumny |
| `.pt-term` | styl Portable Text **Termin** (`term`): hasło z `Blob` jak listing, ale krój i waga body (Alexandria Light). Strong zostaje. Quote bez zmian. Odstęp `2.5rem` przed / `0.75rem` po (koło wystaje `1.8rem` w górę; w Indent marginesy się nie zlewają) |
| `.pt-indent` | lista Portable Text **Indent** — wcięcie akapitu (`--pt-indent` 3 rem); zagnieżdżenie (Tab w Studio) dokłada kolejny stopień |
| `.pt-roster` | lista Portable Text **Roles** (`listItem: roster`): dwukolumnowa lista ról / osób w lekkiej karcie (miękka ramka `--color-ink` 8%, delikatne wypełnienie `--color-sand`, `--radius-media`). Wiersz `rola: imiona` (cięcie na pierwszym `:`); rozstaw wierszy odstępem, nie liniami. Max `62ch` |
| `.pt-columns` / `-2` / `-3` | obiekt Portable Text **Columns**: 2 albo 3 kolumny od `lg` (1024 px); poniżej jedna kolumna. Od `lg` blok może wyjść poza `.measure`: każdy łam celuje w 62ch, całość nie szerzej niż treść `.page`. Każda kolumna ma ten sam rytm pionowy co pojedynczy łam (`space-y-4` na `.pt-column`). W kolumnie: tekst, obraz, YouTube, przycisk |
| `.pt-cta` / `-1` / `-2` / `-3` | obiekt Portable Text **Button** (`ctaButton`): zielone CTA w osobnym wierszu. Domyślnie do lewej; `-1`…`-3` to kolejne stopnie `--pt-indent` (jak lista Indent). Pusta etykieta albo brak celu = brak przycisku |
| `.pt-embed` / `-poster` / `-play` / `-dot` | obiekt Portable Text **YouTube**: do kliknięcia okładka `i.ytimg.com` (maxres → sd → hq; brak klatki = piasek) i zielone koło play z kółkami palety na hover/focus; potem iframe `youtube-nocookie` z autododtwarzaniem. Playlista bez id filmu: ten sam kadr bez stilla. `--radius-media`. Chrome: `subpage-copy.video.play` |
| `.filter-row-switches` | `/czytelnia`: rodzaj = rząd CTA (rulka + kropka). Tylko szuflady z `listed` pozycjami; rząd znika, gdy zostaje jedna. `scroll={false}`. |
| `.pub-cat` / `-head` / `-toggle` / `-action` | `/czytelnia`: sekcje kategorii. Tytuł Alexandria Light magenta, bez uppercase, `(n)` szare; spory odstęp pod nagłówkiem (blob pierwszego wiersza). Bez `?kategoria=` wszystkie otwarte; z parametrem tylko ta sekcja (slug Category, np. `teatr-forum`). Nagłówek to link (`scroll={false}`), hover „zwiń” / „pokaż wszystkie”. Chip rodzaju zachowuje `kategoria`. Płaska lista, gdy rodzaj nie ma żadnego tagu. |
| `.blob-row-label` / `.blob-row-compact` / `.blob-row-excerpt` | Archiwum na `/projekty` (`density="compact"`): etykieta magenta zdaniowa; dwie kolumny od `lg` z lekkim offsetem prawej (`--archive-stagger`); wycinek max. 3 linie; bez plamy za tytułem |

## Prymitywy

W `apps/web/src/components/`:

- `layout/section.tsx` — `<Section>` daje rytm pionowy i domyślnie owija dzieci w `.page`. Z `bleed` nie owija, gdy coś ma sięgać krawędzi.
- `visual/dot-band.tsx` — pasmo kropek; rozmiar steruje `--dot-size`. Koła rysuje `radial-gradient(circle closest-side, …)` — bez `closest-side` promień idzie do narożnika kafla i między kropkami zostaje szczelina. Szerokość rzędu to `round(up, 50%, --dot-size)`: każdy rząd dobija do swojej krawędzi strony, a reszta z zaokrąglenia ląduje na środku, gdzie rzędy się zachodzą i schodek ją ukrywa (`round(down, …)` parkuje resztę na krawędziach i widać wcięcie). Prop `mirror` odbija schodek — dla sekcji, która kończy się zdjęciem po **lewej**, żeby rząd od strony zdjęcia był górnym i jechał po jego dolnej krawędzi.
- `visual/palette-row.tsx` — siedem stykających się kół marki.
- `visual/blob.tsx` — piaskowe koło za nagłówkiem. Wymaga przodka z `position: relative` (`.stack-item`, `.pt-term`). Stacking context jest na `.stack` / `.portable-body`, żeby koło było **pod** tekstem sąsiednich bloków. Przesunięcie w lewo jest ograniczone do `--page-pad`, żeby koło nie było ucinane krawędzią viewportu na wąskich ekranach.
- `visual/cta-link.tsx` — zielony link z rulką i kropką. Najczęstszy element Figmy, 46 instancji. Ten sam wygląd ma blok **Button** w Portable Text (`.pt-cta`). Prop `presentational` renderuje go jako `<span aria-hidden>` — do użycia w klikalnym kafelku, gdzie link kafelka prowadzi już w to samo miejsce i drugi byłby zdublowanym przystankiem dla klawiatury i czytnika. Href z CMS idzie przez allowlistę (`lib/safe-url.ts`).
- `visual/media.tsx` — `next/image` plus builder Sanity. Warianty `bleed` (promień 0) i `inset` (promień 16), proporcje `portrait` / `landscape` / `album` albo `none` (hero: kadr bez własnej proporcji). Przycięcie `object-cover` trzyma się hotspotu (i cropu) z Sanity; bez hotspotu kadr zostaje na środku. Bez obrazu rysuje piaskowy blok, chyba że dostanie `fallbackSrc`. Moduł kafelków bez zdjęcia nie podstawia pliku z `public/`.
- `visual/image-gallery.tsx` — klient: mozaika; lightbox (`yet-another-react-lightbox` + Zoom) ładuje się dopiero po otwarciu (`next/dynamic`, `ssr: false`). Kafelki przez `Media` (`object-cover`); lightbox `fit("max")` + `srcSet`, kadr `contain`, bez upscalingu (`maxZoomPixelRatio: 1`). `LeadGallery` i `PortableBody` zostają serwerowe. `YoutubeEmbed` to mała wyspa kliencka w Portable Text (okładka, iframe po play). `PageHero` **nie** importuje `PortableBody` (dzieci w kolumnie copy, np. `/kontakt`). Chrome PL: `subpage-copy.ts` (`gallery.*`, `video.play`).

## Jak dołożyć sekcję

1. Otwórz zrzut ramki z Figmy (`get_screenshot` na node ID z [figma-baseline.md](figma-baseline.md)) i nazwij układ: to `.split`, `.cols-3` czy `.stack`.
2. Utwórz plik w `apps/web/src/components/sections/`. Sekcja przyjmuje **dane**, nie pojedyncze stringi — łatwiej wtedy obsłużyć pustkę.
3. Złóż ją z prymitywów. Jeśli sięgasz po arbitrary value, to znak, że brakuje klasy albo tokenu — dopisz je zamiast obchodzić system.
4. Obsłuż zero elementów i brak zdjęcia.
5. Sprawdź przy 1440, 1024 i 375 px.

## Reguły responsywności

Autorskie, bo Figma ich nie ma:

- Typografia i odstępy skalują się przez `clamp()`, bez breakpointów.
- Poniżej **1024 px** (`lg`):
  - header jest **sticky**: logo + przycisk menu; cztery pozycje w pełnoekranowym overlayu na `sand`. Cele klikalne ≥ `--touch-target`. Od `lg` poziomy rząd; na `/` (`data-home`) i na podstronach ze `data-split-hero` header wychodzi z pionowego flow i siada w lewej kolumnie.
  - `.split` układa się pionowo, **tekst pierwszy**. Zdjęcie traci bleed: kadr inset, `aspect-ratio` 4:5, `max-height: var(--media-split-max)` (42vh), w `--page-pad`.
  - `.hero` nie jest stacked portretem. Kolejność: H1 → kadr w kole (`--hero-media-span`, `Blob` za kołem) → lead i CTA. Pasmo kół pod hero **nie** nachodzi na koło.
- Poniżej **768 px** trzy kolumny stają się jedną (`.cols-3` po drodze przechodzi przez dwie).
- Koła w paśmie: **82 px** na desktopie, skok do **48 px** poniżej 768 px (nie ciągły `clamp`). Paleta nadal `clamp` 44–113 px.

## Świadome odstępstwa od Figmy

| Figma | Kod | Dlaczego |
|-------|-----|----------|
| interlinia 43 px przy 18 px tekstu | 1,72 (czyli 31 px) | 2,39 to przeklejenie; zajawki w tym samym pliku mają 18/31 |
| interlinia 67 px przy 24 px | 1,25 | ta sama pomyłka, przeklejone z nagłówka 48 px; ciasna interlinia Black |
| interlinia 67 px przy 48 px | 1,1 | 1,4 z pierwszej fazy było za luźne na display Black |
| `text-h1` 36 px (pierwsza skala) | alias `text-display` (48) | w ramce nie ma stopnia 36; tytuł strony = tytuł hero |
| zielony `#369125` w tekście | `#2f7d20` (`green-ink`) | oryginał daje 4,0:1 i nie przechodzi WCAG AA; dekoracje zostają na oryginale |
| czerń tekstu `#000000` | `#282828` (`ink`) | jedna czerń zamiast dwóch |
| 11 różnych lewych marginesów | `--page-pad` i `--page-indent` | rozrzut ręcznego rysowania, nie intencja |
| kolumna tekstu wyśrodkowana w stronie (równe marginesy) | `.measure`, `.stack-narrow`, `.stack-wide` i hero tekstowy przy lewej krawędzi `.page` | długi tekst i listingi czyta się od wspólnej lewej; szerokość kolumny zostaje, reszta miejsca jest po prawej |
| zdjęcie hero od y = 0, za nagłówkiem, kadr 481×823 | na `lg+`: fotka od góry **prawej kolumny**, przycięta do wysokości tekstu (hotspot zostaje); logo i nav w lewej (ten sam span co `.split-text`). Poniżej `lg`: H1, potem kadr w kole, nav w sticky overlayu | nav nigdy nie nachodzi na zdjęcie. Sztywny portret zostawiał puste pole pod krótkim leadem i spychał resztę strony. Ten sam portret na pełną szerokość telefonu zjadał pierwszy ekran — brak makiet mobilnych, nie intencja |
| paleta na x = 269 | wyśrodkowana | pozycja w Figmie nie wynika z żadnej siatki |
| trzeci krój Poppins | MuseoModerno | 6 wystąpień wobec dwóch rodzin w reszcie pliku |
| `Rectangle 2` i biała etykieta „Baza wiedzy" | pominięte | pusty kształt bez wypełnienia i biały tekst na białym tle |
| pasmo kropek pod „Kim jesteśmy?" schodkuje w górę w prawo | schodek odbity (`DotBand mirror`) | w ramce blok „Metody" kończy się ~120 px wyżej niż u nas, więc górny rząd trafiał na CTA „dowiedz się więcej". Po odbiciu rząd przy zdjęciu jest górny i nadal jedzie po jego dolnej krawędzi, a dolny schodzi w pustą przestrzeń — niezależnie od długości tekstu z CMS-u |

## Copy chrome vs Figma

Etykiety UI (filtry, „więcej”, puste listy) mogą zostać w `homepage-copy.ts` / `subpage-copy.ts`. **Treść editorialna (tytuły, leady, CTA, summary, body) jest tylko z CMS.** Puste pole = ten blok nie pojawia się. Nie zapisujemy defaultów do datasetu i nie podstawiamy tekstu z ramki.

Hero homepage jest w `siteSettings` (heading, lead, CTA, zdjęcie). Reszta `/` to `homepageSections`: moduł aktualności i moduły kafelków (te same typy co `page.sections`). Pusta lista = pod hero nie ma sekcji. Kafelek bez własnego tytułu bierze tytuł dokumentu.

| Ramka | Kod | Status |
|-------|-----|--------|
| CTA Czytelni na `/` | etykieta kafelka, gdy redakcja ją wpisze; pustka = chrome „czytaj więcej” | jeden link na cały kafelek |
| Featured: osobny CTA na `/projekty` | kafelek prowadzi tylko do wybranego dokumentu | jeden adres; drugi cel = drugi kafelek |
| `siteSettings.homepageSections` | kolejność sekcji z CMS | seed: `pnpm seed:homepage-sections` |
| AG hero CTA (`79:200`) | „zobacz wszystkie edycje” (`#edycje`) — chrome listy, nie CMS | dryf modelu, przywrócone |
| AG lead (`79:191`) | `project.summary` | puste = brak leadu |
| H2 „Edycje” na AG | ramka nie ma tego nagłówka (lista od razu od roku) | brak w ramce — kotwica listy (`aria-label`) |
| Kontakt / Baza wiedzy — unikalny lead | `/kontakt` hero = `page.title` + `page.body`. `/baza-wiedzy` to zwykła strona `page` (tytuł, lead, body) | ramka kontaktu w budowie |
| Stopka — adres vs nazwa prawna | ramka: „Fundacja Kultury i Sztuki”; `/kontakt` ma nazwę prawną | `siteSettings.footer.address`. Nazwa prawna zostaje w body strony Kontakt |
| `siteSettings.homepageSections` | moduły kafelków i aktualności | pusta lista = brak sekcji pod hero |
| Fundacja hero CTA Group 43 (`130:1331`) | z `aboutPage` | puste = brak CTA |
| Wartości (`130:1462`…) | etykieta w kole, `sand`, koła stykają się; 8. = `brand-3` | lista z `aboutPage.methods.values`, pusta = brak kół. Poniżej `lg`: jeden przewijany rząd, etykiety bez łamania |
| Filtry Czytelni (`79:50`) | CTA rodzaju gdy ≥2 szuflady; kategorie jako sekcje (magenta Light, `(n)`, open/closed) | ramka ma szuflady. Brak tagów w rodzaju = płaska lista, bez „Pozostałe”. Chrome: „pokaż wszystkie”, „zwiń”, „Pozostałe” |
| Galeria `+N` / lightbox | `subpage-copy.gallery` (`+{n}`, „Otwórz galerię”, Zamknij / Następne / Poprzednie) | chrome, nie CMS |
| YouTube play | `subpage-copy.video.play` („Odtwórz film”) | chrome etykiety przycisku okładki |
| Skip link / 404 / błąd | `subpage-copy.a11y.skipToContent`, `.notFound`, `.error` | chrome; 404 i error bez copy z CMS |

## Stan na teraz

Gotowe na `/`: skład z ramki na `lg+` (nie pixel-perfect) oraz świadomy pass mobilny poniżej 1024 px. Hero na desktopie: dwie kolumny od góry viewportu — nav w lewej, zdjęcie od góry prawej (wysokość z tekstu, spad do krawędzi okna). Na mobile: sticky header z overlayem, H1 od razu, kadr w kole, potem lead. Pasma kół: stała średnica, pełne stykające się koła, rzędy przy krawędziach strony; na `lg+` zachodzą na krawędzie zdjęć (hero od dołu; „Kim jesteśmy?" po odbiciu schodka, gdy ten blok jest w CMS); poniżej `lg` pasmo pod hero nie nachodzi na koło. Aktualności (gdy sekcja jest w `homepageSections`) z nagłówkiem AKTUALNOŚCI (`text-h2` na H2), tytułami kart `text-h4` na H3, naprzemiennymi kolorami tytułu i daty (magenta / navy) i rulkami CTA na jednej linii; siatka ma szerszą rynnę niż 36 px z ramki. Dalsze sekcje `/` pochodzą z tej samej listy w CMS. Paleta wyśrodkowana jako grupa, stopka: logo+adres z lewej, cytat Boala z prawej. Ciągły tekst UI: Alexandria Light 18; hero i Portable Text: 20 (`text-lead`). Nagłówki zawsze wersalikami.

Klikalne kafelki: cały kafelek prowadzi pod jeden adres (etykieta linku jest dekoracją). Aktualność → artykuł.

Sprawdzone przez CDP na 1440 / 1280 / 1024 / 768 / 375: `scrollWidth == innerWidth` (brak przepełnienia poziomego), żaden element nie wychodzi za krawędzie, rulki CTA aktualności mają identyczne `top` w układzie wielokolumnowym, a test trafień (`elementFromPoint`) potwierdza jeden link na kafelek i osobno klikalne CTA Art Generacji.

Podstrony (2026-09-07): `PageHero` split + `data-split-hero` (overlay headera jak `/`, paleta stopki zostaje) + H1 `.hero-title`; `layout="stack"` na edycji. Puste pole hero w CMS = brak kadru, slot `.hero-media-empty` zostaje; puste title/lead/CTA = te elementy znikają. `BlobRow` `width` `page` (domyślnie) / `narrow` / `wide`, `density="compact"` = para od `lg` z magenta `.blob-row-label`, clamp wycinka i offsetem prawej kolumny. `/projekty` = paleta po hero, aktywne (+ Czytelnia gdy `showCzytelnia`, copy z `landing-czytelnia`), paleta + pasmo, archiwum compact. AG: lead z `project.summary`, pełne `body` przed listą edycji `wide` w `#edycje`. Edycja: hero stack + mozaika (max. 4 kafelki, lightbox na resztę). `/baza-wiedzy` to zwykła strona `page` (opis metod); `/metody` przekierowuje tam. `/fundacja` = singleton `aboutPage` (pusta lista = brak sekcji). `/zespol` listing zostaje rzędem kół (wszyscy `person`). `/kontakt` hero = tytuł i body strony `kontakt` w CMS; `data-no-palette` chowa paletę przed stopką; bez formularza, maile z `person.email`. Stopka: lewa logo+adres, prawa cytat (`siteSettings.footer`). `/czytelnia` = CTA rodzaju gdy ≥2 szuflady; kategorie jako sekcje (domyślnie otwarte) albo płaska lista bez tagów. Portable Text: sąsiednie obrazy sklejane w mozaikę (puste akapity = klej); pojedynczy obraz zostaje przy `size`. 375 px: H1 w pierwszym ekranie, koło 227 px, bez overflow.
