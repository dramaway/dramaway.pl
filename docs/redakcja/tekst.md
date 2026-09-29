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

Obiekt **Columns** to dwie albo trzy kolumny obok siebie. Na wąskim ekranie układają się jedna pod drugą. W kolumnie może być tekst, zdjęcie i przycisk. Nie wkładamy kolumn w kolumny ani filmu.

<!-- screen: tekst-columns | Blok Columns ustawiony na dwie kolumny, w każdej krótki akapit | Widać wybór 2 albo 3 i brak trzeciego zagnieżdżenia -->

## Button

Obiekt **Button** to zielony przycisk z rulką i kropką, taki jak „więcej” na kartach. Stoi w osobnym wierszu. Nie da się go wstawić w środek zdania — do słów w akapicie służy zwykły link z paska (ikona łańcucha).

### Jak dodać

1. W treści ustaw kursor w pustym wierszu (albo pod akapitem).
2. Naciśnij **+** przy bloku i wybierz **Button**. Nie szukaj tego na pasku stylów (Termin, Quote, listy).
3. Wpisz **Etykietę**. To jedyny tekst na przycisku. Puste pole nie wymyśla słowa „więcej” i Studio nie puści publikacji.
4. W **Celu** zostaw **Dokument**, albo przełącz na **Plik** albo **Adres**.
5. Uzupełnij pole, które się pokaże:
   - **Dokument** — wybierz istniejącą treść (strona, news, projekt, publikacja, osoba, listing Projekty / Czytelnia / Zespół, O fundacji). Adres złoży się sam.
   - **Plik** — PDF albo inne medium; otwiera się w nowej karcie.
   - **Adres** — ścieżka od ukośnika (`/projekty`) albo `https://`. Kotwicy i parametrów tu nie wpisuj.
6. **Wcięcie** zostaw na „Bez wcięcia”, chyba że przycisk ma stanąć w tej samej kolumnie co lista Indent albo hasło Termin. Skok 1, 2 albo 3 jest ten sam co przy Indent.
7. Jeśli trzeba dotrzeć do konkretnego miejsca na stronie (kotwica) albo otworzyć Czytelnię na jednej metodzie (parametry), rozwiń **Zaawansowane** — niżej.
8. **Publish**.

Button można też wstawić wewnątrz bloku **Columns**. Nie wkładamy Buttona w Button.

<!-- screen: tekst-button | Blok Button z etykietą, celem Dokument i zwiniętym Zaawansowane | Widać, że przycisk jest osobnym blokiem, nie zaznaczeniem w zdaniu -->

### Zaawansowane: kotwica i parametry

Grupa **Zaawansowane** jest zwinięta. Otwórz ją tylko wtedy, gdy sam dokument albo sam adres nie wystarcza.

| Pole | Co wpisać | Przykład | Po co |
|------|-----------|----------|--------|
| **Kotwica** | Identyfikator sekcji, z `#` albo bez | `edycje` albo `#edycje` | Na stronie projektu zjedzie do listy edycji |
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

Szuflada formatu (artykuły, książki, scenariusze, multimedia) to drugi parametr, na przykład `rodzaj=books` albo razem `rodzaj=scripts&kategoria=teatr-w-edukacji`. Bez parametru `kategoria` wszystkie sekcje na `/czytelnia` są otwarte. Kliknięcie nagłówka sekcji na samym spisie też zmienia ten adres.

Więcej o polach publikacji: [Czytelnia i O fundacji](czytelnia-i-fundacja.md).

## Film

Obiekt **YouTube** przyjmuje adres filmu z YouTube. Inne serwisy wideo zostają zwykłym linkiem w tekście, nie odtwarzaczem.
