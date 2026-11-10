# Cutover — checklista dla Fundacji (RODO, treści, analityka)

Co Fundacja musi przygotować **przed** podpięciem `fundacja.dramaway.pl`. Treści prawne pisze Fundacja (albo jej prawnik). Mail poniżej opisuje wszystko w całości. Można go przekazać osobie, która przygotuje treści.

## Mail (do wklejenia)

Temat: Nowa strona fundacji — prośba o treści prawne i zatwierdzenie akapitu o statystykach

---

Dzień dobry,

zbliżamy się do momentu, w którym nowa strona Fundacji zastąpi obecną `fundacja.dramaway.pl`. Zanim to zrobimy, potrzebujemy od Państwa kilku rzeczy, których nie możemy wymyślić po stronie technicznej.

**1. Polityka prywatności (wymagane)**

Na stronie nie ma formularza kontaktowego ani kont użytkowników. Są natomiast:

- publiczne adresy e-mail osób z zespołu (strona Kontakt),
- zdjęcia i materiały wgrane do panelu (Sanity) i serwowane z ich chmury,
- filmy z YouTube w treściach (wbudowany odtwarzacz),
- hosting strony u Netlify.

To wystarczy, żeby na stronie powinna być polityka prywatności: kto jest administratorem danych, po co publikujecie maile i zdjęcia, z jakimi narzędziami strona się łączy (Sanity, Netlify, YouTube, Umami). Tekst musi pochodzić od Fundacji (albo od Waszego prawnika / księgowej, jeśli tak pracujecie). Najprostsza ścieżka: krótka podstrona „Polityka prywatności” z akapitem o statystykach (pkt 3). Osobna polityka cookies nie jest potrzebna: Umami nie używa plików cookies.

Nie przygotujemy za Państwa brzmienia prawnego. Możemy wstawić gotowy tekst na stronę i podlinkować go w stopce.

**2. Zgoda na publikację**

Prosimy o potwierdzenie, że osoby ze zdjęciem / imieniem / mailem na stronie wiedzą o tej publikacji (zespół, zarząd). To nie jest nowy obowiązek — tak było już na starej stronie — ale przy starcie nowej warto to mieć świadomie.

**3. Statystyki odwiedzin (decyzja: Umami Cloud)**

Mierzymy, ile osób czyta które strony. Narzędzie to Umami Cloud, plan Hobby, region danych w Unii Europejskiej. Konto jest na `admin@dramaway.pl`. Umami nie używa plików cookies i nie zapisuje adresu IP. W panelu widać dane zbiorcze. Proponowana podstawa w polityce prywatności to art. 6 ust. 1 lit. f RODO. Szkic akapitu czeka na zatwierdzenie Fundacji i nie jest jeszcze na stronie.

Część odwiedzin zniknie za blokerami reklam. To zwykła cecha tego pomiaru, nie błąd strony.

Prosimy o zatwierdzenie albo poprawkę tego akapitu. Strona może iść live bez niego. Sam pomiar włączamy dopiero, gdy tekst jest gotowy do publikacji.

**4. Co wracamy do Was gotowe od nas**

- nowa strona na adresie roboczym (jeszcze niewidoczna w Google),
- panel do edycji treści (Sanity),
- lista starych adresów URL do przekierowania, gdy przełączymy domenę.

Prosimy o: tekst polityki oraz zatwierdzenie akapitu o statystykach (Umami).

Pozdrawiamy

---

## Checklista (Fundacja odhacza)

- [ ] Administrator danych (Fundacja, adres, e-mail kontaktowy) — zdanie do polityki
- [ ] Tekst polityki prywatności (kto, po co maile/zdjęcia, Sanity, Netlify, YouTube)
- [ ] Zatwierdzenie szkicu akapitu o statystykach: [polityka-prywatnosci-analityka-szkic.md](polityka-prywatnosci-analityka-szkic.md). Do tego czasu nie publikować go w Sanity
- [ ] Potwierdzenie, że osoby na stronie Kontakt / O fundacji zgadzają się na publikację maili i zdjęć
- [x] Decyzja: Umami Cloud, plan Hobby, region danych UE, konto `admin@dramaway.pl`
- [ ] ID witryny z panelu Umami wklejone w Netlify (nie do repozytorium, nie hasło)

## Checklista (my, po ich odpowiedzi)

- [ ] Podstrona polityki w Sanity + link w stopce — dopiero po zatwierdzeniu tekstu przez Fundację
- [x] Skrypt Umami i dopisek w CSP (`script-src` / `connect-src`). Skrypt milczy, dopóki w Netlify nie ma `NEXT_PUBLIC_UMAMI_WEBSITE_ID`
- [ ] Mapa 301 starych URL (osobne zadanie, tuż przed przełączeniem DNS)
- [ ] Netlify: `NEXT_PUBLIC_SITE_URL=https://fundacja.dramaway.pl` i `NEXT_PUBLIC_SITE_INDEX=true`
- [ ] Zdjąć noindex, smoke, Search Console

## Analityka — decyzja

**Umami Cloud, plan Hobby, region danych UE.** Konto: `admin@dramaway.pl`. Umowa powierzenia (DPA): publiczny tekst [umami.is/dpa](https://umami.is/dpa), podmiot Umami Software, Inc. Region wybiera się przy zakładaniu konta (Settings → Account → Data region) i potem jest tylko do odczytu. Plan Hobby trzyma statystyki 6 miesięcy.

Wtyczki `sanity-plugin-umami-analytics-tool` 1.1.1 nie używamy. Jej peerDependencies to Sanity `^3` i React `^18`, a paczka zależy od `@sanity/incompatible-plugin`. Studio Fundacji to Sanity 6.18.0 i React 19. Zamiast niej jest własne narzędzie **Statystyki**.

Strona udostępniania (`https://cloud.umami.is/analytics/eu/share/…`, sprawdzone 2026-11-10) wysyła `Content-Security-Policy: frame-ancestors *` oraz `X-Frame-Options: SAMEORIGIN`. Chrome osadza taką stronę, bo `frame-ancestors` wygrywa ze starszym nagłówkiem. Zakładka ma więc iframe i przycisk „Otwórz statystyki” (nowa karta), gdyby przeglądarka jednak zablokowała ramkę.

### Zmienne

Wartości ID i linku udostępniania nie wchodzą do repozytorium.

| Zmienna | Gdzie | Co robi |
|---------|--------|---------|
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | Netlify, kontekst, w którym pomiar ma działać | Puste = skrypt się nie ładuje (lokalnie, Deploy Preview i do czasu decyzji o włączeniu) |
| `NEXT_PUBLIC_UMAMI_SCRIPT_URL` | Netlify, opcjonalnie | Puste = `https://cloud.umami.is/script.js`. Inny host z panelu (region EU), jeśli panel go poda |
| `SANITY_STUDIO_UMAMI_SHARE_URL` | `apps/studio/.env` (gitignore) oraz sekret GitHub Actions o tej samej nazwie, czytany przez `.github/workflows/studio-deploy.yml` | Puste = zakładka Statystyki się nie pokazuje. To link udostępniania z panelu, nie hasło |

Skrypt na stronie liczy tylko `fundacja.dramaway.pl` (`data-domains`), więc `netlify.app` i localhost nie wchodzą do liczb. `data-do-not-track="true"` szanuje sygnał przeglądarki. Chmurowy `script.js` domyślnie wysyła pomiary na `gateway.umami.is`. Ustawiamy `data-host-url` na origin adresu skryptu, więc CSP dopisuje ten jeden host do `script-src` i do `connect-src`, bez drugiej, sztywnej domeny.

Zajawka (`/zajawka`, `COVER_MODE`) korzysta ze wspólnego layoutu, więc dostaje ten sam skrypt, gdy zmienna jest ustawiona.

Szkic akapitu do polityki: [polityka-prywatnosci-analityka-szkic.md](polityka-prywatnosci-analityka-szkic.md). Redakcja ogląda liczby w Studio: [../redakcja/statystyki.md](../redakcja/statystyki.md).
