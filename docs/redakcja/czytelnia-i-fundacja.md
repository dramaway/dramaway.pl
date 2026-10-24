# Czytelnia i O fundacji

## Czytelnia

Tekst Czytelni to dokument **Publication**. Nie każdy dokument dostaje własną stronę: wiersz na spisie pod tekstem na stronie `/baza-wiedzy` (dawna Czytelnia) prowadzi albo na podstronę, albo prosto do pliku PDF. Przepis krok po kroku: [Dodać tekst do Czytelni](zadania.md#dodać-tekst-do-czytelni).

<!-- screen: czytelnia-dokument | Dokument Publication z widocznym Format i polem File (PDF) | Widać, skąd bierze się cel wiersza: podstrona albo pobranie -->

### Dokąd prowadzi wiersz na spisie

To zależy od trzech rzeczy: **Format**, PDF w polu **File (PDF)** i filmu YouTube w treści.

| Format | PDF w polu **File** | Film YouTube w treści | Co robi wiersz na spisie |
|--------|---------------------|------------------------|---------------------------|
| Books, Multimedia | dowolnie | dowolnie | Prowadzi na podstronę. Napis w wierszu: „więcej” |
| Articles, Scripts | jest | nie ma | Otwiera plik. Napis w wierszu: „pobierz PDF” |
| Articles, Scripts | jest | jest | Prowadzi na podstronę. Na podstronie zostaje „pobierz PDF” |
| Articles, Scripts | brak | dowolnie | Prowadzi na podstronę |

Gdy wiersz otwiera plik, osobnej podstrony nie ma. Wejście na adres `/czytelnia/…` przerzuca wtedy od razu na PDF.

**Format** decyduje też o tym, pod którym rodzajem tekst pojawia się na spisie. Na stronie nazwy rodzajów są po polsku, a w panelu lista jest po angielsku: Articles, Books, Scripts, Multimedia.

### Pola dokumentu

- **Categories**: etykiety z listy dokumentów **Category**. To nie jest opis metod ze strony Baza wiedzy ani drugi spis.
- **Authors**: wpisane nazwiska. Nie są odnośnikami do dokumentów osób.
- **File (PDF)**: tu wgrywa się plik do pobrania.
- **Listed in Czytelnia**: włącza tekst do spisu na `/baza-wiedzy`. **Nowy dokument ma to pole domyślnie wyłączone.** Dopóki go nie zaznaczysz, tekst nie pokaże się na spisie. Odznaczenie chowa istniejący tekst ze spisu. Pole nie decyduje o tym, dokąd prowadzi wiersz: o tym mówi tabela wyżej.

<!-- screen: czytelnia-listed | Pole Listed in Czytelnia odznaczone | Widać, że da się schować tekst ze spisu; przełącznik nie wybiera strony ani pliku -->

![Przełącznik Listed in Czytelnia](img/czytelnia-listed.png)

### Okładka na spisie

Okładka kółka na spisie to **pierwszy obrazek w treści** (**Body**). Osobnego pola okładki nie ma. Środkiem kółka jest hotspot tego obrazka. Bez obrazka kółko jest piaskowe. Wstaw obrazek na początku tekstu, przed akapitami.

<!-- screen: czytelnia-okladka | Początek Body w Publication: obrazek jako pierwszy blok, z uzupełnionym alt i zaznaczonym hotspotem | Widać, że okładka spisu to pierwszy obrazek w tekście, nie osobne pole -->

### Przyciski rodzaju i sekcje kategorii

Wynikają z pól **Format** i **Categories**. Nie ma osobnego ekranu do układania Czytelni. Podstrona `/czytelnia` już nie istnieje: przekierowuje na Bazę wiedzy, a spis stoi pod jej tekstem. Dokument listingu **Czytelnia** (hero) nie jest już pokazywany.

Żeby z Bazy wiedzy albo innego tekstu otworzyć jedną metodę, wstaw przycisk **Button**: cel **Dokument**, listing **Czytelnia**, a w **Zaawansowane** → **Parametry** wpisz `kategoria=…` (na przykład `kategoria=teatr-forum`). Tabela wartości: [Tekst](tekst.md#zaawansowane-kotwica-i-parametry). Bez parametru wszystkie sekcje na spisie są otwarte. Nagłówek każdej sekcji zwija ją i rozwija.

## O fundacji

Dokument **O fundacji**, adres `/fundacja`. Zakładki: Hero, Metody i wartości, Zespół, Historia, Dokumenty. Pusta lista w zakładce chowa cały blok. Hero wypełnia się tak jak wszędzie: [Strony](strony.md#hero).

<!-- screen: fundacja-grupy | Zakładki dokumentu O fundacji: Hero, Metody i wartości, Zespół, Historia, Dokumenty | Widać, że jedna strona jest podzielona na te pięć grup -->

![Zakładki dokumentu O fundacji](img/fundacja-grupy.png)

### Metody i wartości

Kręgi z krótką nazwą. Pusta lista oznacza brak kręgów. Na telefonie kręgi stoją w jednym przewijanym rzędzie.

### Zespół

- **Nagłówek** sekcji.
- **Osoby na tej stronie**: wybrane dokumenty **Person**, w wybranej kolejności. Nie podstawiamy automatycznie wszystkich osób.
- **Tekst pod zdjęciami**: opis zespołu, społeczności, cytaty. Role w tekście układa się listą **Roles** albo blokiem **Wykaz twórców** ([Tekst](tekst.md)). Nagłówki H2 w tym polu wyglądają na stronie jak tytuł sekcji.

Sekcja znika tylko wtedy, gdy puste są i osoby, i tekst. Osobna strona `/zespol` to listing wszystkich osób i nie zastępuje tej sekcji.

### Historia

- **Nagłówek** i **Tekst nad osią**: zwykły tekst sformatowany nad osią czasu. Pusty tekst zostawia samą oś.
- **Wpis na osi czasu**: każdy wiersz ma **Rok / znacznik** (napis w kółku, na przykład ‘11 albo 2011), **Tytuł** i **Opis**. Rok i tytuł są wymagane. **Opis** to zwykły tekst bez paska formatowania, a pusty opis zostawia sam rok i tytuł. Pusta lista wpisów chowa całą oś. Nie wklejaj przykładowych lat z makiety.
- **Kolejność wpisów** jest kolejnością na stronie. Rok nie sortuje się sam, więc wiersz przeciągnij na właściwe miejsce. Nowy wpis dodajesz przyciskiem **Add item**.
- **Układ osi**: **Pionowy** (lata jedno pod drugim) albo **Poziomy** (na dużym ekranie oś przesuwa się w bok razem z przewijaniem strony). Na telefonie i przy włączonym w systemie „mniej animacji” oś jest zawsze pionowa. Puste pole oznacza pion.

Na stronie opisy są domyślnie zwinięte i otwierają się same podczas przewijania, najpierw te najbliżej środka ekranu. Nad osią jest przycisk „rozwiń całość”, który otwiera wszystkie opisy naraz, do zwykłego czytania.

<!-- screen: fundacja-historia | Grupa Historia: przełącznik Układ osi ustawiony na Pionowy i jeden wpis z rokiem, tytułem i opisem | Widać, że rok to tekst w kółku, a układ osi wybiera się w tej grupie -->

### Dokumenty

Każdy wiersz to tytuł plus strona z panelu, plik PDF albo adres. Pusta lista oznacza brak sekcji.

<!-- screen: fundacja-dokumenty | Jeden wiersz dokumentów z tytułem i podpiętym PDF | Widać, że dokument może być plikiem, a nie tylko linkiem do strony -->

## Kontakt

**Kontakt** to zwykła strona (**Page**). Nie ma formularza. Adresy mailowe na tej stronie biorą się z pól e-mail przy osobach.
