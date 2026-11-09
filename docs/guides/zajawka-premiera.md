# Zajawka przed premierą — handoff

Stan na 2026-11-09 (wieczór). Premiera: **niedziela, 15 listopada 2026**. Kilka dni wcześniej domena `fundacja.dramaway.pl` przechodzi na Netlify, ale pełna strona jest jeszcze zakryta jednoekranową zajawką. Pełną stronę widzi tylko zespół i klient.

## Co już jest (etap 1: wizualny)

Podgląd: `pnpm dev`, potem `http://localhost:3000/zajawka`. Parametr `?wersja=1|2|3` wymusza konkretną wersję.

| Plik | Rola |
|------|------|
| `apps/web/src/app/zajawka/page.tsx` | trasa poza grupą `(site)`, czyli bez nagłówka i stopki; kontakt z `siteSettings` (`getResolvedSite().footer.links`) |
| `apps/web/src/components/cover/cover-screen.tsx` | układ i inline script rotacji |
| `apps/web/src/components/cover/cover-copy.ts` | stała `PREMIERE` (data w jednym miejscu) i klucze rotacji |
| `apps/web/src/components/cover/cover-illustrations.tsx` | trzy znaki geometryczne |
| `apps/web/src/components/cover/device-frame.tsx` | ramka: przeglądarka od `lg`, tablet od `md`, telefon poniżej |
| `apps/web/src/components/cover/mini-site.tsx` | szkielet hero `/projekty`: prawdziwe „Co robimy?” i lead, logo jako prawie czarna kreska (trochę grubsza od linków), linki i hamburger jako szare kreski, bez paginacji slidera |
| `apps/web/src/app/globals.css` | bloki `.cover-*` i `.mini-*` na końcu pliku |
| `apps/web/public/cover/stage.webp` | zdjęcie z covera (slajd 4), 1080×720 |

Zasady układu:

- **Ekran:** `100svh` i `overflow: hidden`, więc nic się nie przewija.
- **Desktop (od `lg`):** po lewej logo, hasło, lead i kontakt. Po prawej okno przeglądarki 16:10 ze szkieletem strony w układzie desktopowym (split: tekst po lewej, zdjęcie do krawędzi po prawej, rząd kółek na dole). Dół zdjęcia leży na osi rzędu kółek, jak w projekcie, więc pod kółkami nic nie wystaje.
- **Tablet i telefon:** logo → hasło → kontakt → ramka urządzenia (tablet 3:4 z kropką kamery, telefon 390:844 z wycięciem) ze szkieletem w układzie mobilnym (pasek z logo i hamburgerem, H1, kwadratowy kadr, lead, rząd kółek).
- **Skalowanie szkieletu:** rysowany w „emulowanych pikselach” (`--u = 100cqi / --emu`, gdzie `--emu` to 1440, 768 albo 390), więc skaluje się z ramką jak prawdziwa strona. Ramka mieści się w szerokości i wysokości dzięki `container-type: size` na `.cover-media`.
- **Pasmo kółek:** rozdzielone na dwa rzędy (dwa `DotBand`, w każdym ukryty jeden rząd). Górny jest w prawym górnym rogu na wysokości logo, nad ramką. Dolny jest po lewej, z odrobiną światła pod spodem. Kółka mają 48 px, a 82 px tylko na dużym ekranie (`lg` i wysokość od 60rem).
- **Rotacja:** wszystkie trzy wersje są w HTML-u, a script ustawia `data-cover` na `.cover` przed malowaniem strony. Losowy start, potem kolejna wersja przy każdym wejściu (`localStorage` pod kluczem `dw-cover`, w try/catch). Bez JS widać wersję 1.

| # | Nagłówek | Lead | Znak |
|---|----------|------|------|
| 1 | Próba generalna. | Nowa strona Fundacji DramaWay – premiera w niedzielę, 15 listopada. | rząd kropek palety, ostatnia to obracający się przerywany obrys |
| 2 | Trzeci dzwonek. | jak w 1 | dwa obrysy i pełne koło w kolorze magenta, od którego rozchodzą się kręgi |
| 3 | Kurtyna w górę 15 listopada. | Nowa strona Fundacji DramaWay. Do zobaczenia w niedzielę. | piaskowa kurtyna z falbaną z półkoli podnosi się z ekranu w ramce i zostaje u góry jako lambrekin |

Typografia polska: twarde spacje po jednoliterowych spójnikach i przyimkach („w niedzielę”, „w górę”) i przed półpauzą. Przy `prefers-reduced-motion` znaki stoją w stanie końcowym.

## Do zrobienia (etap 2): prompt dla nowego czatu

> Przeczytaj `docs/HANDOFF.md`, `docs/design/system.md` i ten plik. Zajawka (`/zajawka`) jest wizualnie zaakceptowana. Nie zmieniaj jej wyglądu bez pytania. Zadania:
>
> 0. **Commit etapu 1:** najpierw zacommituj to, co już jest (instrukcja niżej, sekcja „Jak commitować”).
> 1. **Bramka:** dodaj `apps/web/src/middleware.ts`. Gdy env `COVER_MODE=on`, każde żądanie poza `/_next`, `/api`, plikami statycznymi (`/cover/*`, favicon, fonty, `logo-dramaway.png`, `/brand/*`) i samym `/zajawka` ma być przepisane (rewrite, adres w pasku zostaje) na `/zajawka`. Wyjątek: ciasteczko `dw_preview` równe `COVER_SECRET`. Wejście z `?podglad=<COVER_SECRET>` ustawia to ciasteczko (httpOnly, Secure, SameSite=Lax, 30 dni) i robi redirect 302 na tę samą ścieżkę bez parametru. Webhook `POST /api/revalidate` musi zostać dostępny. Strona zajawki dostaje `Cache-Control: no-store` albo inne rozwiązanie, które nie podaje pełnej strony z cache osobie bez ciasteczka (sprawdź zachowanie Netlify Next runtime i ISR).
> 2. **Env:** `COVER_MODE` i `COVER_SECRET` tylko w kontekście Production na Netlify. Sekret w Bitwardenie, nigdy w repo ani w docs. Wpisz zmienne do `.env.example` bez wartości.
> 3. **Metadane zajawki:** `<title>` „Premiera 15 listopada” (szablon z layoutu dopisze nazwę), opis, obraz OG (np. `public/cover/stage.webp` przycięte do 1200×630), `noindex` (zostaje do dnia premiery).
> 4. **Dzień premiery:** opisz w `docs/guides/cutover.md` włączenie (env + redeploy), link podglądu dla klienta i wyłączenie (`COVER_MODE` usunięte + redeploy, potem `NEXT_PUBLIC_SITE_INDEX=true`). Dopisz klasy `.cover-*` do tabeli w `docs/design/system.md`, a stan do `docs/HANDOFF.md`.
> 5. **Weryfikacja:**
>    - `COVER_MODE=on` lokalnie: `/`, `/projekty` i stara ścieżka Drupala pokazują zajawkę; `?podglad=` odsłania stronę; po usunięciu ciasteczka wraca zajawka.
>    - Brak scrolla na 375×667, 390×844, 768×1024, 1280×720, 1440×900, 1920×1080 i telefonie w poziomie.
>    - Tryb prywatny (bez `localStorage`) i `prefers-reduced-motion`.
>    - Kontrast AA.
>    - Deploy Preview na Netlify przed przepięciem DNS.
>
> Etap 2 commituj według sekcji „Jak commitować”. Push i PR dopiero, gdy Jan obejrzy wynik.

## Jak commitować

**Gałąź:** pracuj na nowej gałęzi od `main`, nie na `main`:

```bash
git switch -c feat/prelaunch-cover
```

**Komunikaty:** po angielsku (`CLAUDE.md`), w trybie rozkazującym, z krótkim tytułem do ok. 60 znaków i opcjonalnym opisem po pustej linii. Na końcu linia atrybucji, jeśli sesja ją dostała w instrukcjach systemowych.

**Czego nie commitować:**
- `demo.jpg` i `cover-img.webp` w katalogu głównym repo. To źródła od klienta. Przenieś je do `private/cover/` (katalog jest w `.gitignore`) albo usuń. Zdjęcie jest już w `apps/web/public/cover/stage.webp`.
- `.env*` (poza `.env.example`), `private/**`, `apps/web/src/data/extracted/`.
- Sekretu `COVER_SECRET` w żadnej postaci (kod, docs, komunikat commita).

**Podział na commity.** Dodawaj pliki po nazwie, nie przez `git add -A`.

1. Zajawka (etap 1, już zaakceptowana):
   ```bash
   git add apps/web/src/app/zajawka apps/web/src/components/cover \
     apps/web/public/cover/stage.webp apps/web/src/app/globals.css
   git commit -m "Add pre-launch cover page with rotating slogans"
   ```
   Przed commitem sprawdź `git diff --cached apps/web/src/app/globals.css`. Diff ma dotyczyć tylko bloków `.cover-*` / `.mini-*` i reguł `.cover-band*` na końcu pliku.
2. Ten handoff: `git add docs/guides/zajawka-premiera.md`, potem `git commit -m "Document pre-launch cover and launch-day steps"`. Jeśli w etapie 2 go zmieniasz, dołącz go do commita z dokumentacją.
3. Etap 2, osobne commity na każdy krok:
   - `Gate the site behind the cover with a preview cookie` (middleware i `.env.example`),
   - `Add cover metadata and OG image`,
   - `Document cover switch in cutover guide` (`cutover.md`, `system.md`, `HANDOFF.md`).

**Przed każdym commitem z kodem uruchom:** `pnpm --filter web lint`, `pnpm test:web` i `pnpm --filter web build`. Jeśli build nie dosięgnie Sanity, napisz to wprost, nie pomijaj kroku po cichu.

**Push i PR** dopiero po akceptacji Jana:

```bash
git push -u origin feat/prelaunch-cover
gh pr create --base main
```

Opis PR po polsku, prostym językiem: co zmienia się na stronie, jak obejrzeć zajawkę w Netlify Deploy Preview (`/zajawka`, `?wersja=1|2|3`) i jak działa link podglądu. Nie wpisuj w nim sekretu.
