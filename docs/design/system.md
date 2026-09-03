# System wizualny — jak budować sekcje

**Czytaj to przed dotknięciem czegokolwiek w `apps/web/src`.** Liczby źródłowe: [figma-baseline.md](figma-baseline.md). Decyzja architektoniczna i odrzucone warianty: [ADR-004](../decisions/ADR-004-layout-architecture.md).

Trzy warstwy, nic więcej: **tokeny → prymitywy → sekcje**. Nie ma piętra „komponentów editorialowych" — sekcja jest jednorazowa i tak.

## Zasady, których nie łamiemy

1. **Zero wartości w pikselach w plikach sekcji.** Wszystko idzie z tokenów albo z klas kompozycyjnych. Jeśli czegoś nie da się wyrazić, dołóż klasę w `@layer components`, nie arbitrary value.
2. **Koła dekoracyjne rysujemy tłem, nie elementami.** Pasmo z Figmy to 270 identycznych kół. Jako DOM to 270 węzłów na stronę; jako `radial-gradient` to zero.
3. **Każda sekcja musi przeżyć puste dane.** Redaktor zostawi pole puste, galeria będzie miała zero zdjęć. Figma pokazuje stałą liczbę elementów, CMS ma zmienną — układ ma się nie rozsypać.
4. **Mobile ma własne reguły w tym pliku** — Figma nie ma ekranów mobilnych, więc nie zgadujemy poza tym, co tu zapisane.
5. **Nie „poprawiamy" tokenów z powrotem do surowych liczb z Figmy.** Odstępstwa są świadome i opisane niżej.

## Tokeny

Wszystkie w bloku `@theme` w [apps/web/src/app/globals.css](../../apps/web/src/app/globals.css).

**Kolory:** `sand`, `ink`, `green`, `green-ink`, `magenta`, `navy` oraz `brand-1` … `brand-7`. W Tailwindzie to zwykłe utility: `bg-sand`, `text-magenta`.

**Typografia:** `font-display` (MuseoModerno) i `font-body` (Alexandria), ładowane przez `next/font` w [layout.tsx](../../apps/web/src/app/layout.tsx). Skala niesie font-size razem z interlinią: `text-display`, `text-h1`, `text-h2`, `text-h3`, `text-lead`, `text-body`, `text-small`. Każdy stopień to `clamp()`, więc typografia skaluje się płynnie i nie potrzebuje breakpointów.

**Layout:** `--page-max` (1440), `--page-pad`, `--page-indent`, `--dot-size` (82 px, skok do 48 px poniżej 768 px — nie `clamp`), `--palette-size`, `--site-header-space` (desktopowy overlay na `/`), `--site-header-bar` (kompaktowy pasek poniżej `lg`), `--touch-target` (44 px), `--hero-media-span` (70%), `--media-split-max` (42vh), `--footer-quote-max` oraz `spacing-section` jako rytm pionowy (`py-section`).

## Klasy kompozycyjne

| Klasa | Do czego |
|-------|----------|
| `.page` | kontener wyśrodkowany, `--page-max` z `--page-pad` |
| `.split` / `.split-text` / `.split-media` | pełna szerokość viewportu; tekst w kolumnie ograniczonej do ~2/3 `--page-max` z `--page-pad`; zdjęcie dobija do krawędzi **viewportu** (od `lg`). Poniżej `lg`: tekst pierwszy, kadr inset 4:5 z `--media-split-max` |
| `.split-reverse` | to samo, ale zdjęcie po lewej (spad do lewej krawędzi) |
| `.hero` / `.hero-title` / `.hero-copy` / `.hero-media-wrap` / `.hero-media` | hero: od `lg` to `.split`; poniżej `lg` siatka H1 → kadr w kole (`--hero-media-span`) → lead/CTA |
| `.site-header` / `.site-nav-desktop` / `.site-nav-toggle` / `.site-nav-overlay` | chrome: poniżej `lg` sticky pasek + overlay; od `lg` poziomy rząd |
| `.cols-3` | 1 → 2 → 3 kolumny; aktualności, publikacje |
| `.news-card` + `.news-card-title` / `-body` / `-cta` | wspólna linia bazowa kart aktualności: tytuł zawsze na dwie linie, treść zbiera luz, rulka CTA na jednym poziomie niezależnie od długości tekstu |
| `.card-link` + `.cta-over` / `.card-hover` | klikalny kafelek: link tytułu rozciąga swój obszar kliknięcia na całą kartę. `.cta-over` wynosi nad nakładkę CTA prowadzące **gdzie indziej** niż kafelek (Art Generacje: kafelek → projekt, CTA → lista). `.card-hover` na karcie animuje rulkę CTA przy hoverze, gdy CTA tylko powtarza link kafelka |
| `.stack` / `.stack-item` | lista pionowa; `.stack-item` tworzy kontekst dla `Blob` |
| `.measure` | komfortowa szerokość czytania (62ch) |
| `.footer-quote` | cytat w stopce: do prawej, węższy niż `.measure` (`--footer-quote-max`) |

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
  - header jest **sticky**: logo + przycisk menu; cztery pozycje w pełnoekranowym overlayu na `sand`. Cele klikalne ≥ `--touch-target`. Od `lg` poziomy rząd; na `/` header nadal wychodzi z pionowego flow i siada w lewej kolumnie.
  - `.split` układa się pionowo, **tekst pierwszy**. Zdjęcie traci bleed: kadr inset, `aspect-ratio` 4:5, `max-height: var(--media-split-max)` (42vh), w `--page-pad`.
  - `.hero` nie jest stacked portretem. Kolejność: H1 → kadr w kole (`--hero-media-span`, `Blob` za kołem) → lead i CTA. Pasmo kół pod hero **nie** nachodzi na koło.
- Poniżej **768 px** trzy kolumny stają się jedną (`.cols-3` po drodze przechodzi przez dwie).
- Koła w paśmie: **82 px** na desktopie, skok do **48 px** poniżej 768 px (nie ciągły `clamp`). Paleta nadal `clamp` 44–113 px.

## Świadome odstępstwa od Figmy

| Figma | Kod | Dlaczego |
|-------|-----|----------|
| interlinia 43 px przy 18 px tekstu | 1,72 (czyli 31 px) | 2,39 to przeklejenie; zajawki w tym samym pliku mają 18/31 |
| interlinia 67 px przy 24 px | 1,35 | ta sama pomyłka, przeklejone z nagłówka 48 px |
| zielony `#369125` w tekście | `#2f7d20` (`green-ink`) | oryginał daje 4,0:1 i nie przechodzi WCAG AA; dekoracje zostają na oryginale |
| czerń tekstu `#000000` | `#282828` (`ink`) | jedna czerń zamiast dwóch |
| 11 różnych lewych marginesów | `--page-pad` i `--page-indent` | rozrzut ręcznego rysowania, nie intencja |
| zdjęcie hero od y = 0, za nagłówkiem | na `lg+`: fotka od góry **prawej kolumny**; logo i nav w lewej (ten sam span co `.split-text`). Poniżej `lg`: H1, potem kadr w kole, nav w sticky overlayu | nav nigdy nie nachodzi na zdjęcie. Portret 481:823 na pełną szerokość telefonu zjada pierwszy ekran — to nie była intencja, tylko brak makiet mobilnych |
| paleta na x = 269 | wyśrodkowana | pozycja w Figmie nie wynika z żadnej siatki |
| trzeci krój Poppins | MuseoModerno | 6 wystąpień wobec dwóch rodzin w reszcie pliku |
| `Rectangle 2` i biała etykieta „Baza wiedzy" | pominięte | pusty kształt bez wypełnienia i biały tekst na białym tle |
| pasmo kropek pod „Kim jesteśmy?" schodkuje w górę w prawo | schodek odbity (`DotBand mirror`) | w ramce blok „Metody" kończy się ~120 px wyżej niż u nas, więc górny rząd trafiał na CTA „dowiedz się więcej". Po odbiciu rząd przy zdjęciu jest górny i nadal jedzie po jego dolnej krawędzi, a dolny schodzi w pustą przestrzeń — niezależnie od długości tekstu z CMS-u |

## Stan na teraz

Gotowe na `/`: skład z ramki na `lg+` (nie pixel-perfect) oraz świadomy pass mobilny poniżej 1024 px. Hero na desktopie: dwie kolumny od góry viewportu — nav w lewej, portret od góry prawej i na spad do krawędzi okna. Na mobile: sticky header z overlayem, H1 od razu, kadr w kole, potem lead. Pasma kół: stała średnica, pełne stykające się koła, rzędy przy krawędziach strony; na `lg+` zachodzą na krawędzie zdjęć (hero od dołu, „Kim jesteśmy?" po odbiciu schodka też od dołu); poniżej `lg` pasmo pod hero nie nachodzi na koło. Aktualności z nagłówkiem AKTUALNOŚCI, naprzemiennymi kolorami tytułów (magenta / navy, jak w ramce) i rulkami CTA na jednej linii. Kim/Metody (`.split-reverse`; na mobile tekst, potem kadr 4:5; zdjęcie z `public/about-photo.jpg` dopóki Studio jest puste), Art Generacje i Czytelnia (blob za H2), paleta wyśrodkowana jako grupa, stopka z cytatem Boala do prawej.

Klikalne kafelki: karta aktualności → artykuł, Art Generacje → `/projekty/art-generacje` przy CTA prowadzącym na listę `/projekty`, Czytelnia → `/czytelnia`.

Sprawdzone przez CDP na 1440 / 1280 / 1024 / 768 / 375: `scrollWidth == innerWidth` (brak przepełnienia poziomego), żaden element nie wychodzi za krawędzie, rulki CTA aktualności mają identyczne `top` w układzie wielokolumnowym, a test trafień (`elementFromPoint`) potwierdza jeden link na kafelek i osobno klikalne CTA Art Generacji.

Listingi podstron (`/projekty`, `/zespol`, `/fundacja`, …) są nadal robocze z fazy migracji — dziedziczą nowy chrome, nie nowy skład treści. 375 px ma być wygodne w nawigacji i rytmie, nie 1:1 z ramką.
