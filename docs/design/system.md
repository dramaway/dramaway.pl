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

**Typografia:** `font-display` (MuseoModerno 600/800/900) i `font-body` (Alexandria 300/400/600), ładowane przez `next/font` w [layout.tsx](../../apps/web/src/app/layout.tsx). Ciągły tekst jest Light (300) z `body`; nagłówki dostają `font-black` i `uppercase` (z `@layer base`, kopia w CMS zostaje w zdaniach — transform jest wizualny). **Wyjątek:** H1 hero (`.hero-title`) zostaje w kapitalizacji zdaniowej — wersaliki na 48 px Black są za ciężkie. Skala na desktopie (clamp w dół na węższych): `text-display` / `text-h1` 48 — tytuł hero i strony; `text-h2` 32 — etykieta pasma (AKTUALNOŚCI); `text-h3` 24 — tytuły sekcji (Kim, Metody, Art Generacje, Czytelnia); `text-h4` 20 — tytuły kart aktualności; `text-lead` 20 — opis hero i bloki pisane; `text-body` 18 — teksty pod blokami na `/`; `text-small` 14 — daty, etykiety. **Klasa rozmiaru ≠ tag HTML.** Outline na `/`: jeden H1 (hero), H2 na każdą sekcję, H3 na karty aktualności — bez przeskoków. Wizualnie AKTUALNOŚCI jest większe niż Kim / teasery (`text-h2` vs `text-h3` na H2); tytuły newsów są H3 w `text-h4`.

**Layout:** `--page-max` (1440), `--page-pad`, `--page-indent`, `--dot-size` (82 px, skok do 48 px poniżej 768 px — nie `clamp`), `--palette-size`, `--site-header-space` (desktopowy overlay na `/` i na podstronach ze `data-split-hero`), `--site-header-bar` (kompaktowy pasek poniżej `lg`), `--touch-target` (44 px), `--hero-media-span` (70%), `--media-split-max` (42vh), `--hero-media-max` (kadr split-hero + nachodzące pasmo w `100vh`), `--footer-quote-max`, `--content-narrow` (773 px, teasery Art Generacje / Czytelnia), `--content-wide` (~1181 px, leady list na podstronach), `--body-image-small` (24 rem), `--body-image-wide` (`--content-wide`), `--body-image-max` (`min(36rem, 70vh)` — kadr **medium** w Portable Text) oraz `spacing-section` jako rytm pionowy (`py-section`).

## Klasy kompozycyjne

| Klasa | Do czego |
|-------|----------|
| `.page` | kontener wyśrodkowany, `--page-max` z `--page-pad` |
| `.split` / `.split-text` / `.split-media` | pełna szerokość viewportu; tekst w kolumnie ograniczonej do ~2/3 `--page-max` z `--page-pad`; zdjęcie dobija do krawędzi **viewportu** (od `lg`). Poniżej `lg`: tekst pierwszy, kadr inset 4:5 z `--media-split-max` |
| `.split-reverse` | to samo, ale zdjęcie po lewej (spad do lewej krawędzi) |
| `.hero` / `.hero-title` / `.hero-heading` / `.hero-copy` / `.hero-media-wrap` / `.hero-media` / `.hero-stack` | hero: od `lg` to `.split`; poniżej `lg` siatka H1 → kadr w kole (`--hero-media-span`) → lead/CTA. `.hero-heading` owija okruch + H1 na podstronach; `.hero-title` zostawia **każdy** H1 hero (homepage i podstrony) w kapitalizacji zdaniowej. `.hero-stack` = tekstowy hero edycji (bez `data-split-hero`) |
| `[data-home]` / `[data-split-hero]` | od `lg` overlay headera w lewej kolumnie. Tylko `data-home` (`/`) chowa `.subpage-palette`. `data-split-hero` ogranicza kadr do `--hero-media-max` |
| `.site-header` / `.site-nav-desktop` / `.site-nav-toggle` / `.site-nav-overlay` | chrome: poniżej `lg` sticky pasek + overlay; od `lg` poziomy rząd |
| `.cols-3` | 1 → 2 → 3 kolumny; aktualności, publikacje. Rynna szersza niż 36 px z ramki — świadomie więcej światła |
| `.news-card` + `.news-card-title` / `-body` / `-cta` | wspólna linia bazowa kart aktualności: tytuł zawsze na dwie linie, treść zbiera luz, rulka CTA na jednym poziomie niezależnie od długości tekstu |
| `.card-link` + `.cta-over` / `.card-hover` | klikalny kafelek: link tytułu rozciąga swój obszar kliknięcia na całą kartę. `.cta-over` wynosi nad nakładkę CTA prowadzące **gdzie indziej** niż kafelek (Art Generacje: kafelek → projekt, CTA → lista). `.card-hover` na karcie animuje rulkę CTA przy hoverze, gdy CTA tylko powtarza link kafelka |
| `.stack` / `.stack-item` | lista pionowa; `.stack-item` tworzy kontekst dla `Blob` |
| `.stack-narrow` | wyśrodkowuje blok jako kolumnę (`--content-narrow`); tekst w środku zostaje do lewej |
| `.stack-wide` | to samo dla `--content-wide` (~1181 px) |
| `.measure` | komfortowa szerokość czytania (62ch) |
| `.footer-quote` | cytat w stopce: do prawej, węższy niż `.measure` (`--footer-quote-max`) |
| `.gallery-lead` / `.gallery-lead-row` | galeria edycji: 1 kadr landscape + do 3 pionowych od `lg` |
| `.team-row` / `.team-photo` | siatka okrągłych portretów zespołu |
| `.values-row` / `.values-item` | `/fundacja`: rząd etykietowanych kół wartości (chrome, `brand-1`…; 8. owija paletę) |
| `.team-bios` / `.team-bio` / `.team-bio-blurb` | `/fundacja`: dwa słupy bio (koło + imię + zajawka 4 linie + CTA) |
| `.body-figure` / `-small` / `-medium` / `-wide` + `.body-image` | obraz w Portable Text. Figure ma jawną szerokość, żeby Wide mogło wyjść poza `.measure` (62ch). Small: `--body-image-small` (24 rem, obie osie). Medium (domyślnie, także brak pola): szerokość kolumny, wysokość `--body-image-max`. Wide: `--body-image-wide`, wysokość `min(90vh, --body-image-wide)`. `--radius-media`. Nie `w-full` strony. |
| `.portable-body` | wrapper Portable Text (`text-lead`); `overflow-wrap: anywhere` na wrapperze i linkach — długie URL-e z dumpa nie rozpychają kolumny |
| `.filter-row-switches` | `/czytelnia`: rodzaj = rząd CTA (rulka + kropka). Tylko szuflady z `listed` pozycjami; rząd znika, gdy zostaje jedna. `scroll={false}`. |
| `.pub-cat` / `-head` / `-toggle` / `-action` | `/czytelnia`: sekcje kategorii. Tytuł + `(n)`; start 3 wiersze; hover/focus „pokaż wszystkie” / „zwiń”; zwiniecie chowa całość. Delikatna kreska między sekcjami. |

## Prymitywy

W `apps/web/src/components/`:

- `layout/section.tsx` — `<Section>` daje rytm pionowy i domyślnie owija dzieci w `.page`. Z `bleed` nie owija, gdy coś ma sięgać krawędzi.
- `visual/dot-band.tsx` — pasmo kropek; rozmiar steruje `--dot-size`. Koła rysuje `radial-gradient(circle closest-side, …)` — bez `closest-side` promień idzie do narożnika kafla i między kropkami zostaje szczelina. Szerokość rzędu to `round(up, 50%, --dot-size)`: każdy rząd dobija do swojej krawędzi strony, a reszta z zaokrąglenia ląduje na środku, gdzie rzędy się zachodzą i schodek ją ukrywa (`round(down, …)` parkuje resztę na krawędziach i widać wcięcie). Prop `mirror` odbija schodek — dla sekcji, która kończy się zdjęciem po **lewej**, żeby rząd od strony zdjęcia był górnym i jechał po jego dolnej krawędzi.
- `visual/palette-row.tsx` — siedem stykających się kół marki.
- `visual/blob.tsx` — piaskowe koło za nagłówkiem. Wymaga przodka z `.stack-item` albo `relative isolate`. Przesunięcie w lewo jest ograniczone do `--page-pad`, żeby koło nie było ucinane krawędzią viewportu na wąskich ekranach.
- `visual/cta-link.tsx` — zielony link z rulką i kropką. Najczęstszy element Figmy, 46 instancji. Prop `presentational` renderuje go jako `<span aria-hidden>` — do użycia w klikalnym kafelku, gdzie link kafelka prowadzi już w to samo miejsce i drugi byłby zdublowanym przystankiem dla klawiatury i czytnika.
- `visual/media.tsx` — `next/image` plus builder Sanity. Warianty `bleed` (promień 0) i `inset` (promień 16), proporcje `portrait` / `landscape` / `album`. Bez obrazu rysuje piaskowy blok, chyba że dostanie `fallbackSrc` (lokalny plik z `public/`, np. `about-photo.jpg` w bloku „Kim jesteśmy?" — do czasu wgrania zdjęcia do Studia).

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
| zdjęcie hero od y = 0, za nagłówkiem | na `lg+`: fotka od góry **prawej kolumny**; logo i nav w lewej (ten sam span co `.split-text`). Poniżej `lg`: H1, potem kadr w kole, nav w sticky overlayu | nav nigdy nie nachodzi na zdjęcie. Portret 481:823 na pełną szerokość telefonu zjada pierwszy ekran — to nie była intencja, tylko brak makiet mobilnych |
| paleta na x = 269 | wyśrodkowana | pozycja w Figmie nie wynika z żadnej siatki |
| trzeci krój Poppins | MuseoModerno | 6 wystąpień wobec dwóch rodzin w reszcie pliku |
| `Rectangle 2` i biała etykieta „Baza wiedzy" | pominięte | pusty kształt bez wypełnienia i biały tekst na białym tle |
| pasmo kropek pod „Kim jesteśmy?" schodkuje w górę w prawo | schodek odbity (`DotBand mirror`) | w ramce blok „Metody" kończy się ~120 px wyżej niż u nas, więc górny rząd trafiał na CTA „dowiedz się więcej". Po odbiciu rząd przy zdjęciu jest górny i nadal jedzie po jego dolnej krawędzi, a dolny schodzi w pustą przestrzeń — niezależnie od długości tekstu z CMS-u |

## Copy chrome vs Figma

Etykiety UI (nie body z Drupala) biorą się z ramek. Kanon w `apps/web/src/lib/homepage-copy.ts` i `subpage-copy.ts`. **Nie wypełniać** `siteSettings.homepage` w Studio — puste pole = fallback z ramki; wypełnione nadpisuje kanon po cichu. Hero w CMS już istnieje: heading i CTA zgadzają się z `59:608`; lead był innym akapitem (Drupal) i wraca do tekstu z ramki.

| Ramka | Kod | Status |
|-------|-----|--------|
| CTA Czytelni na `/`: „poznajmy się” (`59:724`) | to samo | **otwarte z designerki** — kopia CTA „Kim jesteśmy?” |
| Featured: kafelek → AG, CTA „poznaj nasze projekty” → `/projekty` | to samo | zamierzone (kafelki wyżej) |
| AG hero CTA (`79:200`) | było „zobacz wszystkie relacje”; jest „zobacz wszystkie edycje” | dryf modelu, przywrócone (kotwica `#edycje`) |
| AG lead (`79:191`) | było zajawką z home; jest tekst z ramki AG | dryf, przywrócone |
| H2 „Edycje” na AG | ramka nie ma tego nagłówka (lista od razu od roku) | brak w ramce — kotwica listy |
| Kontakt / hub Bazy — unikalny lead | krótki opis / reuse leadów z home | ramka kontaktu w budowie; hub bez osobnego akapitu w `79:50` (limit MCP) |
| `siteSettings.homepage` | puste | zostawić puste |
| Fundacja hero CTA Group 43 (`130:1331`) | „zobacz nasze publikacje” → `/czytelnia` | quoted ze zrzutu; instancja nie ma href — Czytelnia = publikacje |
| Filtry Czytelni (`79:50`) | przełączniki CTA tylko dla niepustych rodzajów; kategorie jako sekcje z `(n)`, preview 3, hover pokaż wszystkie/zwiń | ramka ma szuflady; puste rodzaje ukryte. Sekcje kategorii to decyzja poza ramką. Chrome: „pokaż wszystkie”, „zwiń”, „Pozostałe” |

## Stan na teraz

Gotowe na `/`: skład z ramki na `lg+` (nie pixel-perfect) oraz świadomy pass mobilny poniżej 1024 px. Hero na desktopie: dwie kolumny od góry viewportu — nav w lewej, portret od góry prawej i na spad do krawędzi okna. Na mobile: sticky header z overlayem, H1 od razu, kadr w kole, potem lead. Pasma kół: stała średnica, pełne stykające się koła, rzędy przy krawędziach strony; na `lg+` zachodzą na krawędzie zdjęć (hero od dołu, „Kim jesteśmy?" po odbiciu schodka też od dołu); poniżej `lg` pasmo pod hero nie nachodzi na koło. Aktualności z nagłówkiem AKTUALNOŚCI (`text-h2` na H2), tytułami kart `text-h4` na H3, naprzemiennymi kolorami tytułu i daty (magenta / navy) i rulkami CTA na jednej linii; siatka ma szerszą rynnę niż 36 px z ramki. Kim/Metody (`.split-reverse`; oba H2 na `text-h3` + `text-body`; na mobile tekst, potem kadr 4:5; zdjęcie z `public/about-photo.jpg` dopóki Studio jest puste), Art Generacje i Czytelnia (`.stack-narrow`, H2 na `text-h3` + `text-body`, blob za H2), paleta wyśrodkowana jako grupa, stopka z cytatem Boala do prawej. Ciągły tekst UI: Alexandria Light 18; hero i Portable Text: 20 (`text-lead`). Nagłówki zawsze wersalikami.

Klikalne kafelki: karta aktualności → artykuł, Art Generacje → `/projekty/art-generacje` przy CTA prowadzącym na listę `/projekty`, Czytelnia → `/czytelnia`.

Sprawdzone przez CDP na 1440 / 1280 / 1024 / 768 / 375: `scrollWidth == innerWidth` (brak przepełnienia poziomego), żaden element nie wychodzi za krawędzie, rulki CTA aktualności mają identyczne `top` w układzie wielokolumnowym, a test trafień (`elementFromPoint`) potwierdza jeden link na kafelek i osobno klikalne CTA Art Generacji.

Podstrony (2026-09-06): `PageHero` split + `data-split-hero` (overlay headera jak `/`, paleta stopki zostaje) + H1 `.hero-title`; `layout="stack"` na edycji. `BlobRow` `width` `page` (domyślnie) / `narrow` / `wide`, `density="compact"` dwukolumnowo na pełnym `.page`. `/projekty` = paleta po hero, aktywne + Czytelnia `wide`, paleta + pasmo, archiwum compact. AG: lead z ramki (bez intro Drupala), paleta, lista edycji `wide` w `#edycje` bez H2, reszta dumpa pod spodem. Edycja: hero stack + galeria 1+3. Hub `/baza-wiedzy` + `/metody`. `/fundacja` = hero CTA „zobacz nasze publikacje”, metody i wartości (koła z etykietami), zespół w dwóch słupach bio, paleta przed dokumentami jako listą CTA. `/zespol` listing zostaje rzędem kół. `/kontakt` bez formularza (maile tylko z `person.email`). `/czytelnia` = CTA rodzaju tylko gdy ≥2 niepuste szuflady; kategorie jako sekcje (3 wiersze, hover expand/collapse). 375 px: H1 w pierwszym ekranie, koło 227 px, bez overflow.
