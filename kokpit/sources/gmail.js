require('./env');
const fs = require('fs');
const path = require('path');

const DATA = path.join(__dirname, '..', '.data');
const TOKENS = path.join(DATA, 'google-tokens.json');
const SCOPE = 'https://www.googleapis.com/auth/gmail.readonly';

const cfg = () => ({
  id: process.env.GOOGLE_CLIENT_ID,
  secret: process.env.GOOGLE_CLIENT_SECRET,
  redirect: `http://localhost:${process.env.PORT || 3000}/auth/callback`
});

const configured = () => Boolean(cfg().id && cfg().secret);
const readTokens = () => (fs.existsSync(TOKENS) ? JSON.parse(fs.readFileSync(TOKENS, 'utf8')) : null);
const connected = () => configured() && Boolean(readTokens()?.refresh_token);

function authUrl() {
  const c = cfg();
  const p = new URLSearchParams({
    client_id: c.id, redirect_uri: c.redirect, response_type: 'code',
    scope: SCOPE, access_type: 'offline', prompt: 'consent'
  });
  return 'https://accounts.google.com/o/oauth2/v2/auth?' + p;
}

async function tokenRequest(body) {
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(body)
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error_description || j.error || 'token error');
  return j;
}

async function exchangeCode(code) {
  const c = cfg();
  const j = await tokenRequest({
    code, client_id: c.id, client_secret: c.secret, redirect_uri: c.redirect, grant_type: 'authorization_code'
  });
  fs.mkdirSync(DATA, { recursive: true });
  fs.writeFileSync(TOKENS, JSON.stringify({ refresh_token: j.refresh_token, access_token: j.access_token, expires_at: Date.now() + j.expires_in * 1000 }), { mode: 0o600 });
}

async function accessToken() {
  const t = readTokens();
  if (!t?.refresh_token) throw new Error('Gmail nie jest połączony');
  if (t.access_token && t.expires_at > Date.now() + 60000) return t.access_token;
  const c = cfg();
  const j = await tokenRequest({
    refresh_token: t.refresh_token, client_id: c.id, client_secret: c.secret, grant_type: 'refresh_token'
  });
  const next = { ...t, access_token: j.access_token, expires_at: Date.now() + j.expires_in * 1000 };
  fs.writeFileSync(TOKENS, JSON.stringify(next), { mode: 0o600 });
  return next.access_token;
}

async function api(pathname, params) {
  const url = 'https://gmail.googleapis.com/gmail/v1/users/me/' + pathname + (params ? '?' + params : '');
  const r = await fetch(url, { headers: { authorization: 'Bearer ' + await accessToken() } });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error?.message || 'Gmail API ' + r.status);
  return j;
}

const header = (msg, name) => msg.payload?.headers?.find((h) => h.name.toLowerCase() === name)?.value || '';

// Wątki pasujące do zapytania Gmaila (taka sama składnia jak w oknie wyszukiwania).
async function threads(query, max = 15) {
  const list = await api('threads', new URLSearchParams({ q: query, maxResults: String(max) }));
  const ids = (list.threads || []).map((t) => t.id);
  const full = await Promise.all(ids.map((id) => {
    const p = new URLSearchParams({ format: 'metadata' });
    ['Subject', 'From', 'Date'].forEach((h) => p.append('metadataHeaders', h));
    return api('threads/' + id, p.toString());
  }));
  return {
    total: list.resultSizeEstimate ?? ids.length,
    items: full.map((t) => {
      const last = t.messages[t.messages.length - 1];
      return {
        id: t.id,
        subject: header(t.messages[0], 'subject') || '(bez tematu)',
        from: header(last, 'from').replace(/<.*>/, '').trim() || header(last, 'from'),
        date: header(last, 'date'),
        unread: t.messages.some((m) => m.labelIds?.includes('UNREAD')),
        url: 'https://mail.google.com/mail/u/0/#all/' + t.id
      };
    })
  };
}

module.exports = { configured, connected, authUrl, exchangeCode, threads };
