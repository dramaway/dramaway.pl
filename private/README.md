# Private (lokalnie, poza gitem)

Ten katalog jest **w całości poza repozytorium**, poza tym plikiem.
Tu trzymamy wszystko, czego nie ma w czystym projekcie deweloperskim:
zrzuty baz, mirror FTP, PDF-y, paczki kickoffu, snapshoty HTML.

Root repozytorium (`apps/`, `docs/`, `scripts/`) zostaje czysty.

## Zawartość

| Ścieżka | Zawartość |
|---------|-----------|
| `dumps/` | Zrzuty MySQL (`drama_mfund`, `drama_teatr`) |
| `legacy/` | Mirror FTP (motywy, files) — bez `settings.php` |
| `live-snapshots/` | Zrzuty HTML homepage |
| `dramaway-setup-ustalenia/` | Paczka kickoffu (archiwum; kanon w `docs/concept/`) |
| `strona.pdf` | Materiały robocze spoza kodu |

## Dumpy SQL

| Plik | Baza | Rola |
|------|------|------|
| `drama_mfund_*.sql` (lub `.sql.gz`) | `drama_mfund` | Fundacja |
| `drama_teatr_*.sql.gz` | `drama_teatr` | Źródło do Czytelni (nie osobny serwis w MVP) |

Eksport w DirectAdmin: **jedna** baza → `.sql.gz`. Nie commituj dumpów.

## Extract do frontendu

Skrypt `pnpm extract:fundacja` czyta `dumps/` i zapisuje JSON do
`apps/web/src/data/extracted/` (też gitignored) — do surowych templatek bez Sanity.
