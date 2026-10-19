# AI na Telegramie (wiadomości głosowe w obie strony)

Bot w folderze `telegram-bot/` działa na Cloudflare Workers (darmowy plan):

- wysyłasz mu **wiadomość głosową** → OpenAI zamienia ją na tekst → Claude odpowiada →
  OpenAI zamienia odpowiedź na mowę → dostajesz **wiadomość głosową** (z tekstem w podpisie),
- wysyłasz **tekst** → odpowiada tekstem,
- **rano sam zaczyna rozmowę**, gdy w workflow „AI się odzywa” wybierzesz kanał `telegram`,
- pamięta ostatnie 20 wiadomości (przez 2 dni od ostatniej rozmowy); `/reset` czyści pamięć,
- rozmawia tylko z tobą (sprawdza twój chat ID), innym nie odpowiada.

## 1. Załóż konta i zdobądź klucze

| Co | Gdzie | Sekret w GitHubie |
|---|---|---|
| Bot Telegram | napisz do [@BotFather](https://t.me/BotFather): `/newbot`, podaj nazwę, skopiuj token | `TELEGRAM_BOT_TOKEN` |
| Cloudflare (darmowe) | załóż konto, otwórz raz **Workers & Pages** (ustawia adres `*.workers.dev`) | – |
| Token API Cloudflare | My Profile → API Tokens → Create Token → szablon **Edit Cloudflare Workers** | `CLOUDFLARE_API_TOKEN` |
| ID konta Cloudflare | Workers & Pages → po prawej „Account ID” | `CLOUDFLARE_ACCOUNT_ID` |
| Klucz Claude | [console.anthropic.com](https://console.anthropic.com) → API Keys | `ANTHROPIC_API_KEY` |
| Klucz OpenAI (głos) | [platform.openai.com](https://platform.openai.com) → API keys | `OPENAI_API_KEY` |
| Hasło do porannej wiadomości | wymyśl długi losowy ciąg (min. 32 znaki) | `AI_TRIGGER_SECRET` |

Sekrety dodajesz w repozytorium: **Settings → Secrets and variables → Actions → New repository secret**.

## 2. Wdróż bota

1. **Actions → „Telegram: wdrożenie bota” → Run workflow.**
   Workflow uruchomi testy, utworzy bazę na historię, wdroży bota i podłączy go do Telegrama.
2. W podsumowaniu zadania zobaczysz adres bota, np. `https://ai-asystent.twoja-nazwa.workers.dev`.
   Dodaj go w zakładce **Variables** jako `WORKER_URL`.
3. Napisz cokolwiek do swojego bota na Telegramie. Odpowie: „Twój chat ID to …”.
4. Dodaj ten numer jako sekret `TELEGRAM_CHAT_ID` i **uruchom wdrożenie jeszcze raz**.
5. Gotowe: wyślij botowi głosówkę.

## 3. Poranna wiadomość

Workflow **„AI się odzywa (telefon / Telegram)”** w dni robocze o ok. 8:05 odzywa się kanałem
ze zmiennej `CHANNEL` (zakładka **Variables**):

- `telegram` – bot wysyła głosówkę na powitanie i czeka na twoją odpowiedź,
- `telefon` (domyślnie) – Vapi dzwoni na telefon, patrz [ai-telefon-vapi.md](ai-telefon-vapi.md).

Przy ręcznym **Run workflow** wybierasz kanał z listy i możesz podać temat.

## Ustawienia

W `telegram-bot/wrangler.toml` (sekcja `[vars]`), po zmianie uruchom wdrożenie ponownie:

- `CLAUDE_MODEL` – model rozmowy, domyślnie `claude-opus-5-5`;
  `claude-haiku-5-5` jest wielokrotnie tańszy, ale mniej bystry,
- `OPENAI_TTS_VOICE` – głos (`alloy`, `coral`, `nova`, `onyx`, `sage`, …),
- `OPENAI_STT_MODEL`, `OPENAI_TTS_MODEL` – modele rozpoznawania i syntezy mowy.

Charakter asystenta zmienisz w `telegram-bot/src/claude.js` (`DEFAULT_PROMPT`).

## Koszty (szacunkowo)

- Cloudflare Workers i KV: **0 zł** w darmowym planie przy prywatnym użyciu.
- Telegram: **0 zł**.
- Claude Opus 5.5 ($4 / $20 za mln tokenów): ok. 4–6 gr za wymianę zdań.
- OpenAI: rozpoznawanie mowy ok. $0.003/min, synteza ok. $0.015/min nagrania.

Przy ok. 10 wymianach dziennie to ok. **15–25 zł miesięcznie**; z `claude-haiku-5-5` ok. 5–10 zł.

## Prywatność

Twoje nagrania trafiają do OpenAI (transkrypcja), a tekst rozmowy do Anthropic (Claude).
Historia leży w twoim koncie Cloudflare i znika po 2 dniach ciszy albo po `/reset`.

## Testy lokalnie

```bash
cd telegram-bot
npm ci
npm test
```
