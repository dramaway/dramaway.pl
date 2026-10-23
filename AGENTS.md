# Agent instructions

Read `CLAUDE.md` first, then `knowledge.yaml` and `docs/README.md`.

## GitHub Copilot coding agent

Requests come from non-developers through the "Zmiana na stronie" issue form, written in Polish. Reply and write PR descriptions in Polish, in plain language: what changed on which page, and how to check it in the Netlify Deploy Preview.

- **Content is not code.** Texts, images, menus, people, projects and news live in Sanity and are edited in Studio (https://dramaway.sanity.studio/). If an issue asks to change content, do not hardcode it. Say in the PR or issue which Studio document to edit, pointing to `docs/redakcja/`.
- Before touching `apps/web`, read `docs/design/system.md`. Figma is a visual direction, not a spec; deviations listed there are deliberate. Do not "fix" them back.
- Keep changes small and limited to what the issue asks. One issue = one PR.
- Never run `pnpm migrate:*`, `pnpm patch:*`, `pnpm seed:*` or anything that writes to the Sanity dataset. There is no write token in this environment, and there must not be.
- Never commit `.env*` files (except `.env.example`), `private/**` or `apps/web/src/data/extracted/`.
- Do not change `netlify.toml`, `NEXT_PUBLIC_SITE_INDEX` or the noindex setup unless the issue explicitly asks for the domain cutover.
- Studio code (`apps/studio/**`) deploys itself after merge to `main` (`.github/workflows/studio-deploy.yml`). Avoid schema changes: renaming or removing a field hides existing content in Studio. If one is unavoidable, say so clearly at the top of the PR.
- Before finishing, run: `pnpm --filter web lint`, `pnpm test:web`, and `pnpm --filter web build`. If the build cannot reach Sanity (network firewall), say so in the PR instead of skipping silently.

## Cursor Cloud specific instructions

Cloud Agent install and start live in `.cursor/environment.json`. That file is the setup new agents use when their checkout contains it.

- Put `/opt/node/bin` first on `PATH` before `node` or `pnpm`. The image default `/exec-daemon/node` is 22.14.0 and does not export `module.registerHooks`, so `pnpm test:web` fails. The environment install provides Node 22.22.2 at `/opt/node` and pnpm 11.9.0 via Corepack (`packageManager` in the root `package.json`).
- Sanity settings are already in the process environment: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`. Dataset `production` is public, so the site reads it without a token. `SANITY_API_WRITE_TOKEN` is only for migration scripts — do not run `pnpm migrate:*` or other write scripts against production.
- App commands (from the repo root, after the PATH fix): `pnpm dev` serves Next.js at http://localhost:3000. `pnpm dev:studio` serves Sanity Studio at http://localhost:3333, bound to IPv6 `::1` only — open `localhost`, not `127.0.0.1`. The environment start command runs `pnpm dev:all` (both). Do not start a second copy if those ports are already listening.
- Checks that do not need a dev server: `pnpm test:web`, `pnpm test:repair`, `pnpm test:archive-projects`, `pnpm lint`, `pnpm --filter studio typecheck`, `pnpm build`. `pnpm build` and `pnpm dev` both write `apps/web/.next`; stop the dev server before a production build.
