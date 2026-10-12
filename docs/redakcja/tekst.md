# Tekst

Zwykły akapit, nagłówek, cytat, lista i pogrubienie działają jak w edytorze Sanity. Praca z paskiem: [Content operations cheatsheet](https://www.sanity.io/docs/user-guides/content-operations-cheatsheet).

<!-- screen: tekst-toolbar | Pasek edytora z listą stylów, w tym Termin, oraz list Bullet, Numbered, Indent, Roles | Widać, które pozycje są nasze, a które są zwykłym tekstem -->

Poniżej są tylko dodatki zrobione dla tej strony. Część z nich to **style i listy** na pasku edytora (Termin, Indent, Roles). Reszta to **bloki**, czyli osobne elementy wstawiane plusem między akapitami (Columns, Button, Wykaz twórców, YouTube).

## Termin

Styl **Termin** to hasło w tekście (wyróżniona plama i zwykły krój tekstu). To nie jest cytat. Cytat zostaje stylem **Quote**.

Zaznacz akapit i wybierz Termin. Pogrubienie można dołożyć, ale nie jest wymagane.

<!-- screen: tekst-termin | Akapit oznaczony stylem Termin w edytorze | Widać, że Termin jest stylem akapitu, nie osobnym dokumentem -->

## Wcięcie

Lista **Indent** robi głębsze wcięcie. W edytorze Tab schodzi poziom niżej, tak jak przy zwykłej liście zagnieżdżonej.

<!-- screen: tekst-indent | Lista Indent z dwoma poziomami | Widać, że wcięcie jest rodzajem listy, nie spacjami na początku zdania -->

## Roles

Lista **Roles** jest do wierszy „rola: imiona”, na przykład w składzie zespołu na stronie O fundacji. Każdy punkt to jedna rola, dwukropek oddziela rolę od nazwisk.

Nie zamieniamy na Roles zwykłego zdania, w którym przypadkiem jest dwukropek. Styl trzeba wybrać w pasku.

Roles jest na krótki skład w jednym miejscu. Dłuższe zestawienia twórców, z grupami, dopiskami i obsadą, układa się blokiem [Wykaz twórców](#wykaz-twórców).

<!-- screen: tekst-roles | Lista Roles z wierszem „komunikacja: imię i nazwisko” | Widać dwukropek w treści i styl Roles na pasku -->

![Pasek edytora i wiersze ról na stronie O fundacji](img/tekst-roles.png)

## Kolumny

Obiekt **Columns** to dwie albo trzy kolumny obok siebie. Na wąskim ekranie układają się jedna pod drugą. W kolumnie może być tekst, zdjęcie, film YouTube i przycisk. Nie wkładamy kolumn w kolumny. Na liście bloków widać początek treści każdej kolumny — zdjęcie i film nie wyglądają jak pusta kolumna.

<!-- screen: tekst-columns | Blok Columns ustawiony na dwie kolumny, w każdej krótki akapit | Widać wybór 2 albo 3 i brak trzeciego zagnieżdżenia -->

## Button

Obiekt **Button** to zielony przycisk z rulką i kropką, taki jak „więcej” na kartach. Stoi w osobnym wierszu. Nie da się go wstawić w środek zdania — do słów w akapicie służy zwykły link z paska (ikona łańcucha).

### Jak dodać

1. W treści ustaw kursor w pustym wierszu (albo pod akapitem).
2. Naciśnij **+** przy bloku i wybierz **Button**. Nie szukaj tego na pasku stylów (Termin, Quote, listy).
3. Wpisz **Etykietę**. To tekst widoczny na przycisku. Puste pole nie wstawi samo słowa „więcej”. Bez etykiety Studio nie pozwoli opublikować dokumentu.
4. W polu **Cel** zostaw **Dokument** albo przełącz na **Plik** lub **Adres**.
5. Uzupełnij pole, które się pokaże:
   - **Dokument** — wybierz istniejącą treść (strona, news, projekt, publikacja, osoba, listing Projekty / Czytelnia / Zespół, O fundacji). Adres złoży się sam.
   - **Plik** — PDF albo inne medium. Wgrywa się je w tym polu, nie z zakładki Media. Otwiera się w nowej karcie.
   - **Adres** — ścieżka od ukośnika (`/projekty`) albo `https://`. Kotwicy i parametrów tu nie wpisuj.
6. **Wcięcie** zostaw na „Bez wcięcia”. Wybierz **1 stopień**, gdy akapit obok jest raz wcięty listą Indent — tak stoją hasła Termin na Bazie wiedzy. **2** i **3** to kolejne poziomy tej samej listy. Sam styl Termin wcięcia nie dodaje.
7. Jeśli trzeba dotrzeć do konkretnego miejsca na stronie (kotwica) albo otworzyć Czytelnię na jednej metodzie (parametry), rozwiń **Zaawansowane** — niżej.
8. **Publish**.

Button można też wstawić wewnątrz bloku **Columns**. Wewnątrz samego Buttona nie da się wstawić żadnych innych bloków.

<!-- screen: tekst-button | Blok Button z etykietą, celem Dokument i zwiniętym Zaawansowane | Widać, że przycisk jest osobnym blokiem, nie zaznaczeniem w zdaniu -->

### Zaawansowane: kotwica i parametry

Grupa **Zaawansowane** jest zwinięta. Otwórz ją tylko wtedy, gdy sam dokument albo sam adres nie wystarcza.

| Pole | Co wpisać | Przykład | Po co |
|------|-----------|----------|--------|
| **Kotwica** | Identyfikator sekcji, z `#` albo bez | `edycje` albo `#edycje` | Na stronie projektu przewinie do listy edycji |
| **Parametry** | Część po `?`, z pytajnikiem albo bez | `kategoria=teatr-forum` | Na listingu Czytelni otworzy jedną kategorię i zwinie pozostałe |

Można wypełnić oba pola naraz. Doklejają się do wybranego dokumentu, pliku albo adresu. **Nie** dopisuj `?…` ani `#…` drugi raz w polu Adres.

Czego nie wklejać: spacji, `#` w polu Parametry, `?` w polu Kotwica.

**Czytelnia z Bazą wiedzy.** Cel = **Dokument**, listing **Czytelnia**. W Parametrach jedna kategoria (slug z dokumentów Category):

| Metoda | Parametry |
|--------|-----------|
| Drama | `kategoria=drama` |
| Teatr Forum (TF) | `kategoria=teatr-forum` |
| Teatr w edukacji (TIE) | `kategoria=teatr-w-edukacji` |
| Teatr ze społecznością (TzS) | `kategoria=teatr-ze-spolecznoscia` |
| Teatr zaangażowany społecznie | `kategoria=teatr-zaangazowany-spolecznie` |
| Metody twórcze | `kategoria=metody-tworcze` |

Szuflada formatu (artykuły, książki, scenariusze, multimedia) to drugi parametr, na przykład `rodzaj=books`. Oba naraz zapisuje się `rodzaj=books&kategoria=…`, ale kategoria musi mieć publikacje w tej szufladzie. Sześć metod z tabeli wisi przy artykułach, więc sam `kategoria=…` wystarcza i pozostałe sekcje się zwijają. Bez parametru `kategoria` wszystkie sekcje na `/czytelnia` są otwarte. Na samym spisie nagłówek zwija albo rozwija tylko swoją sekcję.

Więcej o polach publikacji: [Czytelnia i O fundacji](czytelnia-i-fundacja.md).

## Wykaz twórców

**Wykaz twórców** to blok na listę osób, które stoją za projektem, edycją albo tekstem: kto za co odpowiadał. Na stronie wygląda jak tabela o dwóch kolumnach. Po lewej jest rola, po prawej nazwiska, a między wierszami biegną cienkie linie. Wykaz nie jest cytatem ani zwykłą listą z punktorami. Jeśli ktoś potrzebuje tylko jednej linijki „rola: nazwisko”, wystarczy lista **Roles** (wyżej). Wykaz jest na dłuższe zestawienia: z podziałem na grupy, z dopiskami przy rolach, z obsadą i z notką o finansowaniu.

### Gdzie można go wstawić

Wykaz jest częścią edytora tekstu, więc da się go dodać wszędzie tam, gdzie jest pole tekstu sformatowanego.

| Dokument i pole | Do czego się przydaje |
|-----------------|------------------------|
| **Project** → **Editions** → wybrana edycja → **Body** | Najczęstszy przypadek: wykaz twórców jednej edycji (na przykład Art Generacje). Edycja z dwoma spektaklami może mieć dwa wykazy |
| **Project** → **Body** | Twórcy całego projektu |
| **Project** → **Credits / afterword** | Autorzy i podziękowania na końcu projektu. Na stronie ta część jest rozwijana i domyślnie zamknięta |
| **Page**, **News**, **Publication** → **Body** | Wykaz w zwykłej stronie, aktualności albo tekście Czytelni (na przykład obsada spektaklu opisanego w artykule) |
| **Person** → **Bio** | Możliwe, ale rzadko potrzebne |
| **O fundacji** → **Zespół** → **Tekst pod zdjęciami** oraz **Historia** → **Tekst nad osią** | Możliwe. Skład zespołu jest tu na ogół opisany listą **Roles**, i to wystarcza |

Wykaz **nie wchodzi do bloku Columns**. Jeśli chcesz mieć go obok tekstu, ustaw go pod kolumnami.

### Z czego jest zbudowany

Wykaz składa się z czterech poziomów. Tylko dwa środkowe są obowiązkowe.

1. **Nagłówek** wykazu (opcjonalny), na przykład „Twórcy”.
2. **Grupy**: co najmniej jedna. Grupa ma własny krótki nagłówek, na przykład „Autorstwo” albo „Obsada”.
3. **Wiersze** w grupie: co najmniej jeden. Wiersz jest jednego z dwóch rodzajów:
   - **Rola**: rola po lewej, osoby po prawej. Opcjonalny **Dopisek** stoi drobnym drukiem pod rolą.
   - **Lista bez ról**: same nazwiska, bez roli. Dobra na obsadę. Nazwiska idą jedno za drugim, rozdzielone kropką środkową, i zawijają się jak zwykły tekst.
4. **Notka końcowa** (opcjonalna) pod wszystkimi wierszami, na przykład informacja o współfinansowaniu. To zwykły tekst, nie rola.

### Jak dodać

1. Otwórz dokument i ustaw kursor w pustym wierszu tekstu, między akapitami.
2. Naciśnij **+** przy bloku i wybierz **Wykaz twórców**. Nie szukaj go na pasku stylów.
3. Otwórz wstawiony blok. W polu **Nagłówek** wpisz tytuł wykazu albo zostaw puste. Przy edycji z dwoma spektaklami wpisz tytuł spektaklu, żeby czytelnik odróżnił wykazy.
4. W polu **Grupy** naciśnij **Add item**. W **Nagłówku grupy** wpisz na przykład „Autorstwo”, „Obsada”, „Realizacja artystyczna”, „Produkcja” albo „Partnerzy”. Przy krótkim wykazie nagłówek grupy można pominąć. Wiersze pójdą wtedy bez podpisu grupy.
5. W grupie, w polu **Wiersze**, naciśnij **Add item** i wybierz rodzaj wiersza:
   - **Rola**: wpisz **Rolę** (krótko, na przykład „reżyseria”) i **Osoby**. Dłuższe doprecyzowanie wpisz w **Dopisku**, nie w roli.
   - **Lista bez ról**: wpisz **Osoby**. Pole **Etykieta** możesz zostawić puste albo wpisać w nim „obsada”.
6. **Osoby** wpisuje się po przecinku albo każdą w nowej linii. Mogą to być też instytucje.
7. Powtórz kroki 4–6 dla kolejnych grup i wierszy. Kolejność ustawiasz, przeciągając grupy i wiersze. Strona zachowa dokładnie tę kolejność z formularza.
8. Jeśli trzeba, wpisz **Notkę końcową**.
9. **Publish**.

<!-- screen: tekst-credits | Otwarty blok Wykaz twórców z jedną grupą, wierszem Rola i wierszem Lista bez ról | Widać cztery poziomy: nagłówek, grupy, wiersze, notka końcowa -->

### Przykład

Tak wypełniony wykaz:

| Pole | Wartość |
|------|---------|
| **Nagłówek** | Twórcy |
| Grupa **Autorstwo** → **Rola** | reżyseria → Adam Gąsecki |
| Grupa **Autorstwo** → **Rola** | muzyka i oprawa dźwiękowa, z dopiskiem „w tym autorstwo utworu «Gadatliwość drzew»” → Anna Jędrzejewska |
| Grupa **Obsada** → **Lista bez ról** | etykieta „obsada” → Alina, Aneta, Anna |
| **Notka końcowa** | Projekt współfinansowany przez m.st. Warszawa. |

pokaże się na stronie jako nagłówek „Twórcy”, dwie grupy z cienką linią pod nazwą grupy, w pierwszej dwa wiersze „rola → nazwisko”, w drugiej jedna linia z imionami rozdzielonymi kropkami, a pod całością szara notka.

<!-- screen: tekst-credits-strona | Ten sam wykaz na stronie edycji | Widać tabelę rola i nazwiska, linię pod nagłówkiem grupy i notkę na końcu -->

### Co warto wiedzieć

- **Wymagane pola.** Rola i Osoby w wierszu Rola oraz Osoby w wierszu Lista bez ról. Do tego co najmniej jedna grupa i co najmniej jeden wiersz w każdej grupie. Bez tego Studio nie pozwoli opublikować dokumentu.
- **Pusta reszta znika.** Pusty nagłówek, pusty dopisek, pusta etykieta i pusta notka nie zostawiają na stronie śladu.
- **Przecinek dzieli nazwiska.** „Teatr Powszechny, Warszawa” da dwie osobne pozycje. Jeśli nazwa instytucji zawiera przecinek, zastąp go myślnikiem albo wpisz samą nazwę.
- **Nazwiska to zwykły tekst.** Nie łączą się z dokumentami Person i nie da się w nich ustawić linku.
- **Roles nie zamienia się w wykaz.** To dwa różne bloki. Jeśli chcesz przejść z jednego na drugi, wpisz dane od nowa.
- **Szerokość.** Na szerokim ekranie wykaz może być szerszy niż akapity wokół. To zamierzone, bo dwie kolumny w wąskim paśmie tekstu czytałyby się źle.
- **Wykazy już na stronie.** Wykazy dawnych edycji (Art Generacje, Teatr Codzienny, To mi gra, Wielogłos) zostały przeniesione do tego bloku z tekstu. Edytuje się je tak jak każdy nowy: znajdź blok w tekście i otwórz go.

## Film

Obiekt **YouTube** przyjmuje adres filmu z YouTube. Działa w zwykłym tekście i w kolumnie. Na stronie widać klatkę filmu i przycisk play; odtwarzacz włącza się po kliknięciu. Inne serwisy wideo zostają zwykłym linkiem w tekście, nie odtwarzaczem.
