# Private (lokalnie, poza gitem)

Ten katalog jest w `.gitignore`, poza tym plikiem.

## Co tu trzymać

| Ścieżka | Zawartość |
|---------|-----------|
| `dumps/` | Zrzuty MySQL ze starego hostingu (Drupal) |
| (opcjonalnie) | Notatki z hasłami — lepiej menedżer haseł, nie pliki w projekcie |

## Oczekiwane zrzuty

| Plik | Baza | Rola |
|------|------|------|
| `drama_mfund_*.sql` (lub `.sql.gz`) | `drama_mfund` | Treści fundacja.dramaway.pl |
| `drama_teatr_*.sql.gz` | `drama_teatr` | Stary portal wiedzy — **źródło** do Czytelni, nie osobny serwis w MVP |

## Jak zrobić zrzut

W DirectAdmin: eksport **jednej** bazy → format `.sql.gz`.  
Nie eksportuj całego konta. Nie commituj dumpów (ani Git LFS).

## Czego tu nie ma

- Motywy i pliki z FTP → katalog `legacy/` w rootcie projektu (też gitignored)
- Snapshoty HTML → `live-snapshots/` (gitignored)
- Paczka kickoffu z ustalenia współpracy → `dramaway-setup-ustalenia/` (gitignored; kanon koncepcji jest w `docs/concept/`)
