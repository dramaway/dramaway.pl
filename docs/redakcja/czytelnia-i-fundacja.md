# Czytelnia i O fundacji

## Czytelnia

Tekst Czytelni to dokument **Publication**. Nie każdy dokument dostaje własną stronę.

<!-- screen: czytelnia-dokument | Dokument Publication z widocznym Format i polem File (PDF) | Widać, skąd bierze się cel wiersza: podstrona albo pobranie -->

**Format** decyduje o dwóch rzeczach: w której szufladzie spisu wisi tekst (na stronie etykiety są po polsku; w panelu lista jest po angielsku: Articles, Books, Scripts, Multimedia) oraz dokąd prowadzi wiersz.

- **Books** i **Multimedia** — wiersz idzie na podstronę `/czytelnia/` plus końcówka z pola Slug. Na spisie napis to „więcej”.
- **Articles** i **Scripts**, gdy w **File** jest PDF — wiersz otwiera ten plik (napis „pobierz PDF”). Osobnej strony nie ma. Wejście na adres `/czytelnia/…` przerzuca na plik. Sam opis w tekście nie tworzy strony: opis widać w wierszu.
- Film (**YouTube** w tekście) zostawia podstronę, także przy artykule albo scenariuszu z plikiem. Na tej stronie zostaje „pobierz PDF”, jeśli plik jest.
- Brak pliku — podstrona, bo tekst nie ma innego miejsca.

**Categories** to etykiety z listy **Category** (w danych nazywają się metodami czytania). To nie jest opis metod na stronie Baza wiedzy i nie jest drugi spis.

**Listed in Czytelnia** tylko włącza tekst do spisu na `/czytelnia`. Odznaczenie chowa pozycję z listy. Nie decyduje, czy powstaje podstrona, czy link do pliku.

<!-- screen: czytelnia-listed | Pole Listed in Czytelnia odznaczone | Widać, że da się schować tekst ze spisu; przełącznik nie wybiera strony ani pliku -->

![Przełącznik Listed in Czytelnia. Na tym tekście jest włączony.](img/czytelnia-listed.png)

Autorzy to wpisane nazwiska, nie link do dokumentu osoby. PDF wisi w polu **File**.

Okładka na spisie to **pierwszy obrazek w tekście** (Body). Osobnego pola okładki nie ma. Hotspot tego obrazka jest środkiem kółka. Pusty tekst bez obrazka zostawia piaskowe kółko. Obrazek wstawiamy na początku tekstu, zanim pójdą akapity.

<!-- screen: czytelnia-okladka | Początek Body w Publication: obrazek jako pierwszy blok, z uzupełnionym alt i zaznaczonym hotspotem | Widać, że okładka spisu to pierwszy obrazek w tekście, nie osobne pole -->

Szczegóły układu spisu (przyciski rodzaju, sekcje kategorii) wynikają z Format i Categories. Nie ma osobnego ekranu „ułożenia Czytelni” poza dokumentem listingu **Czytelnia** (hero) i samymi publikacjami.

Żeby z Bazy wiedzy (albo z innego tekstu) otworzyć jedną metodę: w treści wstaw **Button**, cel **Dokument**, listing **Czytelnia**, w **Zaawansowane → Parametry** wpisz `kategoria=…` (na przykład `kategoria=teatr-forum`). Tabela slugów i kotwica: [Tekst](tekst.md#zaawansowane-kotwica-i-parametry). Bez parametru wszystkie sekcje są otwarte. Na spisie nagłówek zwija i rozwija swoją sekcję; adres dostaje `kategoria`, gdy zostaje otwarta dokładnie jedna.

## O fundacji

Dokument **O fundacji**, adres `/fundacja`. Pusta lista w danej grupie chowa cały blok.

<!-- screen: fundacja-grupy | Zakładki dokumentu O fundacji: Hero, Metody i wartości, Zespół, Historia, Dokumenty | Widać, że jedna strona jest podzielona na te pięć grup -->

![Zakładki dokumentu O fundacji](img/fundacja-grupy.png)

**Metody i wartości.** Kręgi z krótką nazwą. Pusta lista = brak kręgów. Na telefonie jest jeden przewijany rząd.

**Zespół.** Nagłówek, wybrane osoby (dokumenty Person) i opcjonalny tekst pod zdjęciami. Skład ról w tekście oznaczamy listą Roles, patrz [Tekst](tekst.md). Puste osoby i pusty tekst = brak sekcji. Osobna strona `/zespol` to listing wszystkich osób i nie zastępuje tego bloku.

**Historia.** Nagłówek i lead stoją nad osią. Lead to tekst sformatowany. Pusty lead zostawia samą oś.

Każdy wiersz na liście **Wpis na osi czasu** ma trzy pola: **Rok / znacznik** (napis w kółku, na przykład ‘11), **Tytuł** i **Opis**. Rok i tytuł są wymagane. Pusty opis zostawia sam rok i tytuł. Pusta lista wpisów chowa całą oś. Nie wklejamy przykładowych lat z makiety.

Na stronie opisy startują zwinięte. Przy przewijaniu otwierają się lata najbliżej środka ekranu. Ucięty opis zanika, dopóki nie jest otwarty w całości. Gdy kółko jest już w górnej części ekranu, opis zostaje otwarty i zwija się dopiero przy dalszym przewijaniu. Dłuższy opis zostaje otwarty dłużej, żeby dało się go doczytać. Nad osią jest jeden napis „rozwiń całość”. Po kliknięciu zmienia się w „zwiń całość”: otwiera wszystkie opisy do zwykłego czytania i na ten czas wyłącza otwieranie scrollem.

**Układ osi** to Pionowy albo Poziomy. Pionowy układa lata jedno pod drugim. Na szerokim ekranie kółka lekko schodzą w prawo. Poziomy na szerokim ekranie jedzie w bok razem ze scrollem strony. Na telefonie i przy ograniczeniu ruchu oś jest zawsze pionowa, przy lewej krawędzi. Puste pole = pion.

<!-- screen: fundacja-historia | Grupa Historia: przełącznik Układ osi ustawiony na Pionowy i jeden wpis z rokiem, tytułem i opisem | Widać, że rok to tekst w kółku, a układ osi wybiera się w tej grupie -->

**Dokumenty.** Każdy wiersz to tytuł plus strona z panelu, plik PDF albo adres. Pusta lista = brak sekcji.

<!-- screen: fundacja-dokumenty | Jeden wiersz dokumentów z tytułem i podpiętym PDF | Widać, że dokument może być plikiem, a nie tylko linkiem do strony -->

## Kontakt

**Kontakt** to zwykła strona (Page). Nie ma formularza. Adresy mailowe na tej stronie biorą się z pól e-mail przy osobach, nie z osobnego formularza.
