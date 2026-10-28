// Użycie: node render.js <katalog_wyjscia> [numery gier po przecinku] [fps]
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const out = process.argv[2];
const only = process.argv[3] ? process.argv[3].split(',').map(Number) : null;
const fps = Number(process.argv[4] || 25);
const names = { 1: 'pierwsze-zlecenie', 2: 'gdzie-to-jest', 3: 'mail-kontra-pdf', 4: 'zaladuj-naczepe', 5: 'trasa-dnia', 6: 'magazynier', 7: 'rampa', 8: 'dyspozytor-112', 9: 'przetarg', 10: 'sortownia' };
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1152, height: 768 } });
  p.on('pageerror', e => console.error('BŁĄD STRONY', e.message));
  await p.goto('file://' + path.resolve(__dirname, 'silnik.html'));
  const meta = await p.evaluate(() => meta());
  for (const m of meta) {
    if (only && !only.includes(m.n)) continue;
    const file = path.join(out, `gra${String(m.n).padStart(2, '0')}-${names[m.n]}.mp4`);
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', file], { stdio: ['pipe', 'inherit', 'inherit'] });
    const done = new Promise(r => ff.on('close', r));
    const N = m.dur * fps;
    for (let f = 0; f < N; f++) {
      const url = await p.evaluate(([n, t]) => { render(n, t); return document.getElementById('c').toDataURL('image/png'); }, [m.n, f / fps]);
      if (!ff.stdin.write(Buffer.from(url.split(',')[1], 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
    }
    ff.stdin.end(); await done;
    console.log('gotowe', file);
  }
  await b.close();
})();
