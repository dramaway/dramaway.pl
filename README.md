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

Wymaga Node **≥ 22.12** i [pnpm](https://pnpm.io/). Wersje Node/pnpm: `.node-version` + `packageManager` w `package.json`. Zależności: [docs/guides/dependencies.md](docs/guides/dependencies.md).

```bash
pnpm install
pnpm extract:fundacja    # opcjonalnie: JSON z dumpa
pnpm migrate:fundacja    # fundacja → Sanity (token w apps/studio/.env)
pnpm migrate:art-generacje  # Art Generacje → project.editions
pnpm repair:portable-text   # linki / YouTube (dry-run; -- --write)
pnpm dev               # http://localhost:3000 (tylko Next)
pnpm dev:studio        # http://localhost:3333 (tylko Studio)
pnpm dev:all           # oba naraz
```

- Frontend: `apps/web` — publiczne trasy z IA (`/projekty`, `/zespol`, `/fundacja`…); `/preview` to inwentarz CMS  

- CMS: `apps/studio` (Sanity **v6**) — treści fundacji + Art Generacje (edycje) w dataset `production`  
- **Co zmigrowane / czego nie:** [docs/migration/fundacja-status.md](docs/migration/fundacja-status.md)  
- Lokalne materiały: tylko `private/`  
- **Stan sesji / co dalej:** [docs/HANDOFF.md](docs/HANDOFF.md)

## Status repozytorium

Lokalne git na `main`, bez remote (na razie). Remote (np. GitHub) i Netlify — później.

## Dla agentów AI

Zaczynaj od [CLAUDE.md](CLAUDE.md) / [AGENTS.md](AGENTS.md) oraz [knowledge.yaml](knowledge.yaml).
