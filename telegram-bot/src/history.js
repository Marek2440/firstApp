// Historia rozmowy w Workers KV: ostatnie wiadomości, wygasa po 2 dniach ciszy.

const MAX_MESSAGES = 20;
const TTL_SECONDS = 2 * 24 * 60 * 60;

const key = (chatId) => `historia:${chatId}`;

export async function loadHistory(env, chatId) {
  return (await env.HISTORY.get(key(chatId), "json")) ?? [];
}

export async function saveHistory(env, chatId, messages) {
  let kept = messages.slice(-MAX_MESSAGES);
  // Rozmowa musi zaczynać się od wiadomości użytkownika.
  while (kept.length && kept[0].role !== "user") kept = kept.slice(1);
  await env.HISTORY.put(key(chatId), JSON.stringify(kept), { expirationTtl: TTL_SECONDS });
}

export async function clearHistory(env, chatId) {
  await env.HISTORY.delete(key(chatId));
}
