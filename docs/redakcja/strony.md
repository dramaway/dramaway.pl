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
- **Sekcje** — lista bloków pod dużym nagłówkiem. Jak je dodawać: niżej, rozdział [Sekcje](#sekcje).

<!-- screen: strony-glowna-grupy | Dokument Strona główna z widocznymi zakładkami grup | Widać Nawigacja, Stopkę, Hero i Sekcje jako osobne karty jednego dokumentu -->

![Zakładki dokumentu Strona główna](img/strony-glowna-grupy.png)

Aktualności to osobny typ **News**, na tej samej liście co Project, Person i Page. Adres to `/{slug}`, bez przedrostka. Na stronie głównej zbiera je sekcja **Aktualności**, opisana niżej.

Pola: tytuł, slug, data, zajawka, treść. **CTA target** puste zostawia przycisk „czytaj więcej”, który prowadzi do tej aktualności. Inny adres — ścieżka od ukośnika albo `https://` — wymaga własnej etykiety. Bez etykiety Studio nie pozwoli opublikować, a strona i tak zostawi zwykły przycisk.

<!-- screen: strony-aktualnosc | Dokument News z pustym CTA i z wypełnionym adresem, przy którym widać etykietę | Widać, że własny link wymaga własnego tekstu przycisku -->

## Sekcje

Sekcja to blok pod dużym nagłówkiem: kilka kafelków albo lista najnowszych rzeczy. Kolejność na liście w Studio jest kolejnością na stronie. Pusta lista nic nie dodaje.

Są dwa miejsca:

1. **Strona główna** → zakładka **Sekcje** → lista **Sekcje**. Bloki wchodzą pod duży nagłówek.
2. Dokument **Page** (Baza wiedzy, Kontakt, statut i inne zwykłe strony) → pole **Sekcje**, nad treścią artykułu. Dokument **News** tego pola nie ma: to sam artykuł.

Na liście: **Add item**, potem **Kafelki** albo **Aktualności**. Wiersz da się przeciągnąć. Na stronę wychodzi dopiero po **Publish**.

<!-- screen: strony-sekcje | Lista Sekcje z jednym wierszem Kafelki i jednym Aktualności | Widać, że nowy blok dodaje się do listy, a nie jako osobny dokument -->

### Kafelki

Do trzech kafelków w jednej sekcji. Każdy kafelek to tytuł, krótki opis i etykieta linku. Cały kafelek prowadzi w jedno miejsce. Nie da się osobno podlinkować przycisku i tytułu.

Cel kafelka:

- **Dokument z CMS** — istniejąca strona, projekt, publikacja, osoba, listing (Projekty, Czytelnia, Zespół) albo O fundacji. Baza wiedzy to zwykła strona, nie listing.
- **Adres** — ścieżka od ukośnika (`/projekty`) albo adres `https://`.

Pusty **Tytuł** bierze tytuł dokumentu. Pusty **Opis** bierze zajawkę dokumentu. Pusta **Etykieta linku** to „zobacz” przy osobie i projekcie, a „czytaj więcej” przy reszcie.

Bez zdjęcia jest pole **Układ tekstu**:

- **Siatka** — do trzech kolumn obok siebie. Na wąskim ekranie jeden kafelek pod drugim.
- **Lista** — jeden pod drugim, szersza kolumna na środku.

Ze **Zdjęciem** układ tekstu znika. Strona kadru ustawia się sama: pierwsze zdjęcie w danej liście sekcji po lewej, następne po prawej, i tak na zmianę. Tego nie wybiera się ręcznie. Przy dwóch lub trzech kafelkach opis na stronie skraca się do trzech linii. Przy jednym kafelek jest wyśrodkowany w pionie obok zdjęcia.

### Aktualności

Nagłówek pusty zostaje jako „Aktualności”.

**Ile najnowszych** to liczba od 1 do 12. Puste pole oznacza 3.

**Rodzaje treści** można zaznaczyć kilka naraz: News, strony, osoby, projekty, publikacje. Puste zaznaczenie oznacza same News. Na stronie powstaje jedna lista, od najnowszej daty, bez względu na rodzaj.

## Listingi

Trzy dokumenty **Landing page**, przypięte jako skróty, gdy menu jest puste albo gdy są w menu:

| Skrót | Adres |
|-------|--------|
| Projekty | `/projekty` |
| Czytelnia | `/czytelnia` |
| Zespół | `/zespol` |

**Baza wiedzy** (`/baza-wiedzy`) nie jest listingiem. To zwykła strona **Page**: nagłówek, lead, sekcje i treść z opisem metod. Stary adres `/metody` przekierowuje tutaj. W menu ma jedno dziecko, Czytelnię.

Pola hero (tytuł, lead, przycisk, zdjęcie) są na tym dokumencie. Puste = tego elementu nie ma. Adresu listingu nie da się zmienić: pole strony jest zablokowane po pierwszym zapisie.

<!-- screen: strony-listing | Dokument Projekty z zablokowanym polem strony i pustym tytułem | Widać, że adres jest stały, a pusty tytuł nie wymyśla nagłówka -->

## O fundacji

Skrót **O fundacji**, adres `/fundacja`. Grupy: Hero, Metody i wartości, Zespół, Historia, Dokumenty. Co wpisać w dalszych grupach: [Czytelnia i O fundacji](czytelnia-i-fundacja.md).

## Projekty, osoby, publikacje, zwykłe strony

Niżej na liście są typy, nie pojedyncze skróty:

- **Project** — jeden projekt, adres `/projekty/…`. Art Generacje ma dodatkowo podstrony edycji.
- **Person** — osoba, adres `/zespol/…`.
- **News** — aktualność. Adres `/{slug}`. Krótki formularz: tytuł, data, zajawka, treść i opcjonalny przycisk. Własny adres przycisku wymaga własnej etykiety.
- **Page** — Baza wiedzy, Kontakt, strony typu statut. Adres to `/{slug}`. W Studio lista dzieli się na **Drupal** (stare resztki do wygaszenia), **W menu** i **Poza menu**. Pole **Sekcje** nad artykułem: [Sekcje](#sekcje).
- **Publication** — tekst Czytelni, adres `/czytelnia/…`.
- **Category** — etykieta kategorii w Czytelni, nie opis metod na stronie Baza wiedzy.

<!-- screen: strony-typy | Dolna część listy Content: Project, Person, Page, Category, Publication | Widać, gdzie szukać tekstu, który nie ma własnego skrótu na górze -->

![Listy typów pod kreską](img/strony-typy.png)

Nowy dokument dostaje adres z pola **Slug**. Slug powstaje z tytułu. Po publikacji nie zmieniamy go bez potrzeby: zmieni się link, który ktoś mógł już dostać.
