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

**W gicie:** dokumentacja, `apps/web` (Next.js), `apps/studio` (Sanity), później skrypty migracji.  

**Poza gitem (katalog `private/`):** zrzuty SQL, mirror FTP, snapshoty HTML, PDF-y, paczka kickoffu. Zobacz [private/README.md](private/README.md). Root repozytorium (`apps/`, `docs/`, `scripts/`) ma zostać czysty.

## Dokumentacja

Hub: [docs/README.md](docs/README.md)

- Koncept i IA: [docs/concept/](docs/concept/)
- Decyzje (ADR): [docs/decisions/](docs/decisions/)
- Migracja z Drupala: [docs/migration/](docs/migration/)

## Uruchomienie lokalne

Wymaga Node 20+ i [pnpm](https://pnpm.io/).

```bash
pnpm install
pnpm dev          # Next.js → http://localhost:3000
pnpm dev:studio   # Sanity Studio → http://localhost:3333 (po ustawieniu project id)
```

- Frontend: `apps/web` (Next.js 15 + Tailwind v4 + shadcn/ui)  
- CMS: `apps/studio` — schematy stub (`project`, `person`, `page`, `publication`, `siteSettings`)  
- Skopiuj `apps/studio/.env.example` → `.env` i uzupełnij `SANITY_STUDIO_PROJECT_ID` (konto na [sanity.io/manage](https://www.sanity.io/manage)). Bez tego Studio nie połączy się z projektem w chmurze; sam frontend działa od razu.

Import z dumpów Drupala i prawdziwe treści na stronach — osobny krok (jeszcze nie w tym scaffoldzie).

## Status repozytorium

Lokalne git na `main`, bez remote (na razie). Remote (np. GitHub) i Netlify — później.

## Dla agentów AI

Zaczynaj od [CLAUDE.md](CLAUDE.md) / [AGENTS.md](AGENTS.md) oraz [knowledge.yaml](knowledge.yaml).
