// Użycie: node podglad.js <katalog> <gra> <t1,t2,...>  -> PNG z wybranych klatek
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => {
  const [dir, n, ts] = process.argv.slice(2);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1152, height: 768 } });
  p.on('pageerror', e => console.error('BŁĄD STRONY', e.message));
  await p.goto('file://' + path.resolve(__dirname, 'silnik.html'));
  for (const t of ts.split(',').map(Number)) {
    const url = await p.evaluate(([n, t]) => { render(n, t); return document.getElementById('c').toDataURL('image/png'); }, [Number(n), t]);
    fs.writeFileSync(path.join(dir, `g${n}_t${t}.png`), Buffer.from(url.split(',')[1], 'base64'));
  }
  await b.close();
})();
