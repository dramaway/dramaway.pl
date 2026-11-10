# Cutover — przekazanie kont i premiera domeny

Przekazanie kont (faza A) jest zrobione. Zostały fazy B i C, które prowadzi Fundacja albo osoba, której Fundacja je zleci. Drugi dataset Sanity jest odłożony.

Wszystkie konta należą do skrzynki `admin@dramaway.pl`. Hasła i kody odzyskiwania są w Bitwardenie Fundacji. Master password powinny znać co najmniej dwie osoby z Fundacji: jedno konto znane jednej osobie kończy się blokadą, gdy ta osoba odejdzie.

Role w Sanity po przekazaniu: [sanity-roles.md](sanity-roles.md). Mail o polityce i statystykach: [cutover-foundation.md](cutover-foundation.md). Manual dla redakcji: [../redakcja/README.md](../redakcja/README.md).

`centrum.dramaway.pl` zostaje osobną stroną i nie wchodzi w to przekazanie.

## Faza A — skrzynka i własność

Wspólna sesja z osobą z Fundacji. Najpierw skrzynka, dopiero potem zaproszenia. Maile aktywacyjne muszą wpaść na adres, który oboje widzicie.

### Skrzynka i DNS

Kto: Fundacja, przy operatorze poczty i DNS `dramaway.pl`.

- [x] Założyć `admin@dramaway.pl`.
- [x] Hasło i kody 2FA zostają u Fundacji. Wszystko w Bitwardenie (bitwarden.eu); Fundacja dostaje master password.
- [ ] Ustalić, kto ma dostęp do DNS tej domeny. Bez tego nie da się utrzymać poczty ani później przepiąć `fundacja.dramaway.pl`.

### GitHub


Zrobione 2026-10-23, ale inaczej niż w planie: repo jest na **koncie osobistym** `dramaway`, nie w organizacji. Darmowy Netlify nie deployuje z prywatnych repo organizacji. Pusta organizacja `fundacja-dramaway` usunięta. Drugiego właściciela zastępuje Bitwarden: dostęp do konta ma każdy, kto zna master password.

- [x] Konto GitHub `dramaway` na `admin@dramaway.pl`, 2FA.
- [x] Nowe prywatne repo `dramaway/dramaway.pl`. Wypchnięty tylko `main` z pełną historią. Nie transfer forka: prywatny fork zależałby od `szaroale-pl`.
- [x] Aplikacja Netlify autoryzowana na koncie `dramaway`, deploye ze `main` działają.
- [x] Stary fork wykonawcy zarchiwizowany.
- [x] Repo publiczne (darmowy Netlify blokuje buildy z prywatnych repo przy więcej niż jednym kontrybutorze). Ruleset „Ochrona main”: zmiany tylko przez PR z zielonym `check`.
- [x] Zmiany w kodzie: Copilot, patrz [../redakcja/zmiany-w-kodzie.md](../redakcja/zmiany-w-kodzie.md).
- [ ] Konto wykonawcy usunięte z collaboratorów repo.
- [x] `szaroale-pl` zaproszona jako collaborator (drobne zmiany przez PR-y).
- [x] Sekrety Actions: `ci.yml` nie używa `secrets.*`, nic do przenoszenia.

### Netlify

- [x] Konto i team na `admin@dramaway.pl`, 2FA.
- [x] Projekt przeniesiony do tego teamu, adres `dramaway.netlify.app` bez zmian. Env: `NEXT_PUBLIC_SANITY_*`, `NEXT_PUBLIC_SITE_URL`, `SANITY_REVALIDATE_SECRET`.
- [ ] Sprawdzić, że w env strony **nie ma** `SANITY_API_WRITE_TOKEN`.
- [x] Podglądy PR-ów (Deploy Previews) publiczne: Visitor access → Public.
- [ ] Redakcja nie dostaje loginu do Netlify.
- [ ] Konto wykonawcy usunięte z teamu.

### Sanity i plan NGO

Faktura i plan siedzą w **organizacji**, nie w roli Administrator projektu. Szczegóły ról: [sanity-roles.md](sanity-roles.md).

- [x] Projekt `tr2qdg9j` przepięty na organizację na `admin@dramaway.pl` (2026-10-23).
- [ ] Rola Administrator **projektu** dla tej skrzynki: pełne zarządzanie, nie codzienna redakcja.
- [x] Gdy skrzynka jest zalogowana w Manage: dokończyć wniosek NGO (zgoda od Sanity już jest). Plan non-profit siada na organizacji Fundacji.
- [ ] Konto wykonawcy usunięte z projektu. Jego tokeny (zapis migracji, deploy) unieważnione w Manage → API → Tokens.
- [ ] Kopia treści u Fundacji: eksport datasetu (`.tar.gz`) na dysku Fundacji. Bez niej rollback treści jest niemożliwy.
- [ ] Token zapisu (`SANITY_API_WRITE_TOKEN`) tworzyć tylko na czas konkretnego zadania i potem usuwać. Nigdy w skrzynce redakcji ani w env strony.
- [ ] Token „Deploy Studio” jako sekret `SANITY_AUTH_TOKEN` w repo (automatyczne wdrażanie Studio).
- [ ] Webhook odświeżania (`SANITY_REVALIDATE_SECRET`) zostaje. Po zmianie domeny wskazuje docelowy adres, nie `dramaway.netlify.app`.
- [ ] Redakcję zapraszać na własne maile jako **Editor**. Nigdy na `admin@dramaway.pl`.

## Faza B — zanim strona zastąpi starą

Treści prawnych nie piszemy za Fundację. Gotowy mail i checklista: [cutover-foundation.md](cutover-foundation.md).

### Fundacja

- [ ] Tekst polityki prywatności (maile zespołu, zdjęcia, Sanity, Netlify, YouTube) i ewentualnie cookies.
- [ ] Potwierdzenie, że osoby ze zdjęciem i mailem godzą się na publikację.
- [ ] Decyzja: statystyki nie / później / Plausible albo Fathom. GA4 tylko jeśli ktoś będzie czytał raporty i przyjmie baner cookies.

### Wdrożenie (zgłoszenia „Zmiana na stronie” albo zlecony wykonawca)

- [ ] Podstrona polityki w Sanity (Studio) i link w stopce.
- [ ] Analityka tylko jeśli ją wybiorą, plus dopisek w CSP.
- [ ] Mapa 301, tuż przed DNS: stare `node/N`, aliasy portalu, landingi edycji. Nie zgadywać z palca.
- [ ] `news-syrena` do szkicu.

## Zajawka przed dniem domeny

Kilka dni przed premierą (niedziela, 15 listopada 2026) pod domeną wisi jednoekranowa zajawka, nie pełna strona. Kod jest na gałęzi `feat/prelaunch-cover`. Opis layoutu: [zajawka-premiera.md](zajawka-premiera.md).

Dopóki w Netlify nie ma `COVER_MODE=on`, produkcja (`dramaway.netlify.app`) zostaje pełną stroną. Layout zajawki widać wtedy pod `/zajawka`.

Sekretu nie wpisuj tutaj. Wartość jest w Bitwardenie. Do podglądu potrzebne są obie zmienne. Samo `COVER_MODE=on` bez sekretu, albo sekret z literówką, zostawia zajawkę dla wszystkich i nie otwiera strony.

1. Merge na `main`. Zmienne jeszcze puste.
2. Przed DNS, kontekst Production: ustaw `COVER_MODE=on` i `COVER_SECRET`, potem przebudowa. Obie zmienne muszą mieć zakres „All scopes” (albo co najmniej Builds oraz Functions/Runtime): bramka czyta je w czasie działania, nie tylko przy budowaniu. Production to dziś `dramaway.netlify.app`, więc od tej chwili zajawkę widzi tam każdy, także klient. Link `?podglad=` plus sekret z Bitwardena trzeba przekazać w tym momencie. Wystarczy raz na przeglądarkę (ciasteczko na 30 dni).
3. Sprawdzenie na `dramaway.netlify.app`: `/` to zajawka i pasek zostaje `/`. Inna ścieżka, także `/zajawka` i stary adres Drupala, wraca na `/` (302). Link podglądu otwiera pełną stronę pod jej adresem. Pusty `?podglad` albo zła wartość kasuje ciasteczko i wraca na zajawkę. Okno prywatne po wizycie redaktora nadal dostaje zajawkę, nie HTML pełnej strony.
4. DNS na `fundacja.dramaway.pl`, TLS. `NEXT_PUBLIC_SITE_INDEX` zostaje wyłączone. Domena główna to apex, `www` jest aliasem. Przekierowanie `www` → apex (301, ta sama ścieżka i zapytanie) robi middleware, nie Netlify.
5. Premiera: usuń `COVER_MODE` i `COVER_SECRET`, przebudowa, dopiero potem `NEXT_PUBLIC_SITE_INDEX=true`. `NEXT_PUBLIC_SITE_URL` ustawiasz w dniu domeny (Faza C), nie w dniu premiery. Sekret był w linku, historii przeglądarki i logach Netlify. Po premierze go nie używaj ponownie i wyjmij z Netlify.

`COVER_MODE=on` kieruje ruch publiczny na `/`. Inne ścieżki HTML dostają 302. Przechodzą `/_next`, `/api` (w tym webhook) i każda ścieżka z rozszerzeniem pliku. Nagłówki cache ustawia middleware, nie `next.config.ts`. Przekierowanie www działa przed tą bramką, niezależnie od `COVER_MODE`, i zostaje po premierze. Netlify nie dokłada własnej reguły: apex jest domeną główną, www aliasem.

## Faza C — dzień domeny

Kto: osoba z dostępem do DNS `dramaway.pl` i do Netlify Fundacji.

Do tego dnia `dramaway.netlify.app` zostaje noindex.

- [ ] `fundacja.dramaway.pl` na Netlify, TLS. Zajawka z sekcji wyżej jest już włączona.
- [ ] Env: `NEXT_PUBLIC_SITE_URL=https://fundacja.dramaway.pl`. `NEXT_PUBLIC_SITE_INDEX` zostaje wyłączone, dopóki zajawka wisi.
- [ ] Apex zostaje domeną główną, `www` aliasem. Przekierowanie na apex robi middleware, nie reguła w Netlify.
- [ ] Wgrać `_redirects` z mapy 301.
- [ ] CORS Studio: origin produkcji w Sanity Manage.
- [ ] Smoke, Search Console.
- [ ] Webhook Sanity na docelową domenę.

Rollback: poprzedni deploy Netlify (Deploys → Publish deploy) + eksport datasetu z dysku Fundacji.
