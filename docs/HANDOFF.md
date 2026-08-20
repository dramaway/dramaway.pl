# Handoff — DramaWay

**Aktualizuj ten plik na bieżąco** na końcu każdej sesji.  
Start: ten plik + `CLAUDE.md` + [migration/fundacja-status.md](migration/fundacja-status.md). Nie odtwarzaj historii z dumpów rozmów.

| | |
|--|--|
| **Ostatnia aktualizacja** | 2026-08-21 noc — sesja zamknięta; ciąg dalszy w sobotę |
| **Gałąź / HEAD** | `main` @ `adda562` |
| **Remote** | brak (tylko lokalny git) |
| **Working tree** | czyste |
| **Owner Sanity (na razie)** | Jan Mirecki |

---

## Co to jest

Redesign **fundacja.dramaway.pl**. MVP = jedna witryna. Art Generacje = serce. Czytelnia = dział (`drama_teatr`), nie drugi Next. Centrum = link zewnętrzny.

Stack: Next.js 15, Tailwind v4, shadcn/ui, Sanity Studio v6, Netlify. Kod/CMS EN · docs PL.

---

## Stan teraz

Treść fundacji jest w Sanity. **Publiczne URL-e z IA działają** (chrome roboczy, nie Figma).

- Dataset `production` (`tr2qdg9j`) publiczny. Next bez tokenu. Write token **tylko** `apps/studio/.env`.
- Mapa URL: `apps/web/src/lib/routes.ts` — prefiks IA + `slug.current`.
- Listingi `/`, `/projekty`, `/zespol`, `/fundacja` = widoki, nie dokumenty.
- `/projekty/[slug]` = `project` albo strona z sekcji projektów. `/[slug]` = reszta (w tym newsy pod starym aliasem korzenia).
- `siteSettings` nadal puste — nawigacja z kodu (IA). Centrum = `https://centrum.dramaway.pl`.
- `/preview` zostaje inwentarzem CMS.
- Mapa 301 na premierę = **osobne zadanie**, nie teraz.

Pełny kanon migracji: [fundacja-status.md](migration/fundacja-status.md).

### Świadomie nie zrobione

- Figma / docelowy UI
- Mapa przekierowań (stare aliasy → nowe)
- Czytelnia — brak dumpa `drama_teatr`
- Zasilenie `siteSettings`, news jako osobny typ, GitHub/Netlify, newsletter, formularze, EN
- `person.role` (Drupal `field_funkcja`)
- Ręczna korekta części kotwic

---

## Sobota — start

1. Ten plik + [fundacja-status.md](migration/fundacja-status.md).
2. `pnpm dev:all` jeśli porty wolne.
3. Publiczne URL-e, nie `/preview`.

**Najsensowniejszy:** Figma na `/` i `/projekty/art-generacje`.

Kotwice w Studio możesz poprawiać przy okazji. Czytelnia tylko gdy będzie dump. Redirecty — przed premierą, nie przed Figmą.

---

## Komendy

```bash
cd /Users/jmirecki-letsreg/Code/waether-the-strm/drama
pnpm dev:all                  # :3000 + :3333
```

Nie odpalaj ponownie `migrate:fundacja` / `migrate:art-generacje` bez potrzeby — nadpisze ręczną korektę.

---

## Mapa

| Ścieżka | Rola |
|--------|------|
| `docs/HANDOFF.md` | Teraz |
| `docs/concept/ia.md` | IA / URL-e |
| `apps/web/src/lib/routes.ts` | Kanon publicznych ścieżek |
| `docs/migration/fundacja-status.md` | Co zmigrowane |
| `apps/web/src/app/(site)/` | Publiczny App Router |
| `apps/web/src/lib/sanity/` | GROQ |
| `private/` | Dumpy — poza gitem |
