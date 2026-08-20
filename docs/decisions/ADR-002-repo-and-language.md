# ADR-002: Repozytorium i język

**Date:** 2026-08-20  
**Status:** Accepted

## Context

Katalog projektu zawierał zrzuty SQL (~200 MB skompresowane / ~1 GB+ rozpakowane), mirror FTP (~780 MB) i materiały kickoffu. Bez reguł łatwo wciągnąć sekrety i gigabajty do historii gita. Ustalone: kod i kontrakt techniczny po angielsku, dokumentacja dla ludzi po polsku; na start tylko lokalne repo.

## Decision

1. **Git lokalny** na gałęzi `main`, bez remote w tym kroku.  
2. **Język:** kod, katalogi, commity (Conventional Commits, EN), nazwy typów Sanity — angielski; treść `.md` dla ludzi — polski.  
3. **Poza gitem:** `private/dumps/`, `legacy/`, `live-snapshots/`, `dramaway-setup-ustalenia/`, `*.sql` / `*.sql.gz`, sekrety / `.env*`.  
4. Commitowany jest tylko `private/README.md` (instrukcja, nie dane).

## Alternatives considered

| Option | Pros | Cons | Why rejected |
|--------|------|------|--------------|
| Lokalny git + ostre `.gitignore` (chosen) | Bezpieczny start, zero wycieku dumpów | Brak współpracy zdalnej na razie | — |
| Od razu GitHub + LFS na dumpy | Backup w chmurze | Ryzyko sekretów; dumpy nie powinny być w historii | LFS nie rozwiązuje „sekretów / PII w SQL” |
| Wszystko w jednym języku (EN albo PL) | Prościej | Albo UX docs dla PL-klienta, albo niespójność z kodem | Rozdział EN/PL jest świadomy |

## Consequences

**Positive:** Czysta historia; agenci wiedzą, gdzie nie grzebać; łatwy późniejszy `gh repo create`.

**Negative:** Dumpy trzeba trzymać lokalnie / w backupie poza gitem; nowa osoba musi przeczytać `private/README.md`.

**Risks:** Ktoś zrobi `git add -f` na dump — review przed pushem (gdy pojawi się remote).

## Review trigger

Gdy dodajemy remote (GitHub) albo drugi developer — wtedy branch protection i ewentualnie secret scanning.
