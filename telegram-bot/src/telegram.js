// Minimalny klient Telegram Bot API.

const CAPTION_LIMIT = 1024;
const TEXT_LIMIT = 4096;

async function call(env, method, body) {
  const isForm = body instanceof FormData;
  const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`, {
    method: "POST",
    headers: isForm ? undefined : { "Content-Type": "application/json" },
    body: isForm ? body : JSON.stringify(body),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(`Telegram ${method}: ${data.description}`);
  return data.result;
}

export function sendText(env, chatId, text) {
  return call(env, "sendMessage", { chat_id: chatId, text: text.slice(0, TEXT_LIMIT) });
}

export function sendChatAction(env, chatId, action) {
  return call(env, "sendChatAction", { chat_id: chatId, action });
}

export function sendVoice(env, chatId, audio, caption) {
  const form = new FormData();
  form.append("chat_id", chatId);
  form.append("voice", new Blob([audio], { type: "audio/ogg" }), "odpowiedz.ogg");
  if (caption) form.append("caption", caption.slice(0, CAPTION_LIMIT));
  return call(env, "sendVoice", form);
}

export async function downloadFile(env, fileId) {
  const { file_path } = await call(env, "getFile", { file_id: fileId });
  const res = await fetch(`https://api.telegram.org/file/bot${env.TELEGRAM_BOT_TOKEN}/${file_path}`);
  if (!res.ok) throw new Error(`Telegram: nie udało się pobrać nagrania (${res.status})`);
  return res.arrayBuffer();
}
