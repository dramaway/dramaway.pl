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

Obiekt **Button** to zielony przycisk z rulką i kropką, taki jak „więcej” na kartach. Stoi w osobnym wierszu. Domyślnie jest dosunięty do lewej. Pole **Wcięcie** przesuwa go o ten sam skok co lista Indent: 1, 2 albo 3 stopnie. Jeden stopień zrównuje przycisk z akapitem wciętym raz, na przykład pod hasłem Termin. Nie da się go wstawić w środek zdania.

W polu **Cel** wybierz:

- **Dokument** — inna treść z panelu (strona, news, projekt, publikacja, osoba, listing, O fundacji),
- **Plik** — PDF albo inne medium; otwiera się w nowej karcie,
- **Adres** — ścieżka od `/` albo link `https://`.

Etykieta jest obowiązkowa. Puste pole nie wymyśla tekstu „więcej”.

Gdy strona ma kotwicę albo adres ma parametry, otwórz zwinięte **Zaawansowane**. Kotwica to `#edycje` (sam `edycje` też działa). Parametry to `?rodzaj=books`. Można podać oba. Doklejają się do dokumentu, pliku albo adresu — nie wpisuj ich drugi raz w polu adresu.

<!-- screen: tekst-button | Blok Button z etykietą, celem Dokument i zwiniętym Zaawansowane | Widać, że przycisk jest osobnym blokiem, nie zaznaczeniem w zdaniu -->

## Film

Obiekt **YouTube** przyjmuje adres filmu z YouTube. Inne serwisy wideo zostają zwykłym linkiem w tekście, nie odtwarzaczem.
