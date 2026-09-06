# Figma — pomiary źródłowe

**Surowe liczby z pliku projektowego.** Ten dokument istnieje po to, żeby nie wołać Figmy przy każdej sekcji. Jeśli potrzebujesz wartości, weź ją stąd. Do MCP sięgaj tylko po zrzut ekranu konkretnej ramki albo po eksport assetu.

Pomiar: 2026-08-30, cały canvas (1267 węzłów).

## Plik

- fileKey: `Tf7i787tVTBTE4j7LFXXUX`
- Stary klucz `yjpLV44NfMXZtU774I1ZRY` to udostępniony plik Untitled (Starter, 20 wywołań MCP / mies.).
- Jedna strona: `0:1` („Page 1")

| Ekran | node ID | Rozmiar |
|-------|---------|---------|
| Strona główna | `59:608` | 1440 × 4188 |
| Projekty | `59:935` | 1440 × 4211 |
| Art Generacje | `79:183` | 1440 × 6064 |
| Edycja projektu | `127:639` | 1440 × 4913 |
| baza wiedzy | `79:50` | 1440 × 6784 |
| o fundacji | `130:1316` | 1440 × 6784 |
| kontakt (w budowie) | `130:1818` | 1440 × 6784 |

## Czym ten plik nie jest

- **Zero auto-layoutu** — wszystkie 1267 węzłów pozycjonowane absolutnie, 481 grup.
- **Zero zmiennych, stylów tekstowych, kolorów i efektów.**
- **Zero komponentów lokalnych.** Są 46 instancji, ale ich komponenty źródłowe leżą poza plikiem: `Group 43` (43 razy) i `Group 44` (3 razy) — to zielony link CTA 301 × 46.
- **Zero ekranów mobilnych.** Wszystkie siedem ramek ma 1440 px.

Wniosek: to kierunek wizualny, nie specyfikacja. Proporcje i rytm bierzemy stąd, ale geometrię normalizujemy.

## Kolory

| Hex | Użyć | Rola |
|-----|------|------|
| `#f1efe8` | 335 | piaskowy — koła, pasma, tła placeholderów |
| `#369125` | 129 | zielony — dekoracja, podkreślenia CTA |
| `#000000` | 107 | tekst ciągły |
| `#282828` | 41 | nagłówki |
| `#b22869` | 27 | magenta — daty, etykiety, aktywna nawigacja |
| `#ffffff` | 16 | tekst na zdjęciach |
| `#031f58` | 2 | granat, użyty szczątkowo |

Paleta marki, siedem kół od lewej: `#b22869`, `#369125`, `#e5b91f`, `#d44688`, `#426a21`, `#34466b`, `#51648a`.

## Typografia

Dwie rodziny plus jedna pomyłka. Obie są na Google Fonts z podzbiorem `latin-ext`.

- **MuseoModerno** — nagłówki, nawigacja, CTA. Wagi: Light, Regular, Medium, SemiBold, Bold, ExtraBold, Black.
- **Alexandria** — tekst ciągły. Wagi: ExtraLight, Light, Regular, SemiBold.
- **Poppins Black 20** — 6 wystąpień, biały tekst na zdjęciach. Traktujemy jako pomyłkę.

Na 243 teksty przypada 27 kombinacji rozmiar/interlinia/kolor. Najczęstsze:

| Krój | Rozmiar / interlinia | Użyć | Rola |
|------|---------------------|------|------|
| MuseoModerno SemiBold | 18 / 43 | 57 | etykieta CTA (`#369125`) |
| Alexandria Light | 18 / 43 | 43 | tekst ciągły |
| MuseoModerno Black | 24 / 67 | 30 | nagłówek pozycji listy |
| MuseoModerno SemiBold | 20 / 43 | 22 | nawigacja |
| MuseoModerno Black | 48 / 67 | 7 | nagłówek strony |
| Alexandria Light | 18 / 31 | 3 | zajawka aktualności |

**Interlinia 43 px jest artefaktem.** Występuje przy 15, 16, 18, 20, 24, 32 i 36 px, czyli od 1,19 do 2,39 wysokości znaku. Dowód, że to przeklejenie: zajawki aktualności w tym samym pliku mają 18 / 31, czyli sensowne 1,72. Skalę w kodzie zbudowano na proporcjach, nie na tej stałej — patrz `system.md`.

## Geometria

**Marginesy nie trzymają siatki.** Zmierzone lewe krawędzie: 88, 94, 95, 96, 98, 102, 122, 135, 152, 154, 156. To rozrzut ręcznego rysowania.

**Jedyna stabilna proporcja to 2/3.** Zdjęcia bleedujące z prawej zaczynają się na x = 959, 960, 960, 960, 964 przy ramce 1440. Zdjęcie bleedujące z lewej ma szerokość 547 (38%) i do żadnej siatki nie pasuje.

Z tego wynika, że **siatka 12-kolumnowa nie ma pokrycia** — wystarczy kontener i kilka nazwanych układów.

Inne powtarzalne wymiary:

- Nagłówki i tekst hero: ramka 773 px szerokości, tekst ciągły 754 px
- Aktualności: trzy kolumny 376 px, krok 412, czyli rynna 36 px, start x = 171
- Logo: 117 × 57 px, **raster, nie wektor** — w pliku nie ma warstwy SVG

## Koła

356 elips, trzy różne zastosowania:

| Rozmiar | Ilość | Rola |
|---------|-------|------|
| 82 × 82 `#f1efe8` | 270 | pasmo dekoracyjne |
| 143 × 139 `#f1efe8` | 39 | plama pod nagłówkiem, marker listy |
| 113 × 112, kolory marki | 28 | rząd palety na stronie głównej |
| 132 × 130, kolory marki | 28 | rząd palety na podstronach |

**Pasmo kropek** to nie równomierny raster. Dwa rzędy po 9 stykających się kół (krok = średnica, bez nachodzenia), pasmo 1447 px celowo wychodzi poza ramkę 1440. Lewa połowa siedzi nisko, prawa wysoko — pasmo „wchodzi schodkiem" w połowie szerokości. Odstęp pionowy między rzędami: 125 px przy kole 82, czyli wysokość pasma to 2,53 średnicy.

## Zdjęcia

27 wypełnień obrazem, dwa traktowania:

- **bleed** — promień 0, przylega do krawędzi. Proporcje 481 × 823, 502 × 864, 487 × 864, czyli ok. 0,58.
- **inset** — promień 16 px. Proporcje 1135 × 640 (16:9) oraz 356 × 444 i 361 × 448 (4:5).

## Niespójności do rozstrzygnięcia z designerką

1. Brak widoków mobilnych — **zamknięte 2026-09-05:** nie będzie rysunku telefonu. Kanon: spójnie i wystarczająco dobrze ([system.md](system.md)).
2. Logo jako raster zamiast wektora.
3. Sześć wystąpień Poppins wśród dwóch pozostałych rodzin.
4. Nawigacja ma cztery pozycje wobec siedmiu z IA, w tym „Bazę wiedzy", której jeszcze nie ma.
5. Zielony `#369125` na białym daje kontrast 4,0:1 i nie przechodzi WCAG AA dla tekstu.
6. Czerń tekstu `#000000` obok czerni nagłówków `#282828`.
7. Na stronie głównej `Rectangle 2` (pas 1440 × 571) nie ma wypełnienia, a biała etykieta „Baza wiedzy" leży na białym tle poza zdjęciem. Obie wyglądają na resztki i zostały pominięte.
