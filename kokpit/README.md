# Kokpit

Własny serwer + strona z cegiełkami. Nie wymaga claude.ai. Bez zależności (Node 18+).

## Uruchomienie
    cp .env.example .env     # uzupełnij klucze Google (niżej)
    node server.js           # http://localhost:3000

Bez kluczy działa w trybie DEMO (przykładowe dane).

## Podłączenie Gmaila (tylko odczyt, jednorazowo)
1. console.cloud.google.com -> nowy projekt -> APIs & Services -> włącz **Gmail API**.
2. OAuth consent screen: typ External, dodaj siebie jako Test user, scope `gmail.readonly`.
3. Credentials -> Create OAuth client ID -> Web application.
   Redirect URI: `http://localhost:3000/auth/callback`.
4. Wpisz `GOOGLE_CLIENT_ID` i `GOOGLE_CLIENT_SECRET` do `.env`, uruchom serwer.
5. Kliknij "Połącz Gmail" w prawym górnym rogu. Token trafia do `.data/` (ignorowany przez git).

## Podłączenie Notion (tylko odczyt)
1. notion.so/profile/integrations -> nowa integracja (Internal), capability: Read content.
2. Skopiuj token do `.env` jako `NOTION_TOKEN`.
3. Na stronie Tasks Tracker: menu ... -> Connections -> dodaj tę integrację.
4. Cegiełki `Notion: po terminie` i `Notion: najbliższe 7 dni` czytają właściwości `Task name`, `Status`, `Priority`, `Due date`.

## Dodawanie cegiełek
Cegiełka to obiekt `{ id, title, type, refreshMs, load() }` w `bricks/`.
Kolejną skrzynkę Gmaila dodasz jedną linijką w `bricks/gmail.js` (zapytanie w składni Gmaila).
Nowe źródło (Notion, kalendarz) = nowy plik w `sources/` i nowy plik w `bricks/`, zarejestrowany w `bricks/index.js`.

## Ustawienia
`GET /api/settings` zwraca `{ refreshDefaultMs, bricks:{ id:{ enabled, expanded, refresh } } }` dla każdej cegiełki
(domyślnie `enabled:true, expanded:false, refresh:'default'`, `refreshDefaultMs:120000`).
`PUT /api/settings` przyjmuje częściowy body (merge) z walidacją (400 z komunikatem po polsku).
`refresh`: `default` = `refreshDefaultMs`, `auto` = `refreshMs` cegiełki, `manual` = bez timera.
Zapis atomowy do `.data/settings.json` (cały dostęp przez `sources/store.js`). Body JSON max 100 KB (413), zły JSON = 400.

## Szkice
`POST /api/drafts` `{ brickId, itemId, text, action:'reply'|'add-to-notion'|'move', subject? }` -> 201;
`GET /api/drafts[?brickId=&itemId=]`; `DELETE /api/drafts/:id`. Nieznane `brickId` -> 404, text max 5000 znaków, limit 500 szkiców (409).
**Zasada: nic nie jest wysyłane.** Szkic leży tylko w `.data/drafts.json` (`sent:false`); serwer nie łączy się z żadnym źródłem w tej sprawie.

## Cegiełki demo i pola via/notion/detail
`GET /api/bricks` zwraca `via` (`dyrygent`|`cli`|`konto`) i `demo`. Cegiełki Outlook, Teams, Mantis i Czaty AI są zawsze demo.
Pozycja może mieć: `notion` (URL lub null), `detail:{ history:[{title,date,url}], caseHistory }`, opcjonalnie `via`.
