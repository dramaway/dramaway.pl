# ADR-001: Stack techniczny

**Date:** 2026-08-20  
**Status:** Accepted

## Context

Budujemy nową stronę fundacja.dramaway.pl z designem z Figmy i treściami ze starego Drupala 7. Potrzebujemy stacku, który da dobry DX (Cursor / agenci), sensowny panel dla redaktorów fundacji oraz hosting z previewami. Kickoff projektu już wskazał wybory; w tej sesji potwierdziliśmy Sanity względem WordPressa.

## Decision

Używamy:

| Warstwa | Wybór |
|---------|--------|
| Framework | Next.js 15 (App Router) |
| Style / UI | Tailwind CSS v4 + shadcn/ui |
| CMS | Sanity v3 |
| Hosting | Netlify |

Aplikacje później: `apps/web`, `apps/studio`.

## Alternatives considered

| Option | Pros | Cons | Why rejected |
|--------|------|------|--------------|
| Sanity + Next (chosen) | Structured content, Studio dla redaktorów, TypeScript-friendly | Migracja HTML → Portable Text wymaga skryptu | — |
| WordPress (klasyczny lub headless) | Znany redaktorom | Walka z Figmą / motywem; headless = stary panel + nowy frontend | Słabszy fit do structured content i nowego UI |
| Vercel | Dobre Next.js DX | Świadoma decyzja kickoffu: nie używamy Vercela | Zastąpione Netlify (preview, domena, free tier) |

## Consequences

**Positive:** Jeden spójny model treści pod IA fundacji; preview na Netlify; Sanity Studio z rolami.

**Negative:** Trzeba zbudować Studio i migrację; redaktorzy potrzebują krótkiego przeszkolenia (nie „WordPress z pamięci mięśniowej”).

**Risks:** Opóźnienie, jeśli Figmę i schemat Sanity rozwijamy bez wspólnego modelu edycji Art Generacje.

## Review trigger

Gdy Netlify nie wystarczy (edge / limity) albo klient absolutnie wymaga WordPressa jako jedynego panelu.
