# Role Sanity (przekazanie)

Billing i plan siedzą w **organizacji** (`sanity.io/manage` → Organization). Rola **Administrator** w Members **projektu** to nie faktura — to tokeny, CORS, datasety i usuwanie ludzi.

Źródło ról: [Sanity roles](https://www.sanity.io/docs/content-lake/roles-concepts).

## Role po przekazaniu (2026-10-23)

| Kto | Rola | Po co |
|-----|------|--------|
| `admin@dramaway.pl` | właściciel **organizacji** + project **Administrator** | plan NGO, tokeny, CORS, webhooki, zaproszenia; **nie** do codziennej edycji |
| Osoba od kodu / zlecony wykonawca (gdy potrzebny) | **Developer** | infrastruktura bez usuwania członków; usunąć po zakończeniu zlecenia |
| Redakcja | **Editor** | treści; bez tokenów i ustawień projektu |

Nie dawać redakcji project Admin: mogą utworzyć token z zapisem i zepsuć dataset.

## Inne wbudowane role — kiedy

- **Contributor** — ktoś pisze szkice, ktoś z Editor publikuje. Na start nie.
- **Viewer** — podgląd / komentarz bez edycji; nie zajmuje płatnego miejsca.
- **Blueprints editor** — deploy infrastruktury z CLI (Blueprints), nie CMS. Na start nie.

Custom role (np. tylko Czytelnia) wymagają Enterprise. Chowanie typów w Structure to tylko UI.

## Kopia treści

Eksport: `sanity datasets export production` (plik `.tar.gz`, trzymać na dysku Fundacji, nie w repo). Kopia datasetu w chmurze (`datasets copy`) **nie jest na planie**. Przywracanie: `sanity datasets import <plik.tar.gz> production --replace` (ostrożnie — nadpisuje live). Kod: tag git `snapshot-2026-09-07-pre-client` na `main`.
