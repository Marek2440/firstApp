// GRY 4-6: spedycja i magazyn

// ---------- GRA 4: Załaduj naczepę ----------
(function () {
  const X0 = 100, Y0 = 130, CW = 80, CH = 64, COLS = 12;
  const SC = { 1: COL.lime, 2: COL.amber, 3: COL.blue };
  const P = [
    [0, 0, 2, 3], [2, 0, 2, 3], [0, 1, 2, 3], [2, 1, 2, 3],
    [4, 0, 2, 2, 'err'], [4, 1, 2, 2], [6, 0, 2, 2], [6, 1, 2, 2],
    [8, 0, 2, 1], [8, 1, 2, 1], [10, 0, 2, 1], [10, 1, 1, 1]
  ].map(([col, row, w, stop, err]) => ({ col, row, w, stop, err, d: err ? 1.9 : 1.05 }));
  const CONV = [470, 520];
  let t0 = 3.0; const keys = [[0, 800, 600], [t0 - .4, 560, 560]], clicks = [];
  P.forEach(p => {
    p.t0 = t0; p.sx = X0 + (p.col + p.w / 2) * CW; p.sy = Y0 + (p.row + .5) * CH;
    keys.push([t0 + .1, CONV[0], CONV[1]]); clicks.push(t0 + .1);
    if (p.err) { p.wx = X0 + 10 * CW; p.wy = Y0 + .5 * CH; keys.push([t0 + .6, p.wx, p.wy], [t0 + 1.1, p.wx, p.wy]); p.errT = t0 + .6; }
    keys.push([t0 + p.d - .1, p.sx, p.sy]); p.land = t0 + p.d - .1; t0 += p.d;
  });
  const END = t0;
  function pal(x, y, w, stop, a = 1, label = true) {
    alpha(a, () => {
      rr(x - w / 2 + 3, y - 26, w - 6, 52, 8, SC[stop], COL.ink, 2);
      if (label) tx(String(stop), x, y, 24, COL.ink, 'center', 'bold');
    });
  }
  function draw(t) {
    // naczepa
    rr(X0 - 12, Y0 - 12, COLS * CW + 24, 2 * CH + 24, 10, COL.panel, COL.line, 3);
    rr(24, Y0 - 12, 64, 2 * CH + 24, 10, COL.panel2, COL.line, 3);
    tx('kabina', 56, Y0 + CH, 17, COL.mute, 'center');
    tx('tył naczepy', X0 + COLS * CW, Y0 - 38, 17, COL.mute, 'right');
    tx('ładuj od kabiny', X0, Y0 - 38, 17, COL.mute, 'left');
    for (let c2 = 1; c2 < COLS; c2++) ln(X0 + c2 * CW, Y0, X0 + c2 * CW, Y0 + 2 * CH, 'rgba(79,89,97,.45)', 1);
    ln(X0, Y0 + CH, X0 + COLS * CW, Y0 + CH, 'rgba(79,89,97,.45)', 1);
    // legenda przystanków
    [[3, 'Przystanek 3 (ostatni)'], [2, 'Przystanek 2'], [1, 'Przystanek 1 (pierwszy)']].forEach(([s, l], i) => {
      const x = 100 + i * 330; rr(x, 300, 26, 26, 6, SC[s]); tx(l, x + 38, 313, 19, COL.white);
    });
    // wypełnienie
    const placed = P.filter(p => t >= p.land);
    const cells = placed.reduce((a, p) => a + p.w, 0), pct = Math.round(cells / 24 * 100);
    tx('Wypełnienie naczepy', 100, 372, 21, COL.mute);
    rr(100, 396, 560, 26, 13, COL.bg, COL.line);
    rr(100, 396, 560 * cells / 24, 26, 13, pct > 90 ? COL.lime : COL.amber);
    tx(pct + '%', 680, 409, 26, COL.white, 'left', 'bold');
    const okOrder = t >= END - .2;
    tx('Kolejność rozładunku', 760, 372, 21, COL.mute);
    tx(okOrder ? 'poprawna' : placed.length ? 'sprawdzam...' : '-', 760, 409, 24, okOrder ? COL.lime : COL.white, 'left', 'bold');
    if (okOrder) tick(1070, 409, 12);
    // taśma
    rr(40, 470, 1072, 100, 14, COL.panel, COL.line);
    tx('Taśma', 64, 490, 17, COL.mute);
    for (let i = 0; i < 20; i++) { const x = ((i * 60 - t * 80) % 1200 + 1200) % 1200 - 40; ln(x, 556, x + 24, 556, COL.line, 3); }
    // palety
    let curF = 0; P.forEach(p => { curF += ease(seg(t, p.t0 + .1, p.t0 + .5)); });
    P.forEach((p, i) => {
      if (t >= p.land) {
        const k = seg(t, p.land, p.land + .2);
        pal(p.sx, p.sy, p.w * CW, p.stop, 1); return;
      }
      if (t >= p.t0 + .1) {
        const [x, y] = kpos(keys, t), bad = p.err && t >= p.errT && t < p.t0 + 1.3;
        pal(x, y, p.w * CW, p.stop, 1);
        if (bad) { cross(x, y, 20, COL.red, 6); tx('Za wcześnie! Najpierw przystanek 3 i 2', 580, 440, 22, COL.red, 'center', 'bold'); }
        return;
      }
      const x = CONV[0] + (i - curF) * 190;
      if (x < 1060) pal(x, CONV[1], p.w * CW * (i - curF < .5 ? 1 : .7), p.stop, 1, true);
    });
    // wynik punktowy
    tx('Punkty ' + (placed.length * 100 + (okOrder ? 300 : 0)), 1112, 598, 21, COL.white, 'right', 'bold');
    cursor(keys, clicks, t);
  }
  G.push({ n: 4, title: 'Załaduj naczepę', tag: 'Spedycja: plan załadunku', dur: 20, introT: 1.4,
    rule: 'Ułóż palety tak, by rozładunek szedł bez przekładania', fn: draw,
    caps: [[1.4, 8.5, 'Przeciągaj palety na naczepę'], [8.5, 14, 'Ostatni rozładunek jedzie najgłębiej'], [14, 17.6, 'Pełna naczepa, zero przekładania']],
    out: ['96% wypełnienia', 'I rozładunek bez ani jednego przekładania'] });
})();

// ---------- GRA 5: Trasa dnia ----------
(function () {
  const pts = { D: [130, 560], A: [240, 210], B: [440, 150], C: [660, 270], E: [330, 410], F: [580, 480] };
  const win = { A: 'do 10:00', B: 'do 11:30', C: 'do 13:00', E: 'do 09:00', F: 'do 14:30' };
  const r1 = ['D', 'A', 'C', 'E', 'B', 'F', 'D'], r2 = ['D', 'E', 'A', 'B', 'C', 'F', 'D'];
  const dist = (a, b) => Math.hypot(pts[a][0] - pts[b][0], pts[a][1] - pts[b][1]);
  const len = r => r.slice(1).reduce((s, p, i) => s + dist(r[i], p), 0);
  const L1 = len(r1), L2 = len(r2), KM = .25;
  const A1 = 1.8, B1 = 7.6, A2 = 9.8, B2 = 15.0, TR = [15.4, 18.4];
  function head(route, p) {
    const L = len(route) * p; let acc = 0;
    for (let i = 1; i < route.length; i++) {
      const d = dist(route[i - 1], route[i]);
      if (acc + d >= L) { const k = (L - acc) / d, a = pts[route[i - 1]], b = pts[route[i]]; return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), i]; }
      acc += d;
    }
    const e = pts[route[route.length - 1]]; return [e[0], e[1], route.length];
  }
  function poly(route, p, col, lw) {
    const [hx, hy, hi] = head(route, p);
    g.beginPath(); g.moveTo(...pts[route[0]]);
    for (let i = 1; i < hi; i++) g.lineTo(...pts[route[i]]);
    g.lineTo(hx, hy); g.strokeStyle = col; g.lineWidth = lw; g.lineJoin = 'round'; g.lineCap = 'round'; g.stroke();
  }
  const keys = [[0, 800, 600]]; const clicks = [];
  const stops = (r, a, b) => { // cursor wędruje po trasie
    for (let i = 0; i <= 200; i++) { const p = i / 200, [x, y] = head(r, p); keys.push([lerp(a, b, p), x, y]); }
  };
  keys.push([A1 - .4, pts.D[0], pts.D[1]]); clicks.push(A1 - .2);
  stops(r1, A1, B1);
  keys.push([A2 - .5, pts.D[0], pts.D[1]]); clicks.push(A2 - .2); stops(r2, A2, B2);
  keys.push([B2 + .8, 900, 580]);
  function draw(t) {
    rr(40, 92, 720, 552, 14, COL.panel, COL.line);
    for (let x = 80; x < 760; x += 80) ln(x, 92, x, 644, 'rgba(79,89,97,.35)', 1);
    for (let y = 140; y < 644; y += 80) ln(40, y, 760, y, 'rgba(79,89,97,.35)', 1);
    const showR1 = t < A2 - .2;
    const p1 = seg(t, A1, B1), p2 = seg(t, A2, B2);
    if (showR1) alpha(1 - seg(t, B1 + 1.2, B1 + 1.9), () => poly(r1, p1, COL.red, 6));
    if (t >= A2 - .2) poly(r2, p2, COL.lime, 7);
    // punkty
    const passed = new Set();
    const cur = t >= A2 - .2 ? [r2, p2] : [r1, p1];
    for (let i = 1; i < cur[0].length - 1; i++) { const cum = len(cur[0].slice(0, i + 1)) / len(cur[0]); if (cur[1] >= cum - .001) passed.add(cur[0][i]); }
    Object.entries(pts).forEach(([k, [x, y]]) => {
      if (k === 'D') { rr(x - 24, y - 24, 48, 48, 8, COL.panel2, COL.white, 3); tx('M', x, y, 24, COL.white, 'center', 'bold'); tx('Magazyn', x, y + 42, 17, COL.mute, 'center'); return; }
      const ok = passed.has(k);
      circ(x, y, 22, ok ? COL.lime : COL.bg, ok ? COL.lime : COL.white, 3);
      tx(k, x, y, 22, ok ? COL.ink : COL.white, 'center', 'bold');
      tx(win[k], x, y + 40, 17, COL.mute, 'center');
    });
    // panel
    rr(790, 92, 322, 552, 14, COL.panel, COL.line);
    tx('Trasa dnia', 814, 120, 21, COL.lime, 'left', 'bold');
    const second = t >= A2 - .2, L = second ? L2 : L1, p = second ? p2 : p1;
    tx('Długość trasy', 814, 190, 19, COL.mute);
    tx(Math.round(L * KM * p) + ' km', 814, 240, 52, second ? COL.lime : COL.white, 'left', 'bold');
    tx('Okna czasowe', 814, 330, 19, COL.mute);
    const okW = second ? (p2 > .95 ? 5 : Math.round(p2 * 5)) : (p1 > .95 ? 3 : Math.round(p1 * 3));
    tx(okW + '/5', 814, 376, 40, (second && okW === 5) ? COL.lime : (!second && p1 > .95 ? COL.red : COL.white), 'left', 'bold');
    if (!second && t > B1 + .1) alpha(eo(seg(t, B1 + .1, B1 + .4)), () => {
      tx('Za długo i dwa spóźnienia', 814, 440, 19, COL.red, 'left', 'bold'); tx('Spróbuj jeszcze raz', 814, 470, 19, COL.mute);
    });
    if (second && t > B2) alpha(eo(seg(t, B2, B2 + .3)), () => {
      const sv = Math.round((L1 - L2) * KM);
      tx('-' + sv + ' km  (-' + Math.round((L1 - L2) / L1 * 100) + '%)', 814, 440, 24, COL.lime, 'left', 'bold');
      tx('Wszystkie okna zachowane', 814, 472, 19, COL.mute);
    });
    // ciężarówka
    if (t >= TR[0]) {
      const [x, y] = head(r2, seg(t, TR[0], TR[1]));
      rr(x - 22, y - 13, 32, 26, 5, COL.white, COL.ink, 2); rr(x + 10, y - 9, 16, 22, 4, COL.lime, COL.ink, 2);
    }
    cursor(keys, clicks, t);
  }
  G.push({ n: 5, title: 'Trasa dnia', tag: 'Spedycja: planowanie trasy', dur: 20,
    rule: 'Połącz punkty tak, by trasa była krótka i zdążyła w oknach', fn: draw,
    caps: [[1.4, 8.8, 'Narysuj trasę przez wszystkie punkty'], [8.8, 15, 'Druga próba: krócej i bez spóźnień'], [15, 17.7, 'Ciężarówka jedzie Twoją trasą']],
    out: ['Zaoszczędzone kilometry', 'Tak liczy się dobre planowanie'] });
})();

// ---------- GRA 6: Magazynier ----------
(function () {
  const racks = [110, 270, 430, 590].map(x => ({ x, y: 150, w: 70, h: 330 }));
  const aisle = [225, 385, 545];
  const items = [
    { code: 'A-12', name: 'Karton A-12', x: 545, y: 380 },
    { code: 'C-07', name: 'Paleta C-07', x: 545, y: 250 },
    { code: 'B-31', name: 'Skrzynka B-31', x: 385, y: 230 },
    { code: 'D-02', name: 'Zgrzewka D-02', x: 225, y: 200 },
    { code: 'E-19', name: 'Karton E-19', x: 225, y: 420 }
  ];
  const path = [[690, 590], [690, 540], [545, 540], [545, 380], [545, 250], [545, 120], [385, 120], [385, 230], [385, 120], [225, 120], [225, 200], [225, 420], [225, 540], [690, 540], [690, 590]];
  const pickAt = [3, 4, 7, 10, 11]; // indeks punktu trasy, w którym zbieramy
  const pickPts = [[545, 380], [545, 250], [385, 230], [225, 200], [225, 420]];
  const T0 = 1.8, T1 = 17.0;
  // długości
  const seglen = []; let tot = 0;
  for (let i = 1; i < path.length; i++) { const d = Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]); seglen.push(d); tot += d; }
  // czas z postojami na zbieranie
  const STOP = .55; const times = [T0]; let moveT = (T1 - T0 - STOP * 5);
  pickAt.forEach(() => { });
  const stopSet = new Set([3, 4, 7, 10, 11]);
  path.forEach((_, i) => { if (i === 0) return; times.push(times[i - 1] + seglen[i - 1] / tot * moveT + (stopSet.has(i) ? STOP : 0)); });
  const pickT = i => times[pickAt[i]] - STOP + .1;
  const pos = t => {
    if (t <= times[0]) return path[0];
    for (let i = 1; i < path.length; i++) {
      if (t < times[i]) {
        const a = times[i - 1], dur = times[i] - a - (stopSet.has(i) ? STOP : 0);
        const k = clamp((t - a) / dur); return [lerp(path[i - 1][0], path[i][0], k), lerp(path[i - 1][1], path[i][1], k)];
      }
    }
    return path[path.length - 1];
  };
  function draw(t) {
    rr(40, 92, 720, 552, 14, COL.panel, COL.line);
    racks.forEach(r => {
      rr(r.x, r.y, r.w, r.h, 6, COL.panel2, COL.line);
      for (let k = 1; k < 6; k++) ln(r.x, r.y + k * r.h / 6, r.x + r.w, r.y + k * r.h / 6, COL.line, 1);
    });
    ['A', 'B', 'C', 'D'].forEach((l, i) => tx(l, racks[i].x + 35, racks[i].y - 18, 20, COL.mute, 'center', 'bold'));
    rr(620, 560, 140, 60, 10, COL.panel2, COL.lime, 2); tx('Pakowanie', 690, 590, 17, COL.lime, 'center', 'bold');
    items.forEach((it, i) => {
      if (t >= pickT(i)) return;
      const hot = (i === 0 ? true : t >= pickT(i - 1));
      rr(it.x - 14, it.y - 14, 28, 28, 6, hot ? COL.lime : COL.amber, COL.ink, 2);
    });
    // zebrany towar na wózku
    const [px, py] = pos(t);
    const got = items.filter((_, i) => t >= pickT(i)).length;
    rr(px - 17, py - 17, 34, 34, 17, COL.white, COL.ink, 3); circ(px, py, 6, COL.ink);
    for (let k = 0; k < got; k++) rr(px - 30 + k * 11, py + 22, 10, 10, 2, COL.lime, COL.ink, 1);
    // panel zamówienia
    rr(790, 92, 322, 552, 14, COL.panel, COL.line);
    tx('Zamówienie nr 4471', 814, 120, 21, COL.lime, 'left', 'bold');
    items.forEach((it, i) => {
      const done = t >= pickT(i), y = 176 + i * 62;
      rr(806, y - 24, 290, 50, 10, done ? 'rgba(195,235,100,.12)' : COL.bg, done ? COL.lime : COL.line);
      tx(it.name, 824, y, 19, done ? COL.lime : COL.white, 'left', 'bold');
      if (done) tick(1068, y, 11);
    });
    let steps = 0; { const d = (() => { let s = 0; for (let i = 1; i < path.length; i++) { if (t >= times[i]) s += seglen[i - 1]; else if (t > times[i - 1]) s += seglen[i - 1] * clamp((t - times[i - 1]) / (times[i] - times[i - 1])); } return s; })(); steps = Math.round(d / 32); }
    tx('Kroki', 814, 524, 19, COL.mute); tx(String(steps), 814, 566, 40, COL.white, 'left', 'bold');
    tx('rekord dnia 72', 1096, 566, 19, COL.mute, 'right');
    if (t > 17.1) alpha(eo(seg(t, 17.1, 17.4)), () => tx('Zamówienie skompletowane', 814, 620, 19, COL.lime, 'left', 'bold'));
    tx('sterowanie: strzałki lub dotyk', 400, 630, 17, COL.mute, 'center');
  }
  G.push({ n: 6, title: 'Magazynier', tag: 'Magazyn: kompletacja zamówień', dur: 20, introT: 1.4,
    rule: 'Zbierz wszystko z listy najkrótszą drogą', fn: draw,
    caps: [[1.4, 9, 'Zbierz towar z listy, nie zawracaj bez potrzeby'], [9, 17, 'Im mniej kroków, tym wyższy wynik'], [17, 17.6, '']],
    out: [Math.round(tot / 32) + ' kroków: nowy rekord dnia', 'Tak oszczędza się czas na magazynie'] });
})();
