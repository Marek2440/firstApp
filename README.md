# firstApp

- `makieta/` – klikalna makieta panelu.
- Asystent AI, który sam się odzywa (opis niżej).

## Asystent AI: wybierz, jak ma się z tobą kontaktować

Kanał ustawiasz zmienną `CHANNEL` (Settings → Secrets and variables → Actions → Variables)
albo wybierasz z listy przy ręcznym uruchomieniu workflow „AI się odzywa”.

| Kanał | Jak działa | Koszt | Instrukcja |
|---|---|---|---|
| `telefon` | Vapi dzwoni na twój numer, rozmowa na żywo | ok. 45–140 zł/mies. | [docs/ai-telefon-vapi.md](docs/ai-telefon-vapi.md) |
| `telegram` | bot wysyła głosówki i odpowiada na twoje | ok. 15–25 zł/mies. | [docs/ai-telegram.md](docs/ai-telegram.md) |

WhatsApp jest w planach (wymaga konta Meta Business).
