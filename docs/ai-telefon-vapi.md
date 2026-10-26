# AI dzwoni na telefon (Vapi + GitHub Actions)

Workflow `.github/workflows/ai-kontakt.yml` („AI się odzywa”) w dni robocze o ok. 8:05
czasu polskiego prosi Vapi o połączenie na twój numer, gdy zmienna `CHANNEL` to `telefon`
(albo gdy jej nie ma). Rozmowę prowadzi asystent skonfigurowany w Vapi.
Możesz też zadzwonić „na żądanie” z zakładki **Actions**.

Wersja na Telegram: [ai-telegram.md](ai-telegram.md).

## 1. Przygotuj Vapi

1. Załóż konto na [vapi.ai](https://vapi.ai) i utwórz asystenta (**Assistants**).
2. Ustaw język polski, tani głos i krótki prompt. W prompcie możesz użyć zmiennych,
   które wysyła workflow:
   - `{{data}}` – np. „poniedziałek, 2026-10-19”,
   - `{{temat}}` – temat podany przy ręcznym uruchomieniu (może być pusty).

   Przykład promptu:
   > Jesteś moim porannym asystentem. Dziś jest {{data}}. Zapytaj, jakie mam plany na dziś,
   > pomóż wybrać 3 najważniejsze zadania i zakończ rozmowę w ciągu 3 minut.
   > Jeśli podano temat, zacznij od niego: {{temat}}

3. Dodaj numer, z którego AI ma dzwonić (**Phone Numbers**). Na polską komórkę
   najpewniej działa numer zaimportowany z Twilio.
4. Sprawdź ręcznie w panelu Vapi, że połączenie na twój numer działa.

## 2. Dodaj sekrety w GitHub

W repozytorium: **Settings → Secrets and variables → Actions → New repository secret**.

| Sekret | Skąd go wziąć |
|---|---|
| `VAPI_API_KEY` | Vapi → API Keys → **Private** key |
| `VAPI_ASSISTANT_ID` | ID asystenta |
| `VAPI_PHONE_NUMBER_ID` | ID numeru w Vapi (nie sam numer) |
| `MY_PHONE_NUMBER` | twój numer w formacie `+48123456789` |

Opcjonalnie w zakładce **Variables** możesz dodać `MAX_DURATION_SECONDS`
(maksymalna długość rozmowy, domyślnie 180 s), żeby rozmowa nie kosztowała za dużo.

## 3. Uruchom

- **Na żądanie:** Actions → „AI się odzywa (telefon / Telegram)” → **Run workflow**,
  kanał `telefon` (możesz wpisać temat).
- **Automatycznie:** w dni robocze o ok. 8:05. GitHub potrafi opóźnić zaplanowane
  zadania o kilka–kilkanaście minut.

Harmonogram i przycisk **Run workflow** działają dopiero wtedy, gdy plik workflow
jest na domyślnej gałęzi repozytorium.

### Zmiana godziny

GitHub liczy `cron` w UTC, a Polska ma czas letni (UTC+2) i zimowy (UTC+1).
Dlatego workflow startuje dwa razy (6:05 i 7:05 UTC), a odzywa się tylko wtedy,
gdy w Warszawie jest 8:xx. Żeby odzywał się np. o 18, w `ai-kontakt.yml`:
- w `cron` wpisz godziny `16,17`,
- w `TARGET_HOUR` wpisz `"18"`.

## Test bez dzwonienia

```bash
DRY_RUN=1 VAPI_API_KEY=x VAPI_ASSISTANT_ID=a VAPI_PHONE_NUMBER_ID=p \
  MY_PHONE_NUMBER=+48123456789 TOPIC="test" bash scripts/vapi-call.sh
```

## Koszty

Płacisz Vapi za minutę rozmowy (ok. $0.08–0.20/min za AI) i operatorowi za połączenie
(Twilio na polską komórkę: $0.22/min z numeru spoza EOG, $0.0715/min z numeru z EOG).
GitHub Actions jest darmowe w ramach limitu minut, a to zadanie trwa kilka sekund.
