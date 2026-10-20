#!/usr/bin/env bash
# Zleca Vapi wykonanie połączenia wychodzącego na twój numer.
#
# Wymagane zmienne środowiskowe:
#   VAPI_API_KEY          prywatny klucz API z panelu Vapi
#   VAPI_ASSISTANT_ID     ID asystenta (Assistants → kopiuj ID)
#   VAPI_PHONE_NUMBER_ID  ID numeru w Vapi, z którego AI dzwoni
#   MY_PHONE_NUMBER       twój numer w formacie E.164, np. +48123456789
#
# Opcjonalne:
#   TOPIC                 temat rozmowy, trafia do promptu jako {{temat}}
#   MAX_DURATION_SECONDS  maksymalna długość rozmowy (domyślnie 180)
#   DRY_RUN=1             tylko wypisuje żądanie, nie dzwoni

set -euo pipefail

: "${MAX_DURATION_SECONDS:=180}"
: "${TOPIC:=}"

for name in VAPI_API_KEY VAPI_ASSISTANT_ID VAPI_PHONE_NUMBER_ID MY_PHONE_NUMBER; do
  if [[ -z "${!name:-}" ]]; then
    echo "Brak zmiennej $name (dodaj ją w Settings → Secrets and variables → Actions)." >&2
    exit 1
  fi
done

if [[ ! "$MY_PHONE_NUMBER" =~ ^\+[1-9][0-9]{6,14}$ ]]; then
  echo "MY_PHONE_NUMBER musi być w formacie E.164, np. +48123456789." >&2
  exit 1
fi

days=(niedziela poniedziałek wtorek środa czwartek piątek sobota)
today_iso=$(TZ=Europe/Warsaw date +%F)
today_name=${days[$(TZ=Europe/Warsaw date +%w)]}

payload=$(jq -n \
  --arg assistantId "$VAPI_ASSISTANT_ID" \
  --arg phoneNumberId "$VAPI_PHONE_NUMBER_ID" \
  --arg number "$MY_PHONE_NUMBER" \
  --arg data "$today_name, $today_iso" \
  --arg temat "$TOPIC" \
  --argjson maxDuration "$MAX_DURATION_SECONDS" \
  '{
    assistantId: $assistantId,
    phoneNumberId: $phoneNumberId,
    customer: { number: $number },
    assistantOverrides: {
      maxDurationSeconds: $maxDuration,
      variableValues: { data: $data, temat: $temat }
    }
  }')

if [[ "${DRY_RUN:-}" == "1" ]]; then
  echo "DRY_RUN: wysłałbym do https://api.vapi.ai/call:"
  echo "$payload"
  exit 0
fi

response=$(curl -sS --fail-with-body -X POST https://api.vapi.ai/call \
  -H "Authorization: Bearer $VAPI_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$payload") || {
  echo "Vapi odrzuciło żądanie: $response" >&2
  exit 1
}

echo "Połączenie zlecone. ID rozmowy: $(jq -r '.id // "?"' <<<"$response"), status: $(jq -r '.status // "?"' <<<"$response")"
