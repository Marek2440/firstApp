// Rdzeń: płótno 1152x768 (ekran LED), pomocniki rysowania, kursor, rama filmu.
const W = 1152, H = 768;
const c = document.getElementById('c');
const g = c.getContext('2d');
const COL = {
  bg: '#1e2226', bar: '#14171a', panel: '#2b3137', panel2: '#363d44', line: '#4f5961',
  white: '#f4f6f7', mute: '#b4bdc3', lime: '#C3EB64', limeD: '#8fb82e',
  red: '#ff6b5e', amber: '#ffc247', blue: '#6bb7ff', pink: '#e39bff', ink: '#14171a'
};
const F = '"DejaVu Sans","Liberation Sans",Arial,sans-serif';

const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const eo = t => 1 - Math.pow(1 - t, 3);
const seg = (t, a, b) => clamp((t - a) / (b - a));

function rr(x, y, w, h, r, fill, stroke, lw = 2) {
  g.beginPath(); g.roundRect(x, y, w, h, r);
  if (fill) { g.fillStyle = fill; g.fill(); }
  if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); }
}
function tx(s, x, y, size = 20, color = COL.white, align = 'left', weight = 'normal') {
  g.font = `${weight} ${size}px ${F}`; g.fillStyle = color; g.textAlign = align; g.textBaseline = 'middle';
  g.fillText(s, x, y);
}
function tw(s, size = 20, weight = 'normal') { g.font = `${weight} ${size}px ${F}`; return g.measureText(s).width; }
function ln(x1, y1, x2, y2, color = COL.line, lw = 2) {
  g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.strokeStyle = color; g.lineWidth = lw; g.lineCap = 'round'; g.stroke();
}
function circ(x, y, r, fill, stroke, lw = 2) {
  g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2);
  if (fill) { g.fillStyle = fill; g.fill(); }
  if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); }
}
function alpha(a, fn) { const p = g.globalAlpha; g.globalAlpha = p * clamp(a); fn(); g.globalAlpha = p; }
function tick(x, y, s, color = COL.lime, lw = 4) {
  g.beginPath(); g.moveTo(x - s, y); g.lineTo(x - s * .3, y + s * .7); g.lineTo(x + s, y - s * .7);
  g.strokeStyle = color; g.lineWidth = lw; g.lineCap = 'round'; g.lineJoin = 'round'; g.stroke();
}
function cross(x, y, s, color = COL.red, lw = 4) {
  ln(x - s, y - s, x + s, y + s, color, lw); ln(x - s, y + s, x + s, y - s, color, lw);
}
function spark(x, y, r, bg = COL.ink, fg = COL.lime) {
  circ(x, y, r * 1.35, bg);
  g.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4 - Math.PI / 2, rad = i % 2 ? r * .35 : r;
    g.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad);
  }
  g.closePath(); g.fillStyle = fg; g.fill();
}
// dymek Asystenta: iskra + tekst + znacznik źródła
function bubble(x, y, w, h, text, tag, size = 19) {
  rr(x, y, w, h, 14, COL.panel2, COL.lime, 2);
  spark(x + 32, y + h / 2, 12);
  tx(text, x + 64, y + h / 2, size, COL.white);
  if (tag) {
    const t = tw(tag, 15, 'bold') + 22;
    rr(x + w - t - 14, y + h / 2 - 15, t, 30, 8, COL.lime);
    tx(tag, x + w - t / 2 - 14, y + h / 2, 15, COL.ink, 'center', 'bold');
  }
}
function button(x, y, w, h, label, pressed, color = COL.lime) {
  rr(x, y, w, h, 10, pressed ? color : COL.panel2, color, 2);
  tx(label, x + w / 2, y + h / 2, 20, pressed ? COL.ink : color, 'center', 'bold');
}

// kursor: klucze [t,x,y]
function kpos(keys, t) {
  if (t <= keys[0][0]) return [keys[0][1], keys[0][2]];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t < b[0]) { const k = ease(seg(t, a[0], b[0])); return [lerp(a[1], b[1], k), lerp(a[2], b[2], k)]; }
  }
  const l = keys[keys.length - 1]; return [l[1], l[2]];
}
function cursor(keys, clicks, t) {
  for (const ct of clicks) {
    const d = t - ct;
    if (d >= 0 && d < .5) { const [x, y] = kpos(keys, ct), p = d / .5; circ(x, y, 8 + 34 * p, null, `rgba(195,235,100,${1 - p})`, 4); }
  }
  const [x, y] = kpos(keys, t);
  g.beginPath();
  [[0, 0], [0, 28], [7, 22], [13, 34], [19, 31], [13, 20], [22, 20]].forEach(([a, b], i) => (i ? g.lineTo(x + a, y + b) : g.moveTo(x + a, y + b)));
  g.closePath(); g.fillStyle = COL.white; g.fill(); g.strokeStyle = COL.ink; g.lineWidth = 2.5; g.lineJoin = 'round'; g.stroke();
}
const pressed = (clicks, t) => clicks.some(ct => t >= ct && t < ct + .35);

// rama filmu: pasek tytułu, postęp, napis, etykieta koncepcji
function frame(G, t) {
  g.globalAlpha = 1;
  g.fillStyle = COL.bg; g.fillRect(0, 0, W, H);
  g.fillStyle = COL.bar; g.fillRect(0, 0, W, 64);
  rr(24, 18, 28, 28, 6, COL.lime);
  tx('GRA ' + G.n + '/10', 66, 32, 20, COL.lime, 'left', 'bold');
  tx(G.title, 192, 32, 28, COL.white, 'left', 'bold');
  tx(G.tag, W - 24, 32, 19, COL.mute, 'right');
  g.fillStyle = COL.line; g.fillRect(0, 64, W, 4);
  g.fillStyle = COL.lime; g.fillRect(0, 64, W * clamp(t / G.dur), 4);
  g.fillStyle = COL.bar; g.fillRect(0, 664, W, 104);
  for (const [a, b, s] of G.caps) {
    const al = Math.min(seg(t, a, a + .3), 1 - seg(t, b - .3, b));
    if (al > 0) alpha(al, () => tx(s, W / 2, 696, 27, COL.white, 'center', 'bold'));
  }
  g.fillStyle = COL.line; g.fillRect(0, 730, W, 2);
  tx('Koncepcja - nie jest gotową funkcjonalnością iSPEED', 24, 750, 17, COL.mute);
  tx('Schemat poglądowy, nie zrzut ekranu', W - 24, 750, 17, COL.mute, 'right');
}
function intro(G, t) {
  const T = G.introT || 1.3;
  if (t >= T) return;
  const a = 1 - seg(t, T - .35, T);
  alpha(a, () => {
    g.fillStyle = COL.bg; g.fillRect(0, 68, W, 596);
    const k = eo(seg(t, 0, .4));
    tx('GRA ' + G.n, W / 2, 270 + (1 - k) * 20, 30, COL.lime, 'center', 'bold');
    tx(G.title, W / 2, 340 + (1 - k) * 20, 68, COL.white, 'center', 'bold');
    tx(G.rule, W / 2, 420 + (1 - k) * 20, 28, COL.mute, 'center');
  });
}
function outro(G, t, big, small) {
  const a = eo(seg(t, G.dur - 2.3, G.dur - 1.9));
  if (a <= 0) return;
  alpha(a, () => {
    g.fillStyle = 'rgba(20,23,26,.9)'; g.fillRect(0, 68, W, 596);
    for (let i = 0; i < 3; i++) alpha(seg(t, G.dur - 1.9 + i * .25, G.dur - 1.6 + i * .25), () => {
      const s = 46, x = W / 2 + (i - 1) * 90, y = 300;
      g.beginPath();
      for (let k = 0; k < 10; k++) { const an = k * Math.PI / 5 - Math.PI / 2, r = k % 2 ? s * .42 : s; g.lineTo(x + Math.cos(an) * r, y + Math.sin(an) * r); }
      g.closePath(); g.fillStyle = COL.lime; g.fill();
    });
    tx(big, W / 2, 400, 54, COL.white, 'center', 'bold');
    tx(small, W / 2, 468, 26, COL.mute, 'center');
  });
}
