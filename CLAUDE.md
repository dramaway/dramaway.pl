# DramaWay — agent context

Redesign of **fundacja.dramaway.pl** (DramaWay Foundation). MVP is one site; Art Generacje is the flagship. Reading room / knowledge base is a section of that site, not a second Next.js app. Stack: Next.js 15 App Router, Tailwind CSS v4 + shadcn/ui, Sanity v3, Netlify (not Vercel).

## Language

- **Code, directories, commits, CMS type names:** English  
- **Human-facing `.md` docs:** Polish  

## Do not commit

- `private/**` except `private/README.md` (dumps, FTP mirror, PDF, kickoff archive, snapshots)  
- secrets, `.env*` (keep `.env.example`)  
- `apps/web/src/data/extracted/` (generated from dumps)

See `private/README.md` and `.gitignore`.

## Structure

```
apps/web/          # Next.js 15 + Tailwind v4 + shadcn/ui
apps/studio/       # Sanity Studio v3 (schema stubs)
docs/concept/      # IA and product assumptions (PL)
docs/decisions/    # ADRs (PL body)
docs/migration/    # Drupal → Sanity mapping (PL)
private/           # local-only; only README.md is tracked
scripts/           # migration scripts (later)
```

## Key docs

| Topic | Path |
|-------|------|
| **Session handoff (start here)** | `docs/HANDOFF.md` |
| **Fundacja migration status** | `docs/migration/fundacja-status.md` |
| Docs hub | `docs/README.md` |
| IA | `docs/concept/ia.md` |
| Art Generacje | `docs/concept/art-generacje.md` |
| Stack ADR | `docs/decisions/ADR-001-stack.md` |
| Repo / language ADR | `docs/decisions/ADR-002-repo-and-language.md` |
| Content model / MVP | `docs/decisions/ADR-003-content-model-and-mvp.md` |
| Drupal inventory | `docs/migration/drupal-inventory.md` |

## Content model (target Sanity)

`project`, `person`, `page`, `publication`, `siteSettings` — map Drupal into these; do not clone Drupal `node_type` 1:1.  
`drama_teatr` dump is a **source** for publications / reading room, not a second production site in MVP.

## Critical gotchas

- **MVP domain:** only fundacja; centrum stays an external link.  
- **Art Generacje** needs project + editions (galleries, partners), not a flat project card.  
- Kickoff July 2025 dates are historical; do not treat them as the current schedule.  
- Never put FTP/panel passwords or `settings.php` contents in docs.

## Quick start

```bash
pnpm install
pnpm extract:fundacja    # optional local JSON from dump
pnpm migrate:fundacja    # needs SANITY_API_WRITE_TOKEN in apps/studio/.env
pnpm migrate:art-generacje
pnpm dev               # http://localhost:3000
pnpm dev:studio        # http://localhost:3333
pnpm dev:all           # oba naraz
```

At session start: read `docs/HANDOFF.md` and keep it updated.

## Knowledge index

See `knowledge.yaml`.
