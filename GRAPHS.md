# Grafy agentów (graph engineering): kontekst dla Claude Code
Źródło: rozmowa Marka z Claude (aplikacja, 22.10.2026). Marek dopiero poznaje temat.
Odpowiedzi na pytania z sekcji 10: sekcja 11 (sesja Claude Code w chmurze, 22.10.2026).

## 1. Czym to jest
- Zamiast jednego wielkiego promptu ("god prompt") zadanie jest rozpisane jako GRAF.
- WĘZEŁ = jednostka pracy (agent, subagent albo zwykły kod). KRAWĘDŹ = przekazanie wyniku dalej.
- Graf opisuje KSZTAŁT pracy: co przed czym, co może iść równolegle, co czeka na wszystko.
- Liniowy skrypt (krok 1 → 2 → 3) to też graf, tylko zdegenerowany. Pierwsza umiejętność to
  przerysować łańcuch i znaleźć kroki, które wcale od siebie nie zależą ("fałszywe krawędzie").
- Analogia magazynowa: przyjęcie → kilka stanowisk kompletuje równolegle → osobna kontrola
  jakości → wydanie.
- "Rój agentów" = wiele węzłów naraz. Ma sens tylko przy naprawdę niezależnych kawałkach.

## 2. Słownik
| Pojęcie | Znaczenie |
|---|---|
| Fan-out | Rozdzielenie pracy na wielu agentów równolegle |
| Fan-in / bariera | Czekanie, aż wszyscy skończą, i zebranie wyników |
| Diament | Fan-out + fan-in: podstawowa topologia (split → równolegle → merge) |
| Router | Węzeł wybierający ścieżkę. Klasyfikować może model, ale samo przekierowanie to KOD |
| Weryfikator | Osobny agent ze ŚWIEŻYM kontekstem, który sprawdza wynik bez stronniczości |
| Tania bramka | Sprawdzenie w kodzie przed uruchomieniem modelu (czy jest coś nowego?) |
| Harness | Środowisko: narzędzia, pliki, uprawnienia, w których działa agent |
| Loop | Pętla: rób → sprawdź dowody → popraw lub zakończ |
| Graph | Przepływ równoległy między węzłami |
| Kontrakt węzła | Stały format wyjścia (JSON schema), żeby kolejny węzeł mógł go użyć bez człowieka |

## 3. Szablon "Graph Blueprint"
1. CEL: co ma wyjść i po czym poznać, że jest dobrze (kryteria akceptacji)
2. PODZIAŁ: niezależne kawałki
3. FAN-OUT: równolegli workerzy z różnymi rolami (research / porównanie / sprawdzenie / luki),
   każdy z własnym czystym kontekstem
4. WERYFIKATOR: świeży kontekst, sprawdza jakość, łapie błędy i halucynacje
5. SCALENIE: łączy tylko to, co przeszło weryfikację
6. WYNIK: jeden konkretny, wykonalny raport

## 4. Wzorzec kosztowy: pętla z tanimi bramkami
Zasada: wyjąć decyzje pętli z głównego przebiegu modelu.
1. Sprawdzenie kolejki (kod): czy jest coś nowego? Jeśli nie, KONIEC, zero tokenów
2. Filtr / routing (kod lub tani model): typowany wybór ścieżki
3. Progi (kod): czy pewność i dowody wystarczają?
4. Przebieg Claude'a: ograniczony zakres pracy
5. Kontrola zakończenia (hook, test, ocena)
6. Logi: trasy, tokeny, błędy

Claude jest tylko w kroku 4 z 6.

## 5. Zasady
- Model tylko tam, gdzie potrzebny jest osąd. Routing, walidacja i progi jako kod (deterministycznie).
- Węzły zwracają dane strukturalne, nie wolny tekst.
- Główny kontekst trzyma wyniki, nie surowe dane. Każdy subagent ma własny kontekst.
- Weryfikator jest ważniejszy niż liczba workerów.
- Najpierw JEDEN działający przykład, potem uogólnianie.
- Logować koszt (tokeny) każdego przebiegu.

## 6. Antywzorce
- Dwudziestu agentów na ten sam problem: nakładające się raporty, sprzeczne wnioski, duży rachunek.
- Graf, w którym każda krawędź to agent: płacisz modelem za samo przekazywanie danych.
- Agent sprawdzający własną pracę w tym samym kontekście.
- Turniej 100 agentów → 1 zwycięzca: to demo, opłacalne tylko gdy błąd kosztuje więcej niż 100 przebiegów.
- Weryfikacja prośbą w prompcie ("uważaj") zamiast kodem.

## 7. Mechanizmy w Claude Code
- Subagenci: Claude Code sam odpala pomocników, także równolegle. Własne typy w `.claude/agents/*.md`.
- Skills i slash commands: opakowanie grafu. Skill to opakowanie, w środku działa graf.
  Raz opisany, działa powtarzalnie.
- Hooki: punkty zaczepienia (start i koniec sesji, użycie narzędzia, koniec subagenta).
  Służą do bramek, logów i dashboardu.
- Tryb headless (`claude -p`): uruchamianie z kodu i harmonogramu, np. w pętli dyrygenta.
- Strukturalne wyjście (JSON schema) dla węzłów.
- "Dynamic workflows": SPRAWDZONE 22.10.2026. Claude Code ma narzędzie Workflow: skrypt
  JavaScript z funkcjami `agent()`, `parallel()`, `pipeline()` i fazami. Uruchamia wielu
  subagentów w tle, a wyniki mogą mieć schemat JSON. Włącza się tylko na wyraźną prośbę
  (słowo "ultracode" albo "użyj workflow"), bo potrafi zużyć dużo tokenów.

## 8. Sceptycyzm wobec hype'u
- Cytat "Andrew Ng: prompting umrze za 6 miesięcy, zastąpią go grafy" to FAKE: przemianowany
  wykład Stanford CS230 o karierze, słowo "graph" w nim nie pada.
- Fakty: Anthropic wyciął ponad 80% system promptu Claude Code dla modeli 5. generacji bez straty
  w ewaluacjach. Umiera "god prompt", nie prompting. Prompty żyją w węzłach.
- Posty typu "99% używa Claude'a źle" i "65 agentów w pętli" to marketing. Liczy się koszt i trafność.

## 9. Zastosowania u Marka (kolejność)
1. Skill "szukaj sprzętu" (pierwszy test: laptop pracowniczy): równolegli agenci na Allegro,
   Amazon.pl i polskie sklepy → wspólny format (cena całkowita + jednostkowa, specyfikacja,
   dostępność, dostawa do PL) → weryfikator (czy oferta żyje, czy jest dostawa do PL) → jedno zestawienie.
2. Database Connector AI: zgłoszenie (Mantis/Teams/mail) → zrozumienie → równolegle: struktura
   bazy SPEED + podobne przypadki → SQL → WERYFIKATOR w świeżym kontekście (wydajność,
   anonimizacja, read-only, bramka przed zapisem) → wykonanie przez skrypt PowerShell na
   serwerze klienta (RDP).
3. Dyrygent (Marek OS): tania bramka w kodzie sprawdza, czy w Inboxie Notion przybyło coś nowego.
   Dopiero wtedy budzi Claude'a.
4. Audyty AI / rola AI ambasadora: interaktywne wizualizacje procesów ("visual learning").
5. Dashboard agentów: hooki zapisują zdarzenia (start agenta, narzędzie, koniec, tokeny)
   do logu, a lokalna strona rysuje mapę na żywo. Alternatywa: Langfuse.
   Działa dla Claude Code, NIE dla czatów w aplikacji Claude.
6. Wspólny dziennik sesji (NAJWAŻNIEJSZE, fundament wszystkiego): hook na koniec każdej sesji
   dopisuje do Notion "Stan teraz" (lub pliku w repo): co zrobiono, co otwarte, gdzie leży kod.
   Dzięki temu inne AI (aplikacja Claude, ChatGPT, Grok) wiedzą, co się działo.

## 10. Pytania do Claude Code (odpowiedz na podstawie historii sesji i repo)
1. Jakie projekty i repo mam na tym komputerze i które były ruszane w ostatnich 2 tygodniach?
2. Co już zbudowaliśmy dla Marek OS / dyrygenta (np. scenariusze z 19–20.10, repo firstApp)?
   Co działa, a co jest szkicem?
3. Jak dziś działa Database Connector AI (pliki, skrypty, przepływ)? Gdzie najlepiej wstawić weryfikator?
4. Czy mam już jakieś hooki, skille, komendy albo własnych subagentów? Wypisz je.
5. Czy któryś mój obecny proces to już "graf" w przebraniu (kilka kroków, które można zrównoleglić)?
6. Gdzie najlepiej trzymać wspólny dziennik sesji, żeby czytały go wszystkie AI?
7. Zaproponuj JEDEN pierwszy graf do zbudowania w tym tygodniu, z kosztem i ryzykiem.

## 11. Odpowiedzi (sesja Claude Code w chmurze, 22.10.2026)

Zakres: ta sesja działa w chmurze, nie na komputerze Marka (k20005). Widzi tylko repo
`firstApp`, Notion i Gmail przez konektory. Pytania 1 i 3 trzeba zadać sesji Claude Code
uruchomionej lokalnie na k20005.

**1. Projekty na komputerze.** Brak odpowiedzi z tej sesji (brak dostępu do dysku k20005).
W Notion widać projekty: Marek OS (dyrygent, kokpit), Database Connector AI, Kolejka X / Wpisy z X.

**2. Co zbudowano w `firstApp`.** Jedyny kod to `makieta/index.html` (kokpit "Centrum
dowodzenia", ok. 1400 linii, jeden plik HTML). 7 commitów z 19–20.10.2026, branch
`claude/festive-galileo-tuq324`:
- DZIAŁA: makieta kafelków (przeciąganie, układ), Gmail przez konektor claude.ai, Notion
  (Tasks Tracker, Kolejka X przez zapisane widoki "Kokpit: …"), tablica "Otwarte sprawy"
  z zapisem do Notion, przycisk "do spraw" przy mailu, streszczenie dnia od Claude na żądanie.
- SZKIC / CZEKA: Outlook, Teams, kalendarz (konektor Microsoft 365), Mantis i Azure DevOps
  (zgoda IT). Samego dyrygenta (skrypt Python, VPS, Gmail → Notion → Telegram) nie ma jeszcze
  w kodzie, istnieje tylko jako plan w Notion. Scenariusze dyrygenta są opisane w Notion
  ("Marek OS — Gotowe scenariusze dyrygenta"), nie w repo.

**3. Database Connector AI.** Brak odpowiedzi z tej sesji (kod leży na k20005). Według
schematu z sekcji 9 weryfikator najlepiej postawić między "SQL" a "wykonanie": osobny agent
ze świeżym kontekstem plus twarde sprawdzenia w kodzie (tylko SELECT, limit wierszy,
anonimizacja). Model nie może sam przepuścić zapisu.

**4. Hooki, skille, komendy, subagenci.** W repo `firstApp`: brak (`.claude/` nie istnieje,
nie ma `CLAUDE.md` ani `AGENTS.md`). Ustawienia użytkownika na k20005 (`~/.claude/`) trzeba
sprawdzić lokalnie.

**5. Graf w przebraniu.** Kokpit już stosuje wzorzec z sekcji 4: kod odświeża Gmail co
2 minuty i czyta Notion bez modelu, a Claude działa tylko po kliknięciu "streszczenie dnia".
Kandydat na graf: streszczenie dnia. Dziś to jeden przebieg modelu na wszystkich danych.
Diament: osobne węzły na Gmail, zadania po terminie i otwarte sprawy (równolegle), potem
scalenie. Opłaca się dopiero, gdy danych będzie więcej niż mieści jeden prompt.

**6. Gdzie trzymać dziennik sesji.** Notion, strona "Stan teraz" (Mapa / AI). Czyta ją
aplikacja Claude, ChatGPT przez konektor Notion i Claude Code przez MCP, a Grok już zapisuje
do Notion. Plik w repo widzą tylko narzędzia z dostępem do repo, więc najwyżej jako kopia.
Zasada: krótki wpis na sesję (data, narzędzie, co zrobiono, co otwarte, link do kodu),
bez kopiowania rozmowy.

**7. Pierwszy graf na ten tydzień: dziennik sesji.**
- Kształt: hook `SessionEnd` w Claude Code (kod) → tania bramka: czy sesja coś zmieniła
  (commit, edycja pliku)? Jeśli nie, koniec, zero tokenów → jeden krótki przebieg
  `claude -p` streszcza sesję do stałego formatu JSON → kod dopisuje wpis do Notion.
- Koszt: jeden krótki przebieg modelu na sesję ze zmianami, mieszczący się w planie Max.
- Ryzyko: szum w Notion przy wielu małych sesjach (stąd bramka) i dane firmowe trafiające
  do prywatnego Notion (bramka musi pomijać foldery firmowe, np. Database Connector AI).
- Alternatywa bez hooka na start: komenda `/zapisz-stan` uruchamiana ręcznie na koniec sesji.
