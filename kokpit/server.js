require('./sources/env');
const http = require('http');
const fs = require('fs');
const path = require('path');
const gmail = require('./sources/gmail');
const notion = require('./sources/notion');
const bricks = require('./bricks');

const PORT = Number(process.env.PORT || 3000);
const PUBLIC = path.join(__dirname, 'public');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css' };

const json = (res, code, body) => {
  res.writeHead(code, { 'content-type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
};

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  try {
    if (url.pathname === '/api/status') {
      return json(res, 200, { gmail: { configured: gmail.configured(), connected: gmail.connected() }, notion: { connected: notion.connected() } });
    }
    if (url.pathname === '/api/bricks') {
      return json(res, 200, bricks.map(({ id, title, type, refreshMs }) => ({ id, title, type, refreshMs })));
    }
    if (url.pathname.startsWith('/api/brick/')) {
      const brick = bricks.find((b) => b.id === url.pathname.slice('/api/brick/'.length));
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
    const file = path.join(PUBLIC, url.pathname === '/' ? 'index.html' : url.pathname);
    if (!file.startsWith(PUBLIC) || !fs.existsSync(file)) { res.writeHead(404); return res.end('404'); }
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  } catch (e) {
    json(res, 500, { error: e.message });
  }
}).listen(PORT, () => console.log(`Kokpit: http://localhost:${PORT}`));
