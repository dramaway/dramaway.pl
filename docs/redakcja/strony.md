# Który dokument jest którą stroną

Skrót po lewej otwiera jeden dokument. Ten dokument składa konkretny adres na stronie. Puste pole znika: nie pokazujemy wtedy pustego nagłówka ani pustego przycisku.

<!-- screen: strony-skroty | Góra listy Content ze skrótami | Widać, że Strona główna, listingi i O fundacji są osobnymi pozycjami, nie jedną „stroną o wszystkim” -->

## Strona główna

Skrót **Strona główna** (na dole listy ta sama rzecz nazywa się **Site settings**).

Grupy:

- **Ogólne** — tytuł witryny.
- **Nawigacja** — menu. Osobna instrukcja: [Menu](menu.md).
- **Stopka** — logo, adres, cytat.
- **Ikony** — ikona karty przeglądarki i obrazek do udostępniania. Zwykle zostaje przy utrzymaniu.
- **Hero** — duży nagłówek strony startowej, lead, przycisk, zdjęcie.
- **Homepage** — lista sekcji pod hero: kafelki (same albo ze zdjęciem) i aktualności. Pusta lista = na stronie głównej zostaje samo hero. Te same sekcje można dodać na dokumencie **Page**, nad treścią artykułu.

<!-- screen: strony-glowna-grupy | Dokument Strona główna z widocznymi zakładkami grup | Widać Nawigacja, Stopka, Hero i Homepage jako osobne karty jednego dokumentu -->

![Zakładki dokumentu Strona główna](img/strony-glowna-grupy.png)

Aktualności na stronie głównej nie są osobnym typem. To dokumenty **Page**, których adres wewnętrzny zaczyna się od `aktualnosc-`. Na liście widać je jako zwykłe strony. Sekcja „Aktualności” w module strony bierze najnowsze według daty dodania. Domyślnie są to te wpisy, do trzech. W tej samej sekcji można podnieść limit (do 12) i dodać inne rodzaje: zwykłe strony, osoby, projekty, publikacje. Zaznaczenie kilku rodzajów składa jedną listę, od najnowszego.

<!-- screen: strony-aktualnosc | Lista Page z dokumentem, którego slug zaczyna się od aktualnosc- | Widać, że news nie ma własnej półki, tylko przedrostek w adresie -->

![Pole Slug aktualności, z przedrostkiem aktualnosc-](img/strony-aktualnosc.png)

## Listingi

Cztery dokumenty **Landing page**, przypięte jako skróty, gdy menu jest puste albo gdy są w menu:

| Skrót | Adres |
|-------|--------|
| Projekty | `/projekty` |
| Baza wiedzy | `/baza-wiedzy` |
| Czytelnia | `/czytelnia` |
| Zespół | `/zespol` |

Pola hero (tytuł, lead, przycisk, zdjęcie) są na tym dokumencie. Puste = tego elementu nie ma. Adresu listingu nie da się zmienić: pole strony jest zablokowane po pierwszym zapisie.

<!-- screen: strony-listing | Dokument Projekty z zablokowanym polem strony i pustym tytułem | Widać, że adres jest stały, a pusty tytuł nie wymyśla nagłówka -->

## O fundacji

Skrót **O fundacji**, adres `/fundacja`. Grupy: Hero, Metody i wartości, Zespół, Historia, Dokumenty. Co wpisać w dalszych grupach: [Czytelnia i O fundacji](czytelnia-i-fundacja.md).

## Projekty, osoby, publikacje, zwykłe strony

Niżej na liście są typy, nie pojedyncze skróty:

- **Project** — jeden projekt, adres `/projekty/…`. Art Generacje ma dodatkowo podstrony edycji.
- **Person** — osoba, adres `/zespol/…`.
- **Page** — Kontakt, Metody, strony typu statut, aktualności. Nad treścią artykułu można dodać te same sekcje co na stronie głównej (kafelki, aktualności). Na aktualnościach (`aktualnosc-*`) tego pola nie ma. Metody i Kontakt, gdy są skrótem na górze, znikają z tej listy, żeby nie wisiały dwa razy.
- **Publication** — tekst Czytelni, adres `/czytelnia/…`.
- **Category** — etykieta kategorii w Czytelni, nie osobna strona metody.

<!-- screen: strony-typy | Dolna część listy Content: Project, Person, Page, Category, Publication | Widać, gdzie szukać tekstu, który nie ma własnego skrótu na górze -->

![Listy typów pod kreską](img/strony-typy.png)

Nowy dokument dostaje adres z pola **Slug**. Slug powstaje z tytułu. Po publikacji nie zmieniamy go bez potrzeby: zmieni się link, który ktoś mógł już dostać.
