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

## Odpowiedź Fundacji (2026-11-14)

Fundacja przeczytała politykę i regulamin w Studio i napisała, że oba teksty są jasne. Porada prawna dla NGO ma zająć około miesiąca. Decyzja: publikujemy teraz, prawnik wnosi poprawki później, w tych samych dokumentach.

Ustalenia wpisane w opublikowaną politykę:

- Wiadomości z formularza: 12 miesięcy od zakończenia korespondencji.
- Poczta i hosting z faktury: ARTIGA Piotr Tymoszuk, jednoosobowa działalność gospodarcza, Michałowice. W polityce jest nazwa i miejscowość, bez ulicy. Ulica z faktury nie jest wymagana przy wskazaniu odbiorcy (art. 13 ust. 1 lit. e RODO). To nie jest spółka. Marka usługi to SEOHOST; operatorem marki jest SEOHOST Sp. z o.o. w Poznaniu, ale faktura Fundacji jest na ARTIGĘ, więc w polityce stroną jest ARTIGA.
- Inspektora ochrony danych nie ma. Przy tej skali działalności obowiązek wyznaczenia go nie powstaje.
- Wizerunek: zgody zbierane od uczestników warsztatów (przy osobach niepełnoletnich — rodzic albo opiekun). Spektakle: brak osobnych zgód; polityka opisuje wyjątek dla osoby będącej elementem większej całości (art. 81 ust. 2 pkt 2 prawa autorskiego), nie zwolnienie dla każdego zdjęcia ze spektaklu. Zespół: publikacja imienia, zdjęcia i służbowego maila na podstawie prawnie uzasadnionego interesu. Osobnego potwierdzenia umów z zespołem nie było.

## Checklista (Fundacja odhacza)

- [x] Administrator danych (Fundacja, adres, e-mail kontaktowy) — zdanie w opublikowanej polityce
- [x] Tekst polityki prywatności (kto, po co maile/zdjęcia, Sanity, Netlify, YouTube). Prawnik może go jeszcze poprawić
- [x] Akapit o statystykach jest w opublikowanej polityce. Notatka: [polityka-prywatnosci-analityka-szkic.md](polityka-prywatnosci-analityka-szkic.md)
- [x] Publikacja wizerunku — w zakresie z odpowiedzi z 2026-11-14 (warsztaty tak, spektakle jako wydarzenie zbiorowe, zespół przez interes Fundacji)
- [x] Decyzja: Umami Cloud, plan Hobby, region danych UE, konto `admin@dramaway.pl`
- [ ] ID witryny z panelu Umami wklejone w Netlify (nie do repozytorium, nie hasło)

## Checklista (my, po ich odpowiedzi)

- [x] Podstrona polityki i regulaminu w Sanity + linki w stopce. Opublikowane 2026-11-14
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
| `NEXT_PUBLIC_UMAMI_SCRIPT_URL` | Netlify, opcjonalnie | Puste = `https://cloud.umami.is/script.js`. Ten origin trafia do CSP `script-src`. Inny host z panelu (region EU), jeśli panel go poda |
| `NEXT_PUBLIC_UMAMI_HOST_URL` | Netlify, opcjonalnie | Puste = brak `data-host-url`, wysyłka na `https://gateway.umami.is/api/send` (CSP `connect-src`). Ustawiona wartość zastępuje ten gateway i staje się `data-host-url` |
| `SANITY_STUDIO_UMAMI_SHARE_URL` | `apps/studio/.env` (gitignore) oraz sekret GitHub Actions o tej samej nazwie, czytany przez `.github/workflows/studio-deploy.yml` | Puste = zakładka Statystyki się nie pokazuje. To link udostępniania z panelu, nie hasło |

Skrypt na stronie liczy tylko `fundacja.dramaway.pl` (`data-domains`), więc `netlify.app` i localhost nie wchodzą do liczb. `data-do-not-track="true"` szanuje sygnał przeglądarki. Tag jest jak oficjalny snippet z panelu: bez `data-host-url` wysyła na `https://gateway.umami.is/api/send`. CSP, gdy jest ID witryny, wpuszcza origin skryptu w `script-src` i `https://gateway.umami.is` w `connect-src`. `NEXT_PUBLIC_UMAMI_HOST_URL` jest na własny kolektor w przyszłości.

Zajawka (`/zajawka`, `COVER_MODE`) korzysta ze wspólnego layoutu, więc dostaje ten sam skrypt, gdy zmienna jest ustawiona.

Szkic akapitu do polityki: [polityka-prywatnosci-analityka-szkic.md](polityka-prywatnosci-analityka-szkic.md). Redakcja ogląda liczby w Studio: [../redakcja/statystyki.md](../redakcja/statystyki.md).
