# Role Sanity (przekazanie)

Billing i plan siedzą w **organizacji** (`sanity.io/manage` → Organization). Rola **Administrator** w Members **projektu** to nie faktura — to tokeny, CORS, datasety i usuwanie ludzi.

Źródło ról: [Sanity roles](https://www.sanity.io/docs/content-lake/roles-concepts).

## Ustalenia (2026-09-07)

| Kto | Rola | Po co |
|-----|------|--------|
| Jan | project **Administrator** (na razie) | utrzymanie, tokeny, zaproszenia; później ewentualnie **Developer** |
| Druga osoba od kodu (gdy będzie) | **Developer** | infrastruktura bez usuwania członków |
| `admin@dramaway.pl` | project **Administrator** | świadomy backup pełnego zarządzania po stronie klienta; **nie** do codziennej edycji |
| Redakcja | **Editor** | treści; bez tokenów i ustawień projektu |
| Klient (billing) | administrator **organizacji** | faktura i dane rozliczeniowe — przy migracji serwisu, nie teraz |

Nie dawać redakcji project Admin: mogą utworzyć token z zapisem i zepsuć dataset.

## Inne wbudowane role — kiedy

- **Contributor** — ktoś pisze szkice, ktoś z Editor publikuje. Na start nie.
- **Viewer** — podgląd / komentarz bez edycji; nie zajmuje płatnego miejsca.
- **Blueprints editor** — deploy infrastruktury z CLI (Blueprints), nie CMS. Na start nie.

Custom role (np. tylko Czytelnia) wymagają Enterprise. Chowanie typów w Structure to tylko UI.

## Snapshot przed edycją klienta

Przed startem redakcji (2026-09-07): `sanity datasets export production` → `private/sanity-snapshots/production-2026-09-07-pre-client.tar.gz` (poza gitem). Kopia datasetu w chmurze (`datasets copy`) **nie jest na planie**. Przywracanie: `sanity datasets import <plik.tar.gz> production --replace` (ostrożnie — nadpisuje live). Kod: tag git `snapshot-2026-09-07-pre-client` na `main`.
