# DramaWay — nowa strona fundacji

Redesign i migracja CMS dla **fundacja.dramaway.pl** (Fundacja DramaWay — teatr zaangażowany społecznie).

## MVP

Jedna nowa witryna: `fundacja.dramaway.pl`.  
Serce serwisu: projekt **Art Generacje** (edycje, galerie, partnerzy).  
Czytelnia / baza wiedzy to **dział tej strony**, nie osobny portal.  
`centrum.dramaway.pl` zostaje linkiem zewnętrznym (nie migrujemy w MVP).

## Stack docelowy

| Warstwa | Wybór |
|---------|--------|
| Frontend | Next.js 15 (App Router) |
| Style | Tailwind CSS v4 + shadcn/ui |
| CMS | Sanity v3 |
| Hosting | Netlify (nie Vercel) |

Szczegóły: [docs/decisions/ADR-001-stack.md](docs/decisions/ADR-001-stack.md).

## Język w repo

- **Kod, katalogi, commity, nazwy w CMS** — angielski  
- **Dokumentacja `.md` dla ludzi** — polski  

## Co jest w gicie, a czego nie

**W gicie:** dokumentacja, późniejszy kod w `apps/`, skrypty migracji.  

**Poza gitem (lokalnie):** zrzuty SQL (`private/dumps/`), mirror FTP (`legacy/`), snapshoty HTML, paczka kickoffu `dramaway-setup-ustalenia/`. Zobacz [private/README.md](private/README.md).

## Dokumentacja

Hub: [docs/README.md](docs/README.md)

- Koncept i IA: [docs/concept/](docs/concept/)
- Decyzje (ADR): [docs/decisions/](docs/decisions/)
- Migracja z Drupala: [docs/migration/](docs/migration/)

## Status repozytorium

Lokalne git na `main`, bez remote (na razie). Remote (np. GitHub) i Netlify — później.

## Dla agentów AI

Zaczynaj od [CLAUDE.md](CLAUDE.md) / [AGENTS.md](AGENTS.md) oraz [knowledge.yaml](knowledge.yaml).
