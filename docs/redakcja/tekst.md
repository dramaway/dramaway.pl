# Tekst

Zwykły akapit, nagłówek, cytat, lista i pogrubienie działają jak w edytorze Sanity. Praca z paskiem: [Content operations cheatsheet](https://www.sanity.io/docs/user-guides/content-operations-cheatsheet).

<!-- screen: tekst-toolbar | Pasek edytora z listą stylów, w tym Termin, oraz list Bullet, Numbered, Indent, Roles | Widać, które pozycje są nasze, a które są zwykłym tekstem -->

Poniżej są tylko dodatki zrobione dla tej strony.

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

Button można też wstawić wewnątrz bloku **Columns**. Nie da się włożyć Buttona w Button: to nie jest pole tekstowe.

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

## Film

Obiekt **YouTube** przyjmuje adres filmu z YouTube. Działa w zwykłym tekście i w kolumnie. Na stronie widać klatkę filmu i przycisk play; odtwarzacz włącza się po kliknięciu. Inne serwisy wideo zostają zwykłym linkiem w tekście, nie odtwarzaczem.
