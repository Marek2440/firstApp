import Anthropic from "@anthropic-ai/sdk";

const DEFAULT_MODEL = "claude-opus-5-5";

const DEFAULT_PROMPT = `Jesteś osobistym asystentem głosowym, z którym użytkownik rozmawia po polsku przez Telegram.
Twoje odpowiedzi są zamieniane na mowę, więc:
- odpowiadaj krótko, zwykle 1–3 zdania, jak w rozmowie telefonicznej,
- pisz naturalnym językiem mówionym, bez list, nagłówków, emoji i formatowania,
- pomagaj planować dzień, przypominaj o priorytetach i zadawaj jedno pytanie naraz.`;

const REFUSAL_REPLY = "Przepraszam, w tym nie mogę pomóc. Porozmawiajmy o czymś innym.";

export async function askClaude(env, messages) {
  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  const today = new Intl.DateTimeFormat("pl-PL", {
    timeZone: "Europe/Warsaw",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const response = await client.beta.messages.create({
    model: env.CLAUDE_MODEL || DEFAULT_MODEL,
    max_tokens: 4000,
    system: `${env.SYSTEM_PROMPT || DEFAULT_PROMPT}\n\nDzisiaj jest ${today}.`,
    messages,
    // Krótka rozmowa nie potrzebuje długiego namysłu; niski wysiłek = szybciej i taniej.
    output_config: { effort: "low" },
    // Gdy model odmówi z powodów bezpieczeństwa, API samo spróbuje modelu zastępczego.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
  });

  if (response.stop_reason === "refusal") return REFUSAL_REPLY;

  const text = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("")
    .trim();
  return text || "Hmm, nie wiem, co powiedzieć. Możesz powtórzyć?";
}
