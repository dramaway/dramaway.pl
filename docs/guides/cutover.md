# Cutover — przekazanie kont i premiera domeny

Kolejność dla Jana. Przekazanie kont da się zrobić **przed** dniem, w którym `fundacja.dramaway.pl` wskazuje nową stronę. Drugi dataset Sanity jest odłożony.

Na każdym koncie właścicielem jest skrzynka Fundacji plus druga osoba (na czas przekazania Jan, docelowo ktoś z Fundacji). Jedno konto bez drugiego właściciela kończy się blokadą, gdy ktoś odejdzie.

Role w Sanity po przekazaniu: [sanity-roles.md](sanity-roles.md). Mail o polityce i statystykach: [cutover-foundation.md](cutover-foundation.md). Manual dla redakcji: [../redakcja/README.md](../redakcja/README.md).

`centrum.dramaway.pl` zostaje osobną stroną i nie wchodzi w to przekazanie.

## Faza A — skrzynka i własność

Wspólna sesja z osobą z Fundacji. Najpierw skrzynka, dopiero potem zaproszenia. Maile aktywacyjne muszą wpaść na adres, który oboje widzicie.

### Skrzynka i DNS

Kto: Fundacja i Jan, przy operatorze poczty i DNS `dramaway.pl`.

- [x] Założyć `admin@dramaway.pl`.
- [x] Hasło i kody 2FA zostają u Fundacji, nie tylko u Jana. Wszystko w Bitwardenie (bitwarden.eu); Fundacja dostaje master password.
- [ ] Ustalić, kto ma dostęp do DNS tej domeny. Bez tego nie da się utrzymać poczty ani później przepiąć `fundacja.dramaway.pl`.

### GitHub

Kto prowadzi: Jan. Fundacja akceptuje zaproszenia na `admin@dramaway.pl`.

Zrobione 2026-10-23, ale inaczej niż w planie: repo jest na **koncie osobistym** `dramaway`, nie w organizacji. Darmowy Netlify nie deployuje z prywatnych repo organizacji. Organizacja `fundacja-dramaway` została założona i jest pusta. Drugiego właściciela zastępuje Bitwarden: dostęp do konta ma każdy, kto zna master password.

- [x] Konto GitHub `dramaway` na `admin@dramaway.pl`, 2FA.
- [x] Nowe prywatne repo `dramaway/dramaway.pl`. Wypchnięty tylko `main` z pełną historią. Nie transfer forka: prywatny fork zależałby od `szaroale-pl`.
- [x] Aplikacja Netlify autoryzowana na koncie `dramaway`, deploye ze `main` działają.
- [x] Jan = collaborator z zapisem (na repo osobistym nie ma roli Admin). PR-y z gałęzi w tym repo.
- [x] Stary fork `waether-the-strm/artgeneracje` zarchiwizowany.
- [x] Sekrety Actions: `ci.yml` nie używa `secrets.*`, nic do przenoszenia.

### Netlify

Kto prowadzi: Jan. Fundacja akceptuje na `admin@dramaway.pl`.

- [x] Konto i team na `admin@dramaway.pl`, 2FA.
- [x] Projekt przeniesiony do tego teamu, adres `dramaway.netlify.app` bez zmian. Env: `NEXT_PUBLIC_SANITY_*`, `NEXT_PUBLIC_SITE_URL`, `SANITY_REVALIDATE_SECRET`.
- [ ] Sprawdzić, że w env strony **nie ma** `SANITY_API_WRITE_TOKEN`.
- [ ] Redakcja nie dostaje loginu do Netlify.

### Sanity i plan NGO

Kto prowadzi: Jan. Fundacja akceptuje na `admin@dramaway.pl`.

Faktura i plan siedzą w **organizacji**, nie w roli Administrator projektu. Szczegóły ról: [sanity-roles.md](sanity-roles.md).

- [ ] Sprawdzić, czy projekt `tr2qdg9j` jest w organizacji Jana, czy już w osobnej.
- [ ] Zaprosić `admin@dramaway.pl` jako właściciela organizacji. Dodać drugiego właściciela na czas przekazania.
- [ ] Rola Administrator **projektu** dla tej skrzynki zostaje świadomym backupem, nie codzienną redakcją.
- [ ] Gdy skrzynka jest zalogowana w Manage: dokończyć wniosek NGO (zgoda od Sanity już jest). Plan non-profit siada na organizacji Fundacji, nie na prywatnym loginie Jana.
- [ ] Jan zostaje project Administrator na czas utrzymania. Zdejmowanie go nie jest częścią tego kroku.
- [ ] Świeży eksport: `sanity datasets export production` obok `private/sanity-snapshots/production-2026-09-07-pre-client.tar.gz`.
- [ ] Nowy token robota zapisu (`SANITY_API_WRITE_TOKEN`). Zostaje u osoby od utrzymania. Nie w skrzynce redakcji i nie w env strony.
- [ ] Webhook odświeżania (`SANITY_REVALIDATE_SECRET`) zostaje. Po zmianie domeny wskazuje docelowy adres, nie `dramaway.netlify.app`.
- [ ] Redakcję zapraszać na własne maile jako **Editor**. Nigdy na `admin@dramaway.pl`.

## Faza B — zanim strona zastąpi starą

Treści prawnych nie piszemy za Fundację. Gotowy mail i checklista: [cutover-foundation.md](cutover-foundation.md).

### Fundacja

- [ ] Tekst polityki prywatności (maile zespołu, zdjęcia, Sanity, Netlify, YouTube) i ewentualnie cookies.
- [ ] Potwierdzenie, że osoby ze zdjęciem i mailem godzą się na publikację.
- [ ] Decyzja: statystyki nie / później / Plausible albo Fathom. GA4 tylko jeśli ktoś będzie czytał raporty i przyjmie baner cookies.

### Jan, po ich odpowiedzi

- [ ] Podstrona polityki w Sanity i link w stopce.
- [ ] Analityka tylko jeśli ją wybiorą, plus dopisek w CSP.
- [ ] Mapa 301, tuż przed DNS: stare `node/N`, aliasy portalu, landingi edycji. Nie zgadywać z palca.
- [ ] `news-syrena` do szkicu.

## Faza C — dzień domeny

Kto: Jan, przy dostępie DNS Fundacji.

Do tego dnia `dramaway.netlify.app` zostaje noindex.

- [ ] `fundacja.dramaway.pl` na Netlify, TLS.
- [ ] Env: `NEXT_PUBLIC_SITE_URL=https://fundacja.dramaway.pl` i `NEXT_PUBLIC_SITE_INDEX=true`, przebudowa.
- [ ] Wgrać `_redirects` z mapy 301.
- [ ] CORS Studio: origin produkcji w Sanity Manage.
- [ ] Smoke, Search Console.
- [ ] Webhook Sanity na docelową domenę.

Rollback: poprzedni deploy Netlify + snapshot datasetu.
