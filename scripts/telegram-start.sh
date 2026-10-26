#!/usr/bin/env bash
# Prosi bota na Telegramie (Cloudflare Worker), żeby zaczął rozmowę wiadomością głosową.
#
# Wymagane zmienne środowiskowe:
#   WORKER_URL         adres bota, np. https://ai-asystent.twoja-nazwa.workers.dev
#   AI_TRIGGER_SECRET  ten sam sekret, który dostał bot przy wdrożeniu
#
# Opcjonalne:
#   TOPIC              temat, od którego bot ma zacząć
#   DRY_RUN=1          tylko wypisuje żądanie, nic nie wysyła

set -euo pipefail

: "${TOPIC:=}"

for name in WORKER_URL AI_TRIGGER_SECRET; do
  if [[ -z "${!name:-}" ]]; then
    echo "Brak $name (Settings → Secrets and variables → Actions; WORKER_URL w zakładce Variables)." >&2
    exit 1
  fi
done

url="${WORKER_URL%/}/poranek"
payload=$(jq -n --arg temat "$TOPIC" '{temat: $temat}')

if [[ "${DRY_RUN:-}" == "1" ]]; then
  echo "DRY_RUN: wysłałbym do $url:"
  echo "$payload"
  exit 0
fi

response=$(curl -sS --fail-with-body -X POST "$url" \
  -H "Authorization: Bearer $AI_TRIGGER_SECRET" \
  -H "Content-Type: application/json" \
  -d "$payload") || {
  echo "Bot odrzucił żądanie: $response" >&2
  exit 1
}

echo "Wiadomość wysłana na Telegram: $(jq -r '.wyslano // "?"' <<<"$response")"
