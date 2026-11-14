# Mapa starych adresów

Pewne przekierowania: **30**. Bez pewnego celu: **0**.

Pewne oznacza numer noda zapisany w dokumencie Sanity albo jedną nazwę pliku w assetach. Reszta zostaje na stronie „nie znaleziono”.

Zrzutu `private/dumps/drama_mfund_*.sql` nie było w tym środowisku, więc aliasy, łańcuchy `redirect` i pliki nie weszły do mapy. Zostały tylko adresy `/node/{nid}` dokumentów, które mają numer w `_id` albo w polu `nid`. Uruchom `pnpm build:redirects` tam, gdzie leży zrzut, żeby dopisać resztę.

## Przykłady pewnych

- `/node/104` → `/w-kolejce-do-lasu-final-projektu-art-generacje`
- `/node/2` → `/kontakt`
- `/node/34` → `/projekty/teatr-codzienny`
- `/node/36` → `/projekty-zakonczone`
- `/node/37` → `/szkolenia`
- `/node/38` → `/wydawnictwo`
- `/node/39` → `/portal-wiedzy`
- `/node/40` → `/projekty/to-mi-gra`

## Przykłady bez celu

Brak. Każdy numer noda z migracji fundacji ma cel.

## Linki w treści do starych plików

Treści w Sanity nie były zmieniane.

- Publikacja o TZS: `http://www.fundacja.dramaway.pl/sites/fundacja/files/teatr_zaangazowany_spolecznie_w_polsce._teoria_i_praktyka.pdf`. Brak jednego pliku o tej nazwie w Sanity.
