// Składa samodzielną wersję gry Kurier Max na GitHub Pages z pliku artefaktu ../index.html.
// Użycie: node kurier-max/pages/build.mjs <katalog-wyjściowy>
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.argv[2];
if (!out) {
  console.error('Podaj katalog wyjściowy, np. node kurier-max/pages/build.mjs ../kurier-max');
  process.exit(1);
}

const game = readFileSync(join(here, '..', 'index.html'), 'utf8');
const extras = readFileSync(join(here, 'extras.html'), 'utf8');

// Artefakt zaczyna się od <title>, fontów i <style>; to trafia do <head>, reszta do <body>.
const styleEnd = game.indexOf('</style>') + '</style>'.length;
const head = game.slice(0, styleEnd).replace(/<meta name="claude:[^>]*>\n?/, '');
const body = game.slice(styleEnd).trim();
const version = createHash('sha256').update(game + extras).digest('hex').slice(0, 12);

// Reset odpowiada szkieletowi, w który claude.ai opakowuje artefakt.
const html = `<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="description" content="Gra dla Maxa: ładujesz paczki w sortowni, rozwozisz je po osiedlu i zbierasz podpisy.">
<meta name="theme-color" content="#F26B1D">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Kurier Max">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" type="image/png" href="icon-192.png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<style>
:root { color-scheme: light; padding-top: env(safe-area-inset-top, 0px); padding-bottom: env(safe-area-inset-bottom, 0px); }
html, body { overscroll-behavior: none; }
body { margin: 0; font: 14px system-ui, sans-serif; -webkit-touch-callout: none; }
img { max-width: 100%; }
[hidden] { display: none !important; }
</style>
${head}
</head>
<body>
${body}
${extras}
</body>
</html>
`;

mkdirSync(out, { recursive: true });
writeFileSync(join(out, 'index.html'), html);
writeFileSync(join(out, 'sw.js'), readFileSync(join(here, 'sw.js'), 'utf8').replace('__VERSION__', version));
for (const f of ['manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'README.md']) {
  copyFileSync(join(here, f), join(out, f));
}
writeFileSync(join(out, '.nojekyll'), '');
console.log(`Gotowe: ${out} (wersja ${version})`);
