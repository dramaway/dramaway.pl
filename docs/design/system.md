# System wizualny — jak budować sekcje

**Czytaj to przed dotknięciem czegokolwiek w `apps/web/src`.** Liczby źródłowe: [figma-baseline.md](figma-baseline.md). Decyzja architektoniczna i odrzucone warianty: [ADR-004](../decisions/ADR-004-layout-architecture.md).

Trzy warstwy, nic więcej: **tokeny → prymitywy → sekcje**. Nie ma piętra „komponentów editorialowych" — sekcja jest jednorazowa i tak.

## Zasady, których nie łamiemy

1. **Zero wartości w pikselach w plikach sekcji.** Wszystko idzie z tokenów albo z klas kompozycyjnych. Jeśli czegoś nie da się wyrazić, dołóż klasę w `@layer components`, nie arbitrary value.
2. **Koła dekoracyjne rysujemy tłem, nie elementami.** Pasmo z Figmy to 270 identycznych kół. Jako DOM to 270 węzłów na stronę; jako `radial-gradient` to zero.
3. **Każda sekcja musi przeżyć puste dane.** Redaktor zostawi pole puste, galeria będzie miała zero zdjęć. Figma pokazuje stałą liczbę elementów, CMS ma zmienną — układ ma się nie rozsypać.
4. **Nie wymyślamy mobile poza regułami z tego pliku.** W Figmie nie ma ani jednego ekranu mobilnego.
5. **Nie „poprawiamy" tokenów z powrotem do surowych liczb z Figmy.** Odstępstwa są świadome i opisane niżej.

## Tokeny

Wszystkie w bloku `@theme` w [apps/web/src/app/globals.css](../../apps/web/src/app/globals.css).

**Kolory:** `sand`, `ink`, `green`, `green-ink`, `magenta`, `navy` oraz `brand-1` … `brand-7`. W Tailwindzie to zwykłe utility: `bg-sand`, `text-magenta`.

**Typografia:** `font-display` (MuseoModerno) i `font-body` (Alexandria), ładowane przez `next/font` w [layout.tsx](../../apps/web/src/app/layout.tsx). Skala niesie font-size razem z interlinią: `text-display`, `text-h1`, `text-h2`, `text-h3`, `text-lead`, `text-body`, `text-small`. Każdy stopień to `clamp()`, więc typografia skaluje się płynnie i nie potrzebuje breakpointów.

**Layout:** `--page-max` (1440), `--page-pad`, `--page-indent`, `--dot-size`, `--palette-size` oraz `spacing-section` jako rytm pionowy (`py-section`).

## Klasy kompozycyjne

| Klasa | Do czego |
|-------|----------|
| `.page` | kontener wyśrodkowany, `--page-max` z `--page-pad` |
| `.split` / `.split-text` / `.split-media` | tekst obok zdjęcia dobijającego do krawędzi kontenera (2/3 – 1/3 od `lg`) |
| `.split-reverse` | to samo, ale zdjęcie po lewej |
| `.cols-3` | 1 → 2 → 3 kolumny; aktualności, publikacje |
| `.stack` / `.stack-item` | lista pionowa; `.stack-item` tworzy kontekst dla `Blob` |
| `.measure` | komfortowa szerokość czytania (62ch) |

## Prymitywy

W `apps/web/src/components/`:

- `layout/section.tsx` — `<Section>` daje rytm pionowy i domyślnie owija dzieci w `.page`. Z `bleed` nie owija, gdy coś ma sięgać krawędzi.
- `visual/dot-band.tsx` — pasmo kropek. Bez propsów; rozmiar steruje `--dot-size`.
- `visual/palette-row.tsx` — siedem stykających się kół marki.
- `visual/blob.tsx` — piaskowe koło za nagłówkiem. Wymaga przodka z `.stack-item` albo `relative isolate`.
- `visual/cta-link.tsx` — zielony link z rulką i kropką. Najczęstszy element Figmy, 46 instancji.
- `visual/media.tsx` — `next/image` plus builder Sanity. Warianty `bleed` (promień 0) i `inset` (promień 16), proporcje `portrait` / `landscape` / `album`. Bez obrazu rysuje piaskowy blok.

## Jak dołożyć sekcję

1. Otwórz zrzut ramki z Figmy (`get_screenshot` na node ID z [figma-baseline.md](figma-baseline.md)) i nazwij układ: to `.split`, `.cols-3` czy `.stack`.
2. Utwórz plik w `apps/web/src/components/sections/`. Sekcja przyjmuje **dane**, nie pojedyncze stringi — łatwiej wtedy obsłużyć pustkę.
3. Złóż ją z prymitywów. Jeśli sięgasz po arbitrary value, to znak, że brakuje klasy albo tokenu — dopisz je zamiast obchodzić system.
4. Obsłuż zero elementów i brak zdjęcia.
5. Sprawdź przy 1440, 1024 i 375 px.

## Reguły responsywności

Autorskie, bo Figma ich nie ma:

- Typografia i odstępy skalują się przez `clamp()`, bez breakpointów.
- Poniżej **1024 px** układy dzielone przechodzą w pionowe, zdjęcie traci bleed i zajmuje pełną szerokość.
- Poniżej **768 px** trzy kolumny stają się jedną (`.cols-3` po drodze przechodzi przez dwie).
- Koła w paśmie schodzą z 82 do 48 px, koła palety ze 113 do 44 px.

## Świadome odstępstwa od Figmy

| Figma | Kod | Dlaczego |
|-------|-----|----------|
| interlinia 43 px przy 18 px tekstu | 1,72 (czyli 31 px) | 2,39 to przeklejenie; zajawki w tym samym pliku mają 18/31 |
| interlinia 67 px przy 24 px | 1,35 | ta sama pomyłka, przeklejone z nagłówka 48 px |
| zielony `#369125` w tekście | `#2f7d20` (`green-ink`) | oryginał daje 4,0:1 i nie przechodzi WCAG AA; dekoracje zostają na oryginale |
| czerń tekstu `#000000` | `#282828` (`ink`) | jedna czerń zamiast dwóch |
| 11 różnych lewych marginesów | `--page-pad` i `--page-indent` | rozrzut ręcznego rysowania, nie intencja |
| zdjęcie hero od y = 0, za nagłówkiem | zaczyna się pod nagłówkiem | nagłówek jest wspólnym komponentem układu; wciąganie go w hero byłoby kruche |
| paleta na x = 269 | wyśrodkowana | pozycja w Figmie nie wynika z żadnej siatki |
| trzeci krój Poppins | MuseoModerno | 6 wystąpień wobec dwóch rodzin w reszcie pliku |
| `Rectangle 2` i biała etykieta „Baza wiedzy" | pominięte | pusty kształt bez wypełnienia i biały tekst na białym tle |

## Stan na teraz

Gotowe: tokeny, fonty, klasy kompozycyjne, wszystkie sześć prymitywów, nagłówek, hero, oraz na `/` wyróżniony projekt + aktualności (`.cols-3`) + karty projektów ze zdjęciami z CMS.

Do zrobienia na stronie głównej: blok „Kim jesteśmy?" i „Metody" (`.split-reverse`), bloki Art Generacje i Czytelnia, stopka z cytatem Boala. Listingi podstron (`/projekty`, `/zespol`, …) są nadal robocze z fazy migracji.
