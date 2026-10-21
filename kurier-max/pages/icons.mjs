// Rysuje ikony PNG z icon.svg (z fontem Lilita One). Uruchamiaj tylko po zmianie icon.svg.
// Użycie: node kurier-max/pages/icons.mjs   (wymaga pakietu playwright)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const here = fileURLToPath(new URL('.', import.meta.url));
const svg = readFileSync(join(here, 'icon.svg'), 'utf8');
const page = (size) => `<!doctype html><html><head>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lilita+One&display=block">
<style>html,body{margin:0}svg{display:block;width:${size}px;height:${size}px}</style></head>
<body>${svg}</body></html>`;

const browser = await chromium.launch();
for (const [name, size] of [['icon-512.png', 512], ['icon-192.png', 192], ['apple-touch-icon.png', 180]]) {
  const p = await browser.newPage({ viewport: { width: size, height: size } });
  await p.setContent(page(size), { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: join(here, name) });
  await p.close();
}
await browser.close();
console.log('Ikony gotowe.');
