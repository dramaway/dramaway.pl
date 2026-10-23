# Cutover — checklista dla Fundacji (RODO, treści, analityka)

Co Fundacja musi przygotować **przed** podpięciem `fundacja.dramaway.pl`. Treści prawne pisze Fundacja (albo jej prawnik). Mail poniżej opisuje wszystko w całości. Można go przekazać osobie, która przygotuje treści.

## Mail (do wklejenia)

Temat: Nowa strona fundacji — prośba o treści prawne i decyzję o statystykach

---

Dzień dobry,

zbliżamy się do momentu, w którym nowa strona Fundacji zastąpi obecną `fundacja.dramaway.pl`. Zanim to zrobimy, potrzebujemy od Państwa kilku rzeczy, których nie możemy wymyślić po stronie technicznej.

**1. Polityka prywatności (wymagane)**

Na stronie nie ma formularza kontaktowego ani kont użytkowników. Są natomiast:

- publiczne adresy e-mail osób z zespołu (strona Kontakt),
- zdjęcia i materiały wgrane do panelu (Sanity) i serwowane z ich chmury,
- filmy z YouTube w treściach (wbudowany odtwarzacz),
- hosting strony u Netlify.

To wystarczy, żeby na stronie powinna być polityka prywatności: kto jest administratorem danych, po co publikujecie maile i zdjęcia, z jakimi narzędziami strona się łączy (Sanity, Netlify, YouTube). Tekst musi pochodzić od Fundacji (albo od Waszego prawnika / księgowej, jeśli tak pracujecie). Najprostsza ścieżka: krótka podstrona „Polityka prywatności” + ewentualnie „Polityka cookies”, jeśli zdecydujecie się na statystyki (pkt 3).

Nie przygotujemy za Państwa brzmienia prawnego. Możemy wstawić gotowy tekst na stronę i podlinkować go w stopce.

**2. Zgoda na publikację**

Prosimy o potwierdzenie, że osoby ze zdjęciem / imieniem / mailem na stronie wiedzą o tej publikacji (zespół, zarząd). To nie jest nowy obowiązek — tak było już na starej stronie — ale przy starcie nowej warto to mieć świadomie.

**3. Statystyki odwiedzin (rekomendacja, decyzja po Waszej stronie)**

Szkoda nie wiedzieć, ile osób wchodzi na stronę i które działy czytają. Nie chodzi o reklamowy Facebook Pixel, tylko o prosty, lekki pomiar (np. [Plausible](https://plausible.io) albo [Fathom](https://usefathom.com) — płatne, bez ciasteczek śledzących; albo Google Analytics 4 — darmowy, ale cięższy prawnie: cookies, zgody, transfer poza UE).

Pytanie do Was: czy ktokolwiek w Fundacji będzie na to patrzył raz na miesiąc? Jeśli nie — nie podłączamy nic „na zapas”. Jeśli tak — dajcie znać, który wariant wybieracie, a my wpinamy kod i dopisujemy go do polityki.

Bez tej decyzji strona i tak może iść live. Statystyki da się dodać później.

**4. Co wracamy do Was gotowe od nas**

- nowa strona na adresie roboczym (jeszcze niewidoczna w Google),
- panel do edycji treści (Sanity),
- lista starych adresów URL do przekierowania, gdy przełączymy domenę.

Prosimy o: tekst polityki + decyzję „statystyki: tak (które) / nie”.

Pozdrawiamy

---

## Checklista (Fundacja odhacza)

- [ ] Administrator danych (Fundacja, adres, e-mail kontaktowy) — zdanie do polityki
- [ ] Tekst polityki prywatności (kto, po co maile/zdjęcia, Sanity, Netlify, YouTube)
- [ ] Jeśli analityka: tekst o cookies / pomiarze + kto ma dostęp do panelu statystyk
- [ ] Potwierdzenie, że osoby na stronie Kontakt / O fundacji zgadzają się na publikację maili i zdjęć
- [ ] Decyzja: analityka tak / nie / później (i które narzędzie)
- [ ] Konto analityki (jeśli tak) — ID do wklejenia, nie hasło do naszego repo

## Checklista (my, po ich odpowiedzi)

- [ ] Podstrona polityki w Sanity + link w stopce
- [ ] Jeśli analityka: skrypt + dopiska w CSP (`script-src` / `connect-src`)
- [ ] Mapa 301 starych URL (osobne zadanie, tuż przed przełączeniem DNS)
- [ ] Netlify: `NEXT_PUBLIC_SITE_URL=https://fundacja.dramaway.pl` i `NEXT_PUBLIC_SITE_INDEX=true`
- [ ] Zdjąć noindex, smoke, Search Console

## Analityka — krótka rekomendacja

Dla małej fundacji bez osoby „od marketingu”: **albo nic, albo Plausible/Fathom**. Google Analytics 4 ma sens tylko jeśli ktoś umie czytać raporty i jesteście gotowi na baner cookies. Nie podłączać „na wszelki wypadek” — każdy skrypt to obowiązek w polityce.
