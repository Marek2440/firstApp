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
