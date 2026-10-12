# Zrzuty ekranu do manuala redakcji

Lista robocza dla osoby utrzymującej manual: które kadry są już w [instrukcji](../redakcja/README.md), a których brakuje. To nie jest część instrukcji dla redakcji.

Kadry z lokalnego Studia (`http://localhost:3333`), wycięte do fragmentu, bez publikowania zmian. Pliki leżą w `docs/redakcja/img/`.

Wstawione do instrukcji:

- `studio-po-zalogowaniu`, `studio-media`
- `strony-glowna-grupy`, `strony-aktualnosc`, `strony-typy`
- `menu-grupa`, `menu-pusta-etykieta`, `menu-adres`, `menu-podpozycje`, `menu-skroty-desku`
- `tekst-roles` (w kadrze jest też pasek edytora)
- `czytelnia-listed`, `fundacja-grupy`

Jeszcze bez pliku, bo wymagałyby wylogowania, wejścia w Manage albo przełączenia pola, które zostawiłoby szkic:

| Id | Plik | Kadr | Po co |
|----|------|------|--------|
| `studio-adres` | [README.md](../redakcja/README.md) | Pasek adresu i ekran logowania | Widać adres panelu, nie adres strony. Nie wylogowywałem sesji |
| `role-zaproszenie` | [dostep-i-role.md](../redakcja/dostep-i-role.md) | Lista członków w Sanity Manage | Editor przy redakcji, Administrator przy `admin@`. To nie jest Studio |
| `studio-publish` | [studio-podstawy.md](../redakcja/studio-podstawy.md) | Prawy górny róg ze stanem Published i przyciskiem Publish | Kadr wyszedł ucięty, do powtórzenia |
| `studio-obraz` | [studio-podstawy.md](../redakcja/studio-podstawy.md) | Pole obrazka z alt i hotspotem | Jeszcze nieotwarte |
| `studio-link` | [studio-podstawy.md](../redakcja/studio-podstawy.md) | Otwarte pole URL w tekście | Otwarcie linku łatwo zostawia szkic |
| `strony-skroty` | [strony.md](../redakcja/strony.md) | Sama góra listy, bez typów niżej | Jest w `studio-po-zalogowaniu`, osobny wycinek się rozjechał |
| `strony-listing` | [strony.md](../redakcja/strony.md) | Zablokowane pole strony na listingu Projekty | Kadr uciął radia |
| `strony-sekcje` | [strony.md](../redakcja/strony.md) | Lista Sekcje z wierszem Kafelki i Aktualności | Jeszcze nie zrobiony |
| `czytelnia-dokument` | [czytelnia-i-fundacja.md](../redakcja/czytelnia-i-fundacja.md) | Format i File (PDF) na jednym kadrze | Kadr uciął środek formularza; ma być widać, skąd bierze się cel wiersza |
| `czytelnia-okladka` | [czytelnia-i-fundacja.md](../redakcja/czytelnia-i-fundacja.md) | Pierwszy blok Body to obrazek, z alt i hotspotem | Jeszcze nie |
| `fundacja-dokumenty` | [czytelnia-i-fundacja.md](../redakcja/czytelnia-i-fundacja.md) | Wiersz dokumentu z podpiętym PDF | Na Statucie jest strona, slot PDF jest pusty; kadr uciął pola |
| `fundacja-historia` | [czytelnia-i-fundacja.md](../redakcja/czytelnia-i-fundacja.md) | Grupa Historia: Układ osi na Pionowy i jeden wpis | Jeszcze nie |
| `tekst-toolbar` | [tekst.md](../redakcja/tekst.md) | Sam pasek, z Termin, Indent i Roles | Pasek jest na górze kadru `tekst-roles` |
| `tekst-termin` | [tekst.md](../redakcja/tekst.md) | Akapit w stylu Termin | Trzeba zaznaczyć styl, nie chciałem zmieniać tekstu |
| `tekst-indent` | [tekst.md](../redakcja/tekst.md) | Lista Indent na dwóch poziomach | Jeszcze nie |
| `tekst-columns` | [tekst.md](../redakcja/tekst.md) | Blok Columns, dwie kolumny | Jeszcze nie |
| `tekst-button` | [tekst.md](../redakcja/tekst.md) | Blok Button z celem Dokument i zwiniętym Zaawansowane | Jeszcze nie |
| `tekst-credits` | [tekst.md](../redakcja/tekst.md) | Otwarty blok Wykaz twórców: jedna grupa, wiersz Rola i wiersz Lista bez ról | Jeszcze nie |
| `tekst-credits-strona` | [tekst.md](../redakcja/tekst.md) | Ten sam wykaz na stronie edycji | Jeszcze nie |

Znaczniki `<!-- screen: ... -->` zostają w tekście także przy wstawionych obrazkach.


## Start

| Id | Plik | Kadr | Po co |
|----|------|------|--------|
| `studio-adres` | [README.md](../redakcja/README.md) | Pasek adresu i ekran logowania Studio | Widać, że panel jest pod dramaway.sanity.studio, nie pod adresem strony |

## Dostęp

| Id | Plik | Kadr | Po co |
|----|------|------|--------|
| `role-zaproszenie` | [dostep-i-role.md](../redakcja/dostep-i-role.md) | Lista członków projektu w Sanity Manage. Przy osobie z redakcji rola Editor, przy `admin@dramaway.pl` Administrator | Widać, że codzienna redakcja i skrzynka właściciela to dwie różne osoby |

## Podstawy Studia

| Id | Plik | Kadr | Po co |
|----|------|------|--------|
| `studio-po-zalogowaniu` | [studio-podstawy.md](../redakcja/studio-podstawy.md) | Lewa kolumna Content po zalogowaniu | Widać skróty na górze (Strona główna i kilka stron) oraz niżej listy Project, Person, Page, Publication |
| `studio-publish` | [studio-podstawy.md](../redakcja/studio-podstawy.md) | Prawy górny róg dokumentu ze stanem Published i przyciskiem Publish | Widać, gdzie kończy się szkic, a zaczyna wersja dla czytelników |
| `studio-obraz` | [studio-podstawy.md](../redakcja/studio-podstawy.md) | Otwarte pole obrazka z uzupełnionym alt i zaznaczonym hotspotem | Widać, że sam plik nie wystarcza: jest podpis i punkt kadru |
| `studio-media` | [studio-podstawy.md](../redakcja/studio-podstawy.md) | Zakładka Media z siatką plików | Widać, że zdjęcia da się znaleźć bez otwierania konkretnej strony |
| `studio-link` | [studio-podstawy.md](../redakcja/studio-podstawy.md) | Pasek edytora tekstu z otwartym polem URL linku | Widać, gdzie wpisać ścieżkę wewnętrzną albo adres zewnętrzny |

## Strony

| Id | Plik | Kadr | Po co |
|----|------|------|--------|
| `strony-skroty` | [strony.md](../redakcja/strony.md) | Góra listy Content ze skrótami | Widać, że Strona główna, listingi i O fundacji są osobnymi pozycjami, nie jedną stroną o wszystkim |
| `strony-glowna-grupy` | [strony.md](../redakcja/strony.md) | Dokument Strona główna z widocznymi zakładkami grup | Widać Nawigacja, Stopkę, Hero i Sekcje jako osobne karty. Kadr do powtórzenia: stary plik może jeszcze podpisywać ostatnią kartę jako Homepage |
| `strony-aktualnosc` | [strony.md](../redakcja/strony.md) | Dokument News z pustym CTA i z wypełnionym adresem, przy którym widać etykietę | Widać, że własny link wymaga własnego tekstu przycisku. Stary kadr (przedrostek w slugu) do wymiany |
| `strony-listing` | [strony.md](../redakcja/strony.md) | Dokument Projekty z zablokowanym polem strony | Widać, że adres jest stały, a pusty tytuł nie wymyśla nagłówka |
| `strony-typy` | [strony.md](../redakcja/strony.md) | Dolna część listy Content: Project, Person, Page, Category, Publication | Widać, gdzie szukać tekstu, który nie ma własnego skrótu na górze |
| `strony-sekcje` | [strony.md](../redakcja/strony.md) | Lista Sekcje z wierszem Kafelki i wierszem Aktualności | Widać, że nowy blok dodaje się do listy, a nie jako osobny dokument. Jeszcze bez pliku |

## Menu

| Id | Plik | Kadr | Po co |
|----|------|------|--------|
| `menu-grupa` | [menu.md](../redakcja/menu.md) | Grupa Nawigacja z kilkoma wierszami | Widać, że menu jest listą w ustawieniach strony głównej, a nie osobnym programem |
| `menu-pusta-etykieta` | [menu.md](../redakcja/menu.md) | Wiersz z wybraną stroną i pustym polem etykiety | Widać, że puste pole etykiety bierze tytuł dokumentu |
| `menu-adres` | [menu.md](../redakcja/menu.md) | Wiersz przełączony na Adres, z wpisanym `https://` | Widać, że link zewnętrzny nie wymaga dokumentu w Studio |
| `menu-podpozycje` | [menu.md](../redakcja/menu.md) | Rozwinięta Baza wiedzy z podpozycją Czytelnia | Widać rodzica i dokładnie jeden poziom dzieci |
| `menu-skroty-desku` | [menu.md](../redakcja/menu.md) | Lewa lista Content po uzupełnionym menu, ze Stroną główną na górze i gałęzią Baza wiedzy | Widać, że skróty idą za menu, a Strona główna zostaje |

`menu-skroty-desku` da się zrobić dopiero, gdy lista Nawigacja nie jest pusta. Dziś pusta lista zostawia dotychczasowe skróty, więc najpierw dodaj wiersze i opublikuj, potem zrób kadr i odśwież Studio.

## Tekst

| Id | Plik | Kadr | Po co |
|----|------|------|--------|
| `tekst-toolbar` | [tekst.md](../redakcja/tekst.md) | Pasek edytora z listą stylów, w tym Termin, oraz list Bullet, Numbered, Indent, Roles | Widać, które pozycje są nasze, a które są zwykłym tekstem |
| `tekst-termin` | [tekst.md](../redakcja/tekst.md) | Akapit oznaczony stylem Termin w edytorze | Widać, że Termin jest stylem akapitu, nie osobnym dokumentem |
| `tekst-indent` | [tekst.md](../redakcja/tekst.md) | Lista Indent z dwoma poziomami | Widać, że wcięcie jest rodzajem listy, nie spacjami na początku zdania |
| `tekst-roles` | [tekst.md](../redakcja/tekst.md) | Lista Roles z wierszem „komunikacja: imię i nazwisko” | Widać dwukropek w treści i styl Roles na pasku |
| `tekst-columns` | [tekst.md](../redakcja/tekst.md) | Blok Columns ustawiony na dwie kolumny, w każdej krótki akapit | Widać wybór 2 albo 3 i brak trzeciego zagnieżdżenia |
| `tekst-button` | [tekst.md](../redakcja/tekst.md) | Blok Button z etykietą, celem Dokument i zwiniętym Zaawansowane | Widać, że przycisk jest osobnym blokiem, nie zaznaczeniem w zdaniu |
| `tekst-credits` | [tekst.md](../redakcja/tekst.md) | Otwarty blok Wykaz twórców z jedną grupą, wierszem Rola i wierszem Lista bez ról | Widać cztery poziomy: nagłówek, grupy, wiersze, notka końcowa |
| `tekst-credits-strona` | [tekst.md](../redakcja/tekst.md) | Ten sam wykaz na stronie edycji | Widać tabelę rola i nazwiska, linię pod nagłówkiem grupy i notkę na końcu |

## Czytelnia i O fundacji

| Id | Plik | Kadr | Po co |
|----|------|------|--------|
| `czytelnia-dokument` | [czytelnia-i-fundacja.md](../redakcja/czytelnia-i-fundacja.md) | Dokument Publication z widocznym Format i polem File (PDF) | Widać, skąd bierze się cel wiersza: podstrona albo pobranie |
| `czytelnia-listed` | [czytelnia-i-fundacja.md](../redakcja/czytelnia-i-fundacja.md) | Pole Listed in Czytelnia odznaczone | Widać, że da się schować tekst ze spisu; przełącznik nie wybiera strony ani pliku |
| `czytelnia-okladka` | [czytelnia-i-fundacja.md](../redakcja/czytelnia-i-fundacja.md) | Początek Body w Publication: obrazek jako pierwszy blok, z uzupełnionym alt i zaznaczonym hotspotem | Widać, że okładka spisu to pierwszy obrazek w tekście, nie osobne pole |
| `fundacja-grupy` | [czytelnia-i-fundacja.md](../redakcja/czytelnia-i-fundacja.md) | Zakładki dokumentu O fundacji: Hero, Metody i wartości, Zespół, Historia, Dokumenty | Widać, że jedna strona jest podzielona na te pięć grup |
| `fundacja-dokumenty` | [czytelnia-i-fundacja.md](../redakcja/czytelnia-i-fundacja.md) | Jeden wiersz dokumentów z tytułem i podpiętym PDF | Widać, że dokument może być plikiem, a nie tylko linkiem do strony |
| `fundacja-historia` | [czytelnia-i-fundacja.md](../redakcja/czytelnia-i-fundacja.md) | Grupa Historia: przełącznik Układ osi ustawiony na Pionowy i jeden wpis z rokiem, tytułem i opisem | Widać, że rok to tekst w kółku, a układ osi wybiera się w tej grupie. Jeszcze bez pliku |

Wstawione: 13. Zostało: 19, lista na górze tego pliku.
