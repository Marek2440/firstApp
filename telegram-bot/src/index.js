// Asystent AI na Telegramie: rozmowa wiadomościami głosowymi i tekstowymi.
//
//   POST /telegram  webhook z Telegrama (sprawdzany nagłówkiem secret_token)
//   POST /poranek   GitHub Actions prosi o rozpoczęcie rozmowy (Bearer AI_TRIGGER_SECRET)

import { askClaude } from "./claude.js";
import { loadHistory, saveHistory, clearHistory } from "./history.js";
import { transcribe, synthesize } from "./openai.js";
import { sendText, sendVoice, sendChatAction, downloadFile } from "./telegram.js";

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    if (request.method !== "POST") {
      return new Response("Asystent AI działa.");
    }
    if (pathname === "/telegram") return handleTelegram(request, env, ctx);
    if (pathname === "/poranek") return handleMorning(request, env);
    return new Response("Nie znaleziono", { status: 404 });
  },
};

async function handleTelegram(request, env, ctx) {
  const secret = request.headers.get("X-Telegram-Bot-Api-Secret-Token") ?? "";
  if (!env.TELEGRAM_WEBHOOK_SECRET || !safeEqual(secret, env.TELEGRAM_WEBHOOK_SECRET)) {
    return new Response("Brak dostępu", { status: 401 });
  }

  const update = await request.json();
  const message = update.message;
  if (!message) return new Response("OK");

  const chatId = String(message.chat.id);
  if (!env.TELEGRAM_CHAT_ID) {
    // Pierwsze uruchomienie: właściciel nie zna jeszcze swojego chat ID.
    ctx.waitUntil(
      sendText(
        env,
        chatId,
        `Twój chat ID to ${chatId}. Dodaj go w GitHubie jako sekret TELEGRAM_CHAT_ID ` +
          `i uruchom ponownie wdrożenie bota. Do tego czasu nie odpowiadam na wiadomości.`,
      ),
    );
    return new Response("OK");
  }
  if (chatId !== String(env.TELEGRAM_CHAT_ID)) {
    // Bot rozmawia tylko z właścicielem.
    return new Response("OK");
  }

  // Odpowiadamy Telegramowi od razu, żeby nie ponawiał wysyłki, a pracę kończymy w tle.
  ctx.waitUntil(
    handleMessage(env, chatId, message).catch(async (err) => {
      console.error(err);
      await sendText(env, chatId, `⚠️ Coś poszło nie tak: ${String(err.message).slice(0, 300)}`);
    }),
  );
  return new Response("OK");
}

async function handleMessage(env, chatId, message) {
  const text = message.text?.trim();

  if (text === "/start") {
    await sendText(
      env,
      chatId,
      "Cześć! Wyślij mi wiadomość głosową albo tekst. Na głos odpowiem głosem, na tekst tekstem. " +
        "/reset zaczyna rozmowę od nowa.",
    );
    return;
  }
  if (text === "/reset") {
    await clearHistory(env, chatId);
    await sendText(env, chatId, "Zaczynamy od nowa.");
    return;
  }

  const audio = message.voice ?? message.audio;
  if (audio) {
    await sendChatAction(env, chatId, "record_voice");
    const recording = await downloadFile(env, audio.file_id);
    const heard = await transcribe(env, recording);
    if (!heard) {
      await sendText(env, chatId, "Nic nie usłyszałem, spróbuj jeszcze raz.");
      return;
    }
    const reply = await converse(env, chatId, heard);
    await sendVoice(env, chatId, await synthesize(env, reply), reply);
    return;
  }

  if (text) {
    await sendChatAction(env, chatId, "typing");
    await sendText(env, chatId, await converse(env, chatId, text));
  }
}

async function handleMorning(request, env) {
  const auth = request.headers.get("Authorization") ?? "";
  if (!env.AI_TRIGGER_SECRET || !safeEqual(auth, `Bearer ${env.AI_TRIGGER_SECRET}`)) {
    return new Response("Brak dostępu", { status: 401 });
  }
  if (!env.TELEGRAM_CHAT_ID) {
    return new Response("Brak TELEGRAM_CHAT_ID: napisz najpierw do bota.", { status: 409 });
  }

  const { temat = "" } = await request.json().catch(() => ({}));
  const chatId = String(env.TELEGRAM_CHAT_ID);
  const prompt =
    "(Automatyczne przypomnienie: rozpocznij teraz rozmowę z użytkownikiem jako pierwszy, " +
    "krótko się przywitaj i zapytaj o plany na dziś." +
    (temat ? ` Temat, od którego zacznij: ${temat}` : "") +
    ")";

  const reply = await converse(env, chatId, prompt);
  await sendVoice(env, chatId, await synthesize(env, reply), reply);
  return Response.json({ ok: true, wyslano: reply });
}

// Jedna wymiana: dopisuje pytanie i odpowiedź do historii dopiero po udanej odpowiedzi.
async function converse(env, chatId, userText) {
  const history = await loadHistory(env, chatId);
  const messages = [...history, { role: "user", content: userText }];
  const reply = await askClaude(env, messages);
  await saveHistory(env, chatId, [...messages, { role: "assistant", content: reply }]);
  return reply;
}

function safeEqual(a, b) {
  const enc = new TextEncoder();
  const x = enc.encode(a);
  const y = enc.encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  }
  return diff === 0;
}
