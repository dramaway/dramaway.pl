# Legacy na dysku

Materiały ze starego hostingu — **poza gitem** (`.gitignore`). Ten plik mówi tylko, gdzie leżą lokalnie.

## Mirror FTP — `legacy/`

Pobrane motywami / custom / files (bez rdzenia Drupala i bez `settings.php`).

| Ścieżka | Zawartość |
|---------|-----------|
| `legacy/domains/multisite.dramaway.pl/public_html/sites/fundacja/` | Site fundacji: motyw `themes/fundacja`, `files/`, lokalne moduły |
| `legacy/domains/multisite.dramaway.pl/public_html/sites/spinacz/` | Stary dramaway.pl |
| `legacy/domains/multisite.dramaway.pl/public_html/sites/szkolenia/` | Centrum |
| `legacy/domains/multisite.dramaway.pl/public_html/sites/biz/` | Biz |
| `legacy/domains/multisite.dramaway.pl/public_html/sites/all/themes/bootstrap/` | Bootstrap base theme (multisite) |
| `legacy/domains/teatrzaangazowany.dramaway.pl/public_html/sites/default/themes/teatr/` | Motyw portalu wiedzy |
| `legacy/domains/teatrzaangazowany.dramaway.pl/public_html/sites/default/files/` | Pliki portalu (dużo mediów) |

Routing multisite (historycznie): `sites.php` mapował m.in. `fundacja.dramaway.pl` → katalog `fundacja`.

## Snapshoty HTML — `live-snapshots/`

Zrzuty homepage (podgląd bez Drupala), m.in.:

- `fundacja.dramaway.pl.html`
- `dramaway.pl.html`
- `centrum.dramaway.pl.html`
- `teatrzaangazowany-http.html`

## Dumpy SQL — `private/dumps/`

Opis: [../../private/README.md](../../private/README.md).

## Kickoff pack — `dramaway-setup-ustalenia/`

Lokalna paczka startowa (w tym materiały pod inną rolę). **Nie** jest źródłem prawdy w repo.  
Kanon koncepcji: `docs/concept/`, decyzje: `docs/decisions/`.
