require('./sources/env');
const http = require('http');
const fs = require('fs');
const path = require('path');
const gmail = require('./sources/gmail');
const notion = require('./sources/notion');
const bricks = require('./bricks');
const store = require('./sources/store');

const PORT = Number(process.env.PORT || 3000);
const PUBLIC = path.join(__dirname, 'public');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css' };

const json = (res, code, body) => {
  res.writeHead(code, { 'content-type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
};

const MAX_BODY = 100 * 1024;
const brickIds = () => bricks.map((b) => b.id);
const readBody = (req) => new Promise((resolve, reject) => {
  let size = 0; const chunks = [];
  req.on('data', (c) => {
    size += c.length;
    if (size > MAX_BODY) { chunks.length = 0; return; }
    chunks.push(c);
  });
  req.on('end', () => {
    if (size > MAX_BODY) return reject(Object.assign(new Error('Body za duże (max 100 KB)'), { status: 413 }));
    try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || 'null')); }
    catch { reject(Object.assign(new Error('Niepoprawny JSON'), { status: 400 })); }
  });
  req.on('error', reject);
});
const decodeParam = (v) => {
  try { return decodeURIComponent(v); }
  catch { throw Object.assign(new Error('Niepoprawny parametr w URL'), { status: 400 }); }
};
const notAllowed = (res) => json(res, 405, { error: 'metoda niedozwolona' });

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  try {
    if (url.pathname === '/api/status') {
      return json(res, 200, { gmail: { configured: gmail.configured(), connected: gmail.connected() }, notion: { connected: notion.connected() } });
    }
    if (url.pathname === '/api/bricks') {
      return json(res, 200, bricks.map((b) => ({ id: b.id, title: b.title, type: b.type, refreshMs: b.refreshMs, via: b.via || 'konto', demo: Boolean(b.demo) })));
    }
    if (url.pathname === '/api/settings') {
      if (req.method === 'GET') return json(res, 200, store.getSettings(brickIds()));
      if (req.method === 'PUT') return json(res, 200, store.putSettings(await readBody(req), brickIds()));
      return notAllowed(res);
    }
    if (url.pathname === '/api/drafts') {
      if (req.method === 'GET') {
        return json(res, 200, { drafts: store.listDrafts({ brickId: url.searchParams.get('brickId') || undefined, itemId: url.searchParams.get('itemId') || undefined }) });
      }
      if (req.method === 'POST') return json(res, 201, store.addDraft(await readBody(req), brickIds()));
      return notAllowed(res);
    }
    if (url.pathname.startsWith('/api/drafts/')) {
      if (req.method !== 'DELETE') return notAllowed(res);
      const ok = store.deleteDraft(decodeParam(url.pathname.slice('/api/drafts/'.length)));
      return ok ? json(res, 200, { ok: true }) : json(res, 404, { error: 'brak szkicu' });
    }
    if (url.pathname.startsWith('/api/brick/')) {
      const brick = bricks.find((b) => b.id === decodeParam(url.pathname.slice('/api/brick/'.length)));
      if (!brick) return json(res, 404, { error: 'brak cegiełki' });
      return json(res, 200, await brick.load());
    }
    if (url.pathname === '/auth/google') {
      if (!gmail.configured()) return json(res, 400, { error: 'Brak GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET w .env' });
      res.writeHead(302, { location: gmail.authUrl() });
      return res.end();
    }
    if (url.pathname === '/auth/callback') {
      await gmail.exchangeCode(url.searchParams.get('code'));
      res.writeHead(302, { location: '/' });
      return res.end();
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') return notAllowed(res);
    const rel = decodeParam(url.pathname);
    const file = path.join(PUBLIC, rel === '/' ? 'index.html' : rel);
    let isFile = false;
    try { isFile = file.startsWith(PUBLIC + path.sep) && !rel.includes('\0') && fs.statSync(file).isFile(); } catch { /* brak pliku */ }
    if (!isFile) { res.writeHead(404); return res.end('404'); }
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).on('error', () => res.destroy()).pipe(res);
  } catch (e) {
    json(res, e.status || 500, { error: e.message });
  }
}).listen(PORT, () => console.log(`Kokpit: http://localhost:${PORT}`));
