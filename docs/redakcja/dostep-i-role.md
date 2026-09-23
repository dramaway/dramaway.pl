# Dostęp i role

Codzienna praca nad tekstami odbywa się tylko w Studio. GitHub i Netlify są do utrzymania strony, nie do pisania artykułów.

## Kto czym się loguje

| Mail | Gdzie wchodzi | Rola | Po co |
|------|----------------|------|--------|
| Własny mail osoby z redakcji | tylko Studio | **Editor** | pisze i publikuje treść |
| `admin@dramaway.pl` | poczta, Sanity (właściciel organizacji), GitHub (właściciel organizacji), Netlify (właściciel teamu) | w projekcie Sanity także **Administrator** | backup zarządzania. Nie do codziennego pisania |
| Mail osoby od utrzymania (Jan) | Studio, repozytorium kodu | **Administrator** projektu Sanity | poprawki techniczne, tokeny, zaproszenia. Nie zastępuje redakcji |

<!-- screen: role-zaproszenie | Lista członków projektu w Sanity Manage, przy redakcji widać Editor, przy admin@ Administrator | Widać, że codzienna redakcja i skrzynka właściciela to dwie różne osoby -->

Zaproszenie redakcyjne przychodzi na **własny** mail. Nie zakładamy wspólnego loginu i nie wysyłamy redakcji na `admin@dramaway.pl`.

## Dlaczego redakcja jest Editor, a nie Administrator

Administrator projektu może tworzyć tokeny zapisu, zmieniać ustawienia dostępu i usunąć dane. Editor tego nie może: edytuje i publikuje dokumenty, a ustawienia projektu zostają nietknięte.

Dokładny opis ról Sanity: [Roles](https://www.sanity.io/docs/user-guides/roles).

U nas świadomie nie używamy na start:

- **Contributor** — pisze szkice, ale sam nie publikuje. Włączymy, gdy pojawi się taki podział pracy.
- **Viewer** — tylko podgląd. Nie zajmuje płatnego miejsca, ale nie służy do edycji.
- **Blueprints editor** — narzędzie techniczne, nie redakcja.

Własne, węższe role (na przykład „tylko Czytelnia”) wymagają planu Enterprise. Nie mamy ich.

## Czego redakcja nie rusza

- GitHub i Netlify. Tam stoi kod i hosting. Właścicielem jest `admin@dramaway.pl`.
- Tokenów, CORS i datasetów w Sanity Manage. To robi Administrator.
- Przycisków deployu Studia.

Po **Publish** strona odświeża się sama, zwykle po chwili. Gdy treść nie wraca przez minutę, napisz do osoby od utrzymania. Nie trzeba wchodzić na Netlify.

Skrzynka `admin@dramaway.pl` dostaje maile o kontach właściciela (Sanity, GitHub, Netlify). Hasło i kody 2FA trzyma Fundacja.
