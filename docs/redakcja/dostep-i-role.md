# Dostęp i role

Codzienna praca nad tekstami odbywa się wyłącznie w Studio. GitHub, Netlify i ustawienia projektu w Sanity służą do utrzymania strony, redakcja ich nie potrzebuje.

## Twoje konto

Zaproszenie do Studia przychodzi na **twój własny** mail. Tym mailem się logujesz. Nie ma wspólnego loginu dla całej redakcji.

Masz rolę **Editor**. Możesz tworzyć, edytować i publikować dokumenty. Nie możesz zmieniać ustawień dostępu ani tworzyć kluczy, które pozwalają zapisywać dane spoza Studia. To celowe: jedno złe kliknięcie w takich ustawieniach mogłoby uszkodzić całą treść strony.

## Kto czym się loguje

| Konto | Gdzie | Rola | Do czego |
|-------|-------|------|----------|
| Własny mail osoby z redakcji | Studio | **Editor** | Pisanie i publikowanie treści |
| `admin@dramaway.pl` | Poczta, Sanity, GitHub, Netlify (właściciel) | **Administrator** | Zapasowy dostęp do pełnego zarządzania. Nie do codziennego pisania |
| Osoba od utrzymania strony | Studio, repozytorium kodu | **Administrator** | Poprawki techniczne, zaproszenia, klucze dostępu |

<!-- screen: role-zaproszenie | Lista członków projektu w Sanity Manage, przy redakcji widać Editor, przy admin@ Administrator | Widać, że codzienna redakcja i skrzynka właściciela to dwie różne osoby -->

Nie wysyłamy redakcji zaproszeń na `admin@dramaway.pl`. Ta skrzynka dostaje maile o kontach właściciela (Sanity, GitHub, Netlify). Hasło i kody dwuetapowego logowania trzyma Fundacja.

## Czego redakcja nie rusza

- GitHub i Netlify. Tam stoi kod i hosting.
- Ustawienia projektu w Sanity Manage: klucze dostępu, adresy, z których Studio może łączyć się z danymi, zbiory danych.
- Przyciski wdrażania Studia.

## Gdy coś nie działa

- **Zmiana nie pojawia się na stronie.** Po **Publish** strona odświeża się sama, zwykle po chwili. Jeśli po minucie nie ma zmiany, napisz do osoby od utrzymania. Nie trzeba wchodzić na Netlify.
- **Nie przyszło zaproszenie albo nie możesz się zalogować.** Napisz do osoby od utrzymania.

Dlaczego redakcja ma rolę Editor, a nie inną, i jak wygląda podział ról po stronie administratorów: [guides/sanity-roles.md](../guides/sanity-roles.md).
