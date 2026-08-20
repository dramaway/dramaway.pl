# ADR-003: Model treści i zakres MVP

**Date:** 2026-08-20  
**Status:** Accepted

## Context

Stary ekosystem to kilka domen Drupal (fundacja, centrum, teatrzaangazowany / portal wiedzy). Kickoff ustalił MVP: jedna nowa strona fundacji, Art Generacje jako serce, Czytelnia jako sekcja — nie osobny serwis. Model CMS ma wynikać z nowej IA, nie z tabel `node_type`.

## Decision

**Zakres MVP:** tylko `fundacja.dramaway.pl`.  
`centrum.dramaway.pl` — link zewnętrzny.  
Stary portal (`teatrzaangazowany`, baza `drama_teatr`) — **źródło** artykułów/publikacji do Czytelni w tym samym Sanity, nie drugi Next.js w MVP.

**Typy Sanity (start):**

| Type | Rola |
|------|------|
| `project` | Projekty (w tym Art Generacje z edycjami / galeriami / partnerami) |
| `person` | Zespół, zarząd |
| `page` | Statyczne podstrony (o fundacji, statut, metody, kontakt…) |
| `publication` | Czytelnia / wydawnictwo / materiały z portalu wiedzy |
| `siteSettings` | Nawigacja, footer, globalne CTA |

Drupal mapujemy **na te typy** (zob. `docs/migration/drupal-inventory.md`), nie odwrotnie.

**Świadomie poza migracją 1:1 / do decyzji później:** newsfeed, formularz wsparcia, social w nawigacji, wersja EN (Erasmus) — koncept je zna, MVP ich nie blokuje.

## Alternatives considered

| Option | Pros | Cons | Why rejected |
|--------|------|------|--------------|
| Jeden serwis + wspólny model (chosen) | Zgodne z kickoffem; jeden Studio | Trzeba wyselekcjonować treść z `drama_teatr` | — |
| Dwa serwisy (fundacja + portal wiedzy) | Pełna wierność staremu ekosystemowi | 2× frontend, hosting, IA | Poza MVP kickoffu |
| Klon `node_type` w Sanity | Szybka migracja mechaniczna | Zły UX Studio; nie wspiera Art Generacje jako „serca” | Odrzucone |

## Consequences

**Positive:** Jasny scope; Studio uczy się jednego modelu; Art Generacje dostaje właściwą strukturę.

**Negative:** Nie wszystko z 425 nodów portalu wejdzie od razu; potrzebna kuracja Czytelni.

**Risks:** Presja „przenieść cały teatrzaangazowany” bez decyzji produktowej — wtedy wracamy do tego ADR.

## Review trigger

Gdy klient wymaga osobnego portalu wiedzy 1:1 albo wielojęzyczności od dnia launchu.
