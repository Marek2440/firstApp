import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index.js";

const realFetch = globalThis.fetch;
let calls;
let claudeReply;

function fakeKV() {
  const store = new Map();
  return {
    store,
    async get(k, type) {
      const v = store.get(k);
      return v === undefined ? null : type === "json" ? JSON.parse(v) : v;
    },
    async put(k, v) {
      store.set(k, v);
    },
    async delete(k) {
      store.delete(k);
    },
  };
}

function makeEnv(overrides = {}) {
  return {
    TELEGRAM_BOT_TOKEN: "BOT",
    TELEGRAM_WEBHOOK_SECRET: "hook-secret",
    TELEGRAM_CHAT_ID: "42",
    AI_TRIGGER_SECRET: "trigger-secret",
    ANTHROPIC_API_KEY: "sk-ant-test",
    OPENAI_API_KEY: "sk-openai-test",
    HISTORY: fakeKV(),
    ...overrides,
  };
}

function makeCtx() {
  const pending = [];
  return { pending, waitUntil: (p) => pending.push(p), done: () => Promise.all(pending) };
}

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });

beforeEach(() => {
  calls = [];
  claudeReply = { stop_reason: "end_turn", content: [{ type: "text", text: "Dzień dobry!" }] };
  globalThis.fetch = async (input, init = {}) => {
    const url = typeof input === "string" ? input : input.url;
    const call = { url, init };
    calls.push(call);

    if (url.startsWith("https://api.anthropic.com/v1/messages")) {
      call.body = JSON.parse(init.body);
      return json({
        id: "msg_1",
        type: "message",
        role: "assistant",
        model: call.body.model,
        usage: { input_tokens: 1, output_tokens: 1 },
        ...claudeReply,
      });
    }
    if (url.endsWith("/getFile")) return json({ ok: true, result: { file_path: "voice/1.oga" } });
    if (url.includes("/file/botBOT/voice/1.oga")) return new Response(new Uint8Array([1, 2, 3]));
    if (url.endsWith("/audio/transcriptions")) return json({ text: " Jakie mam plany? " });
    if (url.endsWith("/audio/speech")) {
      call.body = JSON.parse(init.body);
      return new Response(new Uint8Array([9, 9]));
    }
    if (url.startsWith("https://api.telegram.org/botBOT/")) {
      call.body = init.body instanceof FormData ? init.body : JSON.parse(init.body);
      return json({ ok: true, result: {} });
    }
    throw new Error(`Nieoczekiwane żądanie: ${url}`);
  };
});

afterEach(() => {
  globalThis.fetch = realFetch;
});

const telegramRequest = (update, secret = "hook-secret") =>
  new Request("https://bot.example/telegram", {
    method: "POST",
    headers: { "X-Telegram-Bot-Api-Secret-Token": secret, "content-type": "application/json" },
    body: JSON.stringify(update),
  });

const sent = (method) => calls.filter((c) => c.url === `https://api.telegram.org/botBOT/${method}`);

test("odrzuca webhook bez poprawnego sekretu", async () => {
  const res = await worker.fetch(telegramRequest({}, "zly"), makeEnv(), makeCtx());
  assert.equal(res.status, 401);
  assert.equal(calls.length, 0);
});

test("ignoruje wiadomości od obcych", async () => {
  const ctx = makeCtx();
  const res = await worker.fetch(
    telegramRequest({ message: { chat: { id: 7 }, text: "hej" } }),
    makeEnv(),
    ctx,
  );
  await ctx.done();
  assert.equal(res.status, 200);
  assert.equal(calls.length, 0);
});

test("bez TELEGRAM_CHAT_ID podaje chat ID i nie rozmawia", async () => {
  const ctx = makeCtx();
  await worker.fetch(
    telegramRequest({ message: { chat: { id: 7 }, text: "hej" } }),
    makeEnv({ TELEGRAM_CHAT_ID: undefined }),
    ctx,
  );
  await ctx.done();
  assert.match(sent("sendMessage")[0].body.text, /chat ID to 7/);
  assert.equal(calls.filter((c) => c.url.includes("anthropic")).length, 0);
});

test("na tekst odpowiada tekstem i zapisuje historię", async () => {
  const env = makeEnv();
  const ctx = makeCtx();
  await worker.fetch(telegramRequest({ message: { chat: { id: 42 }, text: "Cześć" } }), env, ctx);
  await ctx.done();

  const claude = calls.find((c) => c.url.includes("anthropic"));
  assert.equal(claude.body.model, "claude-opus-5-5");
  assert.equal(claude.body.fallbacks, "default");
  assert.deepEqual(claude.body.output_config, { effort: "low" });
  assert.match(claude.init.headers["anthropic-beta"] ?? claude.init.headers.get?.("anthropic-beta"), /server-side-fallback-2026-07-01/);
  assert.deepEqual(claude.body.messages, [{ role: "user", content: "Cześć" }]);

  assert.equal(sent("sendMessage")[0].body.text, "Dzień dobry!");
  assert.deepEqual(JSON.parse(env.HISTORY.store.get("historia:42")), [
    { role: "user", content: "Cześć" },
    { role: "assistant", content: "Dzień dobry!" },
  ]);
});

test("na głosówkę: transkrypcja → Claude z historią → odpowiedź głosowa z podpisem", async () => {
  const env = makeEnv();
  await env.HISTORY.put(
    "historia:42",
    JSON.stringify([
      { role: "user", content: "wcześniej" },
      { role: "assistant", content: "ok" },
    ]),
  );
  const ctx = makeCtx();
  await worker.fetch(
    telegramRequest({ message: { chat: { id: 42 }, voice: { file_id: "F1" } } }),
    env,
    ctx,
  );
  await ctx.done();

  const claude = calls.find((c) => c.url.includes("anthropic"));
  assert.deepEqual(claude.body.messages.at(-1), { role: "user", content: "Jakie mam plany?" });
  assert.equal(claude.body.messages.length, 3);

  const tts = calls.find((c) => c.url.endsWith("/audio/speech"));
  assert.equal(tts.body.input, "Dzień dobry!");
  assert.equal(tts.body.response_format, "opus");

  const voice = sent("sendVoice")[0].body;
  assert.equal(voice.get("chat_id"), "42");
  assert.equal(voice.get("caption"), "Dzień dobry!");
  assert.equal((await voice.get("voice").arrayBuffer()).byteLength, 2);
});

test("/reset czyści historię", async () => {
  const env = makeEnv();
  await env.HISTORY.put("historia:42", "[]");
  const ctx = makeCtx();
  await worker.fetch(telegramRequest({ message: { chat: { id: 42 }, text: "/reset" } }), env, ctx);
  await ctx.done();
  assert.equal(env.HISTORY.store.has("historia:42"), false);
  assert.equal(sent("sendMessage")[0].body.text, "Zaczynamy od nowa.");
});

test("odmowa modelu daje uprzejmą odpowiedź i błąd trafia do czatu", async () => {
  claudeReply = { stop_reason: "refusal", content: [] };
  const ctx = makeCtx();
  await worker.fetch(telegramRequest({ message: { chat: { id: 42 }, text: "x" } }), makeEnv(), ctx);
  await ctx.done();
  assert.match(sent("sendMessage")[0].body.text, /nie mogę pomóc/);

  calls = [];
  const env = makeEnv({ OPENAI_API_KEY: "k" });
  const failing = globalThis.fetch;
  globalThis.fetch = async (url, init) =>
    String(url).endsWith("/audio/transcriptions") ? json({ error: "zly klucz" }, 401) : failing(url, init);
  const ctx2 = makeCtx();
  await worker.fetch(telegramRequest({ message: { chat: { id: 42 }, voice: { file_id: "F1" } } }), env, ctx2);
  await ctx2.done();
  assert.match(sent("sendMessage")[0].body.text, /Coś poszło nie tak: OpenAI transkrypcja 401/);
});

test("/poranek wymaga sekretu i wysyła powitanie głosowe z tematem", async () => {
  const env = makeEnv();
  const bad = await worker.fetch(
    new Request("https://bot.example/poranek", { method: "POST", body: "{}" }),
    env,
    makeCtx(),
  );
  assert.equal(bad.status, 401);

  const res = await worker.fetch(
    new Request("https://bot.example/poranek", {
      method: "POST",
      headers: { Authorization: "Bearer trigger-secret" },
      body: JSON.stringify({ temat: "dentysta o 15" }),
    }),
    env,
    makeCtx(),
  );
  assert.equal(res.status, 200);
  const claude = calls.find((c) => c.url.includes("anthropic"));
  assert.match(claude.body.messages[0].content, /dentysta o 15/);
  assert.match(claude.body.system, /Dzisiaj jest/);
  assert.equal(sent("sendVoice").length, 1);
});

test("historia jest przycinana i zawsze zaczyna się od użytkownika", async () => {
  const env = makeEnv();
  const long = [];
  for (let i = 0; i < 30; i++) {
    long.push({ role: "user", content: `u${i}` }, { role: "assistant", content: `a${i}` });
  }
  await env.HISTORY.put("historia:42", JSON.stringify(long));
  const ctx = makeCtx();
  await worker.fetch(telegramRequest({ message: { chat: { id: 42 }, text: "nowe" } }), env, ctx);
  await ctx.done();
  const saved = JSON.parse(env.HISTORY.store.get("historia:42"));
  assert.ok(saved.length <= 20);
  assert.equal(saved[0].role, "user");
  assert.deepEqual(saved.slice(-2), [
    { role: "user", content: "nowe" },
    { role: "assistant", content: "Dzień dobry!" },
  ]);
});
