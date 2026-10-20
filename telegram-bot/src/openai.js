// Mowa na tekst i tekst na mowę przez OpenAI Audio API.

const API = "https://api.openai.com/v1/audio";

export async function transcribe(env, audio) {
  const form = new FormData();
  form.append("file", new Blob([audio], { type: "audio/ogg" }), "voice.ogg");
  form.append("model", env.OPENAI_STT_MODEL || "gpt-4o-mini-transcribe");
  form.append("language", "pl");

  const res = await fetch(`${API}/transcriptions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${env.OPENAI_API_KEY}` },
    body: form,
  });
  if (!res.ok) throw new Error(`OpenAI transkrypcja ${res.status}: ${await res.text()}`);
  return ((await res.json()).text ?? "").trim();
}

export async function synthesize(env, text) {
  const model = env.OPENAI_TTS_MODEL || "gpt-4o-mini-tts";
  const body = {
    model,
    voice: env.OPENAI_TTS_VOICE || "alloy",
    input: text,
    // Telegram odtwarza wiadomości głosowe w formacie OGG/Opus.
    response_format: "opus",
  };
  if (model.startsWith("gpt-")) {
    body.instructions = "Mów po polsku, ciepło, naturalnie i w spokojnym tempie.";
  }

  const res = await fetch(`${API}/speech`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`OpenAI synteza mowy ${res.status}: ${await res.text()}`);
  return res.arrayBuffer();
}
