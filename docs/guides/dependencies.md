# Zależności i wersje

Dokładne wersje trzyma **`pnpm-lock.yaml`**. Wspólne pakiety (React, TypeScript, Sanity) — **`catalog:`** w [pnpm-workspace.yaml](../pnpm-workspace.yaml). Majory (Next 16, TypeScript 6+, ESLint 10) nie wchodzą przy okazji — tylko świadoma decyzja. Sanity **zostaje na 6.10.1**: 6.12.0 ciągnie nieistniejące `@portabletext/schema@3`.

## Cotygodniowo (GitHub)

[Dependabot](../.github/dependabot.yml) otwiera PR-y w obrębie obecnych majorów, pogrupowane (Sanity / Next / React / lint). Limit 5 otwartych PR.

## Ręcznie

```bash
pnpm deps:outdated   # co odstaje od Latest
pnpm deps:update     # bump w ramach zakresów (^/~) + lockfile
pnpm install         # po zmianie catalog:
```

Żeby podnieść wspólną wersję (np. React): zmień jedną linię w `catalog:` i `pnpm install`.

## Node i pnpm

- Node **≥ 22.12** (`.node-version`, `engines` w root `package.json`, Netlify `NODE_VERSION=22`)
- pnpm **11.9** (`packageManager` — Corepack)

pnpm 11 trzyma **14-dniową karencję** (`minimumReleaseAge`) na nowe wydania z npm. Świeżo wybrane paczki lądują w `minimumReleaseAgeExclude` w `pnpm-workspace.yaml`, żeby `pnpm install` przeszedł od razu (teraz m.in. `sanity-plugin-media@6.1.8`).

Wersja produktu: `0.1.0` w root `package.json` (prywatny monorepo, nie publikujemy na npm).
