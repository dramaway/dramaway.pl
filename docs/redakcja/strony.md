# Który dokument jest którą stroną

Skrót po lewej otwiera jeden dokument. Ten dokument składa konkretny adres na stronie. Puste pole znika ze strony: nie pokazujemy wtedy pustego nagłówka ani pustego przycisku.

<!-- screen: strony-skroty | Góra listy Content ze skrótami | Widać, że Strona główna, listingi i O fundacji są osobnymi pozycjami, nie jedną „stroną o wszystkim” -->

## Strona główna

Skrót **Strona główna**. Na dole listy ten sam dokument nazywa się **Site settings**: to jedno i to samo miejsce.

Dokument ma zakładki:

- **Ogólne**: tytuł witryny.
- **Nawigacja**: menu. Osobna instrukcja: [Menu](menu.md).
- **Stopka**: logo, adres, cytat.
- **Ikony**: ikona karty przeglądarki i obrazek do udostępniania. Zwykle zostaje przy osobie od utrzymania.
- **Hero**: duży nagłówek na górze strony głównej. Opis niżej, w rozdziale [Hero](#hero).
- **Sekcje**: lista bloków pod dużym nagłówkiem. Opis niżej, w rozdziale [Sekcje](#sekcje).

<!-- screen: strony-glowna-grupy | Dokument Strona główna z widocznymi zakładkami grup | Widać Nawigację, Stopkę, Hero i Sekcje jako osobne karty jednego dokumentu -->

![Zakładki dokumentu Strona główna](img/strony-glowna-grupy.png)

## Hero

**Hero** to duży nagłówek na górze strony: tytuł, krótki opis, przycisk i zdjęcia. Strona główna, listingi, **O fundacji**, zwykłe strony i projekty mają go w formularzu. Puste pole oznacza, że tego elementu nie ma na stronie. Gdy puste jest wszystko, nagłówka nie ma wcale.

**Zdjęcia** (pole **Zdjęcia hero**):

- Można dodać od zera do pięciu. Kolejność na liście to kolejność pokazu.
- Zero zdjęć: strona nie pokazuje zdjęcia.
- Jedno zdjęcie: stoi nieruchomo.
- Dwa lub więcej: pokaz slajdów z miniaturami.

Przy każdym zdjęciu:

- **Hotspot**: ustaw go, bo miniatury pokazują przybliżony kadr wokół niego.
- **Alt**: krótki opis dla osób, które nie widzą zdjęcia.
- **Podpis**: opcjonalny, pokazuje się jako podpowiedź przy miniaturze. Może być bardziej redakcyjny niż Alt. Przy jednym zdjęciu nie ma miniatur, więc podpis nie pojawia się na stronie.
- Jeśli wypełnisz tylko jedno z pól Alt i Podpis, Studio pokaże przycisk, który kopiuje wpis do drugiego.

**Tempo pokazu** ustawia się raz dla wszystkich nagłówków na stronie: **Strona główna** → **Hero** → **Slider hero**. Są tam dwa ustawienia:

- **Czas klatki**: ile sekund widać jedno zdjęcie. Od 4 do 20, puste = 7.
- **Autoodtwarzanie**: włączone zmienia zdjęcia samo, wyłączone zostawia tylko miniatury. Osoby, które w systemie mają włączone „mniej animacji”, widzą pokaz zatrzymany niezależnie od tego ustawienia.

## Sekcje

Sekcja to blok pod dużym nagłówkiem: kilka kafelków albo lista najnowszych rzeczy. Kolejność na liście w Studio jest kolejnością na stronie. Pusta lista nic nie dodaje.

Są trzy miejsca na sekcje:

1. **Strona główna** → zakładka **Sekcje** → lista **Sekcje**. Bloki wchodzą pod duży nagłówek.
2. Dokument **Page** (Baza wiedzy, Kontakt, statut i inne zwykłe strony) → pole **Sekcje**, nad treścią artykułu. Dokument **News** tego pola nie ma.
3. Listing **Projekty** (`/projekty`) → grupa **Listing** → lista **Sekcje**. Bloki wchodzą nad „Zakończone projekty”.

> **Uwaga na listingu Projekty.** Dopóki lista **Sekcje** jest pusta, strona pokazuje wiersz aktywnych projektów (dziś Art Generacje) i opcjonalnie wiersz Czytelni. Gdy dodasz choćby jeden blok, ten wiersz znika. Art Generacje i Czytelnię trzeba wtedy dodać jako kafelki. „Zakończone projekty” niżej nie układa się ręcznie: biorą się z projektów oznaczonych jako zakończone.

Jak dodać: na liście naciśnij **Add item** i wybierz **Kafelki** albo **Aktualności**. Wiersz można przeciągnąć. Na stronie pojawi się po **Publish**.

<!-- screen: strony-sekcje | Lista Sekcje z jednym wierszem Kafelki i jednym Aktualności | Widać, że nowy blok dodaje się do listy, a nie jako osobny dokument -->

### Kafelki

W jednej sekcji może być do trzech kafelków. Kafelek ma tytuł, krótki opis i etykietę linku. Cały kafelek prowadzi w jedno miejsce: nie da się osobno podlinkować przycisku i tytułu.

**Cel kafelka:**

- **Dokument z CMS**: istniejąca strona, projekt, publikacja, osoba, listing (Projekty, Czytelnia, Zespół) albo O fundacji. Baza wiedzy to zwykła strona, nie listing.
- **Adres**: ścieżka od ukośnika (`/projekty`) albo adres `https://`.

**Co się dzieje, gdy zostawisz pole puste:**

| Pole | Gdy puste |
|------|-----------|
| **Tytuł** | Kafelek bierze tytuł dokumentu |
| **Opis** | Kafelek bierze zajawkę dokumentu |
| **Etykieta linku** | „zobacz” przy osobie i projekcie, „czytaj więcej” przy reszcie |

**Układ.** Bez zdjęcia wybierasz pole **Układ tekstu**:

- **Siatka**: do trzech kolumn obok siebie. Na wąskim ekranie kafelki układają się jeden pod drugim.
- **Lista**: jeden pod drugim, szersza kolumna na środku.

Ze zdjęciem pole **Układ tekstu** znika. Strona kadru ustawia się sama: pierwsze zdjęcie w danej liście sekcji jest po lewej, następne po prawej, i tak na zmianę. Tego nie wybiera się ręcznie. Przy dwóch lub trzech kafelkach opis na stronie skraca się do trzech linii. Przy jednym kafelku tekst stoi pośrodku wysokości, obok zdjęcia.

### Aktualności

- **Nagłówek**: puste zostawia „Aktualności”.
- **Ile najnowszych**: liczba od 1 do 12, puste = 3.
- **Rodzaje treści**: można zaznaczyć kilka naraz (News, strony, osoby, projekty, publikacje). Puste zaznaczenie oznacza same News. Na stronie powstaje jedna lista, od najnowszej daty, bez względu na rodzaj.

## Listingi

Trzy dokumenty typu **Landing page**. Skrót do nich jest na górze listy, gdy menu jest puste albo gdy są w menu.

| Skrót | Adres |
|-------|--------|
| Projekty | `/projekty` |
| Czytelnia | `/czytelnia` |
| Zespół | `/zespol` |

**Baza wiedzy** (`/baza-wiedzy`) nie jest listingiem. To zwykła strona **Page**: nagłówek, krótki opis, sekcje i treść z opisem metod. Stary adres `/metody` przekierowuje tutaj. W menu ma jedną podpozycję, Czytelnię.

Hero listingu (tytuł, krótki opis, przycisk, zdjęcia) wypełnia się tak samo jak wszędzie: [Hero](#hero). Adresu listingu nie da się zmienić, bo pole strony jest zablokowane po pierwszym zapisie.

Na **Projektach** jest dodatkowo grupa **Listing** z listą **Sekcje** i polem **Pokaż Czytelnię**. To pole widać tylko wtedy, gdy lista **Sekcje** jest pusta. Opis sekcji: [Sekcje](#sekcje).

<!-- screen: strony-listing | Dokument Projekty z zablokowanym polem strony i pustym tytułem | Widać, że adres jest stały, a pusty tytuł nie wymyśla nagłówka -->

## O fundacji

Skrót **O fundacji**, adres `/fundacja`. Zakładki: Hero, Metody i wartości, Zespół, Historia, Dokumenty. Co wpisać w kolejnych zakładkach: [Czytelnia i O fundacji](czytelnia-i-fundacja.md).

## Projekty, osoby, publikacje, zwykłe strony

Niżej na liście Content są typy dokumentów, a nie pojedyncze skróty:

- **Project**: jeden projekt, adres `/projekty/…`. Art Generacje ma dodatkowo podstrony edycji. Hero działa jak wszędzie: [Hero](#hero). Pusta lista zdjęć zostawia dotychczasowy kadr: pierwszą galerię edycji, a gdy jej nie ma, pierwszy obraz w treści.
- **Person**: osoba, adres `/zespol/…`.
- **News**: aktualność, adres `/{slug}`. Pola: tytuł, data, zajawka, treść i opcjonalny przycisk. Pole **CTA target** puste zostawia przycisk „czytaj więcej”, który prowadzi do tej aktualności. Inny adres (ścieżka od ukośnika albo `https://`) wymaga własnej etykiety w polu **CTA label**. Bez etykiety Studio nie pozwoli opublikować. Na stronie głównej aktualności zbiera sekcja **Aktualności**.
- **Page**: Baza wiedzy, Kontakt, strony typu statut. Adres to `/{slug}`. W Studio lista dzieli się na **Drupal** (stare pozostałości po poprzedniej stronie, do wygaszenia), **W menu** i **Poza menu**. Hero działa jak wszędzie, a pole **Sekcje** stoi nad artykułem.
- **Publication**: tekst Czytelni. Dokąd prowadzi wiersz na spisie: [Czytelnia i O fundacji](czytelnia-i-fundacja.md#dokąd-prowadzi-wiersz-na-spisie).
- **Category**: etykieta kategorii w Czytelni, nie opis metod na stronie Baza wiedzy.

<!-- screen: strony-aktualnosc | Dokument News z pustym CTA i z wypełnionym adresem, przy którym widać etykietę | Widać, że własny link wymaga własnego tekstu przycisku -->

<!-- screen: strony-typy | Dolna część listy Content: Project, Person, Page, Category, Publication | Widać, gdzie szukać tekstu, który nie ma własnego skrótu na górze -->

![Listy typów pod kreską](img/strony-typy.png)

Nowy dokument dostaje adres z pola **Slug**, a slug powstaje z tytułu. Po publikacji nie zmieniaj go bez potrzeby: zmieni się link, który ktoś mógł już dostać.
