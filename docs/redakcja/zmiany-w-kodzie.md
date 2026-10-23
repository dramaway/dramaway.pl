# Zmiany w kodzie strony (z pomocą Copilota)

Ta instrukcja jest dla zmian, których nie da się zrobić w Studio: wygląd, układ, odstępy, działanie elementów. Nie trzeba umieć programować. Kod pisze Copilot (asystent AI na GitHubie), a Ty opisujesz zmianę i sprawdzasz efekt.

## Najpierw: Studio czy kod?

| Chcę zmienić… | Gdzie |
|--|--|
| tekst, zdjęcie, podpis, link | Studio, patrz [Podstawy Studia](studio-podstawy.md) |
| menu, kolejność stron | Studio, patrz [Menu](menu.md) |
| aktualność, projekt, osobę w zespole, publikację | Studio, patrz [Typowe zadania](zadania.md) |
| kolor, odstęp, wielkość czcionki, układ sekcji | **kod** (ta instrukcja) |
| element, który działa źle (np. przycisk, slider) | **kod** (ta instrukcja) |
| nowe pole w Studio | **kod**, ale ostrożnie (niżej) |

Jeśli nie wiesz, zacznij od Studio. Większość zmian to treść.

## Co trzeba mieć

- Konto GitHub z dostępem do repozytorium `dramaway/dramaway.pl`. Zaproszenie wysyła konto `dramaway` (Settings → Collaborators).
- Płatny plan **GitHub Copilot** (Pro lub wyższy) na tym koncie. Bez niego nie da się przypisać zgłoszenia do Copilota.
- Hasła do kont Fundacji (GitHub, Netlify, Sanity) są w Bitwardenie Fundacji.

## Krok po kroku

1. **Zgłoszenie.** Na https://github.com/dramaway/dramaway.pl/issues kliknij *New issue* → **Zmiana na stronie**. Wypełnij formularz. Jedno zgłoszenie = jedna zmiana. Pięć poprawek to pięć zgłoszeń.
2. **Przypisz do Copilota.** Po prawej *Assignees* → **Copilot**. Copilot odpowie i po kilku–kilkunastu minutach otworzy **pull request** (PR): propozycję zmiany w kodzie.
3. **Podgląd.** W PR-ze, w komentarzach, pojawi się bot Netlify z linkiem **Deploy Preview**. To kopia strony z tą zmianą, pod osobnym adresem. Prawdziwa strona się nie zmienia. Otwórz podgląd na komputerze i na telefonie.
4. **Poprawki.** Jeśli coś jest nie tak, napisz w PR-ze komentarz zaczynający się od `@copilot`, np. `@copilot odstęp jest za duży, zmniejsz o połowę`. Copilot poprawi, a podgląd się odświeży.
5. **Testy.** Pod PR-em może pojawić się przycisk **Approve and run workflows**. Kliknij go. Uruchamia automatyczne sprawdzenie kodu. Gdy wszystko jest zielone (✓), jest dobrze. Czerwony krzyżyk (✗) oznacza błąd: napisz `@copilot testy nie przechodzą, napraw`.
6. **Publikacja.** Gdy podgląd wygląda dobrze, a testy są zielone: *Ready for review* (jeśli PR jest szkicem), potem **Merge pull request**. Po kilku minutach zmiana jest na prawdziwej stronie.

## Jak cofnąć zmianę

Coś się zepsuło po publikacji?

1. **Szybko:** w Netlify (konto Fundacji) → projekt → **Deploys** → kliknij poprzednią wersję → **Publish deploy**. Strona wraca do stanu sprzed zmiany w minutę.
2. **Na stałe:** na GitHubie otwórz zmergowany PR i kliknij **Revert**. Powstanie nowy PR, który cofa zmianę. Zmerguj go. Bez tego kroku następna publikacja przywróci błąd.

## Czego nie robić

- Nie łącz PR-a, którego podglądu nie obejrzałaś/obejrzałeś.
- Nie proś Copilota o zmianę tekstu, który jest w Studio. Zmieni go w kodzie na stałe i Studio przestanie nad nim panować.
- Nie wklejaj nigdzie haseł ani tokenów, ani w zgłoszeniach, ani w komentarzach.
- Ostrożnie z polami w Studio. Dodanie pola jest bezpieczne. Zmiana nazwy albo usunięcie pola chowa treść, która już w nim jest. Studio aktualizuje się samo po publikacji zmiany.

## Koszty i limity

- Copilot: miesięczna opłata za plan na koncie osoby, która go używa.
- Netlify, plan darmowy: każde zgłoszenie i każda poprawka to nowy podgląd, a podglądy zużywają miesięczny limit. Kilka zmian w miesiącu się mieści. Zużycie widać w Netlify → Team → **Usage**.

## Dla ciekawych

Zasady, którymi kieruje się Copilot, są w pliku `AGENTS.md`. Opis wyglądu strony (kolory, odstępy, typografia) jest w `docs/design/system.md`.
