// GRY 7-10: rampy, dyspozytor, przetarg, sortownia

// ---------- GRA 7: Rampa ----------
(function () {
  const RX = [40, 316, 592, 868], RW = 244, RY = 170;
  const T = [
    { id: 'PO 4821', ty: 'Rozładunek', ap: .5, pick: 2.2, ramp: 0, busy: 4.0 },
    { id: 'WA 7710', ty: 'Załadunek', ap: 1.0, pick: 3.6, ramp: 1, busy: 4.5 },
    { id: 'GD 3392', ty: 'Rozładunek', ap: 1.8, pick: 5.0, ramp: 2, busy: 3.5 },
    { id: 'KR 1180', ty: 'Załadunek', ap: 2.6, pick: 6.4, ramp: 3, busy: 4.0 },
    { id: 'LU 5567', ty: 'Rozładunek', ap: 4.5, pick: 7.8, ramp: 0, busy: 3.5 },
    { id: 'SZ 2204', ty: 'Rozładunek', ap: 6.0, pick: 9.4, ramp: 1, busy: 3.5 },
    { id: 'BI 9031', ty: 'Załadunek', ap: 8.0, pick: 11.0, ramp: 2, busy: 3.0 },
    { id: 'RA 6150', ty: 'Rozładunek', ap: 9.0, pick: 12.6, ramp: 3, busy: 3.0 },
    { id: 'TC 2025', ty: 'Załadunek', ap: 11.0, pick: 14.2, ramp: 0, busy: 3.0 }
  ];
  const slotPos = i => [150 + i * 190, 520];
  const rampPos = r => [RX[r] + RW / 2 + 10, RY + 50];
  const clock = tt => { const m = 8 * 60 + Math.round(tt * 6); return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); };
  T.forEach(k => { k.drop = k.pick + .8; k.done = k.drop + k.busy; });
  const keys = [[0, 560, 640]], clicks = [];
  T.forEach(k => {
    const s = waitSlot(k, k.pick - .01), r = rampPos(k.ramp);
    k.sp = slotPos(s);
    keys.push([k.pick - .35, k.sp[0], k.sp[1]], [k.pick, k.sp[0], k.sp[1]], [k.drop, r[0], r[1]]);
    clicks.push(k.pick);
  });
  function waitSlot(k, t) {
    const w = T.filter(x => x.ap <= t && x.pick > t).sort((a, b) => a.ap - b.ap);
    return Math.max(0, w.indexOf(k));
  }
  function truck(x, y, k, ring, a = 1) {
    alpha(a, () => {
      rr(x - 74, y - 32, 112, 64, 8, COL.panel2, COL.white, 3);
      rr(x + 40, y - 22, 40, 50, 8, COL.lime, COL.ink, 2);
      tx(k.id, x - 18, y - 8, 19, COL.white, 'center', 'bold');
      tx(k.ty, x - 18, y + 16, 15, COL.mute, 'center');
      if (ring !== null) {
        circ(x - 54, y - 50, 16, COL.bg, COL.line, 3);
        g.beginPath(); g.arc(x - 54, y - 50, 16, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ring);
        g.strokeStyle = ring > .35 ? COL.lime : ring > .15 ? COL.amber : COL.red; g.lineWidth = 5; g.stroke();
      }
    });
  }
  function draw(t) {
    // rampy
    tx('Zegar ' + clock(t), 40, 118, 24, COL.lime, 'left', 'bold');
    for (let r = 0; r < 4; r++) {
      const busy = T.find(k => k.ramp === r && t >= k.drop && t < k.done);
      rr(RX[r], RY - 30, RW, 190, 12, COL.panel, busy ? COL.amber : COL.lime, 3);
      tx('Rampa ' + (r + 1), RX[r] + 16, RY - 8, 20, busy ? COL.amber : COL.lime, 'left', 'bold');
      if (!busy) tx('wolna', RX[r] + RW - 16, RY - 8, 18, COL.lime, 'right');
    }
    // trasa doładunku
    T.forEach(k => {
      if (t >= k.drop && t < k.done) {
        const [x, y] = rampPos(k.ramp), pr = (t - k.drop) / k.busy;
        truck(x, y, k, null);
        rr(RX[k.ramp] + 16, RY + 118, RW - 32, 14, 7, COL.bg, COL.line); rr(RX[k.ramp] + 16, RY + 118, (RW - 32) * pr, 14, 7, COL.amber);
      } else if (t >= k.done) {
        const e = seg(t, k.done, k.done + .7);
        if (e < 1) { const [x, y] = rampPos(k.ramp); truck(x, y - e * 160, k, null, 1 - e); }
      }
    });
    // kolejka
    rr(40, 400, 1072, 230, 14, COL.panel, COL.line);
    tx('Kolejka na dziedzińcu', 64, 424, 19, COL.mute);
    T.forEach(k => {
      if (t < k.ap || t >= k.pick + .01 && t >= k.drop) return;
      const s = waitSlot(k, Math.min(t, k.pick - .01)); let [x, y] = slotPos(s);
      const ring = clamp(1 - (Math.min(t, k.pick) - k.ap) / 9);
      if (t >= k.pick) { const r = rampPos(k.ramp), e = ease(seg(t, k.pick, k.drop)); x = lerp(x, r[0], e); y = lerp(y, r[1], e); truck(x, y, k, null); return; }
      truck(x, y + 6, k, ring, eo(seg(t, k.ap, k.ap + .3)));
    });
    const used = T.filter(k => t >= k.drop).length;
    tx('Obsłużone ' + T.filter(k => t >= k.done).length + '  ·  spóźnienia 0', 1112, 118, 21, COL.white, 'right', 'bold');
    cursor(keys, clicks, t);
  }
  G.push({ n: 7, title: 'Rampa', tag: 'Magazyn: okna dostaw i rampy', dur: 20, introT: 1.4,
    rule: 'Wpuść ciężarówki na wolne rampy, zanim miną ich okna', fn: draw,
    caps: [[1.4, 8, 'Przeciągnij auto na wolną rampę'], [8, 15, 'Pilnuj okien czasowych: pierścień się kurczy'], [15, 17.8, 'Wszystkie rampy pracują']],
    out: ['9 ciężarówek, 0 spóźnień', 'Rampy wykorzystane w pełni'] });
})();

// ---------- GRA 8: Dyspozytor 112 ----------
(function () {
  const rows = [
    { name: 'Trasa 1', rt: 'Poznań → Berlin', eta: '14:20', v: .045, off: .1 },
    { name: 'Trasa 2', rt: 'Łódź → Praga', eta: '15:10', v: .04, off: .25 },
    { name: 'Trasa 3', rt: 'Gdańsk → Hamburg', eta: '16:05', v: .035, off: .05 },
    { name: 'Trasa 4', rt: 'Wrocław → Wiedeń', eta: '15:40', v: .04, off: .3 }
  ];
  const RY = i => 200 + i * 104;
  const E1 = 3.0, A1c = 4.6, SUG = 5.4, PICK1 = 8.2, E2 = 11.2, A2c = 12.6, SEND = 17.0;
  const keys = [[0, 500, 620], [A1c - .5, 640, RY(1) + 45], [A1c, 640, RY(1) + 45], [PICK1 - .6, 1050, 340], [PICK1, 1050, 340],
    [A2c - .5, 640, RY(3) + 45], [A2c, 640, RY(3) + 45], [SEND - .6, 1010, 575], [SEND, 1010, 575], [SEND + 1, 600, 620]];
  const clicks = [A1c, PICK1, A2c, SEND];
  const sat = t => t < E1 ? 100 : t < PICK1 ? lerp(100, 72, seg(t, E1, E1 + 1)) : t < E2 ? lerp(72, 93, seg(t, PICK1, PICK1 + 1)) : t < SEND ? lerp(93, 80, seg(t, E2, E2 + 1)) : lerp(80, 94, seg(t, SEND, SEND + 1));
  function draw(t) {
    // satysfakcja
    tx('Zadowolenie klientów', 40, 118, 21, COL.mute);
    rr(290, 104, 320, 26, 13, COL.bg, COL.line); const s = sat(t);
    rr(290, 104, 320 * s / 100, 26, 13, s > 85 ? COL.lime : s > 75 ? COL.amber : COL.red);
    tx(Math.round(s) + '%', 630, 118, 24, COL.white, 'left', 'bold');
    rr(40, 150, 740, 494, 14, COL.panel, COL.line);
    rows.forEach((r, i) => {
      const y = RY(i);
      tx(r.name + '  ' + r.rt, 64, y - 30, 20, COL.white, 'left', 'bold');
      ln(70, y + 10, 740, y + 10, COL.line, 4);
      let stuck = (i === 1 && t >= E1 && t < PICK1 + .3) ? true : (i === 3 && t >= E2) ? 'slow' : false;
      const sp = (i === 3 && t >= E2) ? r.v * .35 : r.v;
      let f = (r.off + t * sp) % 1; if (i === 1 && t >= E1) f = (r.off + E1 * sp + (t >= PICK1 + .3 ? (t - PICK1 - .3) * sp : 0)) % 1;
      const x = 70 + f * 670, col = (i === 1 && t >= E1 && t < PICK1 + .3) ? COL.red : COL.lime;
      rr(x - 20, y - 8, 28, 28, 6, col, COL.ink, 2); rr(x + 8, y - 4, 14, 24, 4, COL.white, COL.ink, 2);
      // ETA
      let eta = 'ETA ' + r.eta, c = COL.lime, mark = 'ok';
      if (i === 1) { if (t >= PICK1 + .3) eta = 'ETA 15:25'; else if (t >= E1) { eta = 'ETA +2 h'; c = COL.red; mark = 'x'; } }
      if (i === 3 && t >= E2) { eta = t >= SEND + .2 ? 'ETA 17:10 · klient wie' : 'ETA 17:10 (+90 min)'; c = t >= SEND + .2 ? COL.lime : COL.amber; mark = t >= SEND + .2 ? 'ok' : 'w'; }
      const w = tw(eta, 18, 'bold') + 56;
      rr(760 - w, y - 54, w, 34, 10, COL.bg, c, 2); tx(eta, 760 - w + 14, y - 37, 18, c, 'left', 'bold');
      if (mark === 'ok') { tick(760 - 20, y - 37, 8, c, 3); }
      // alerty
      if (i === 1 && t >= E1 && t < PICK1 + .3) alpha(.75 + .25 * Math.sin(t * 9), () => { rr(560, y + 28, 160, 34, 10, COL.red); tx('Awaria opony', 640, y + 45, 19, COL.white, 'center', 'bold'); });
      if (i === 3 && t >= E2 && t < SEND) alpha(.75 + .25 * Math.sin(t * 9), () => { rr(560, y + 28, 160, 34, 10, COL.amber); tx('Korek A2 +90', 640, y + 45, 19, COL.ink, 'center', 'bold'); });
    });
    // panel decyzji
    rr(810, 150, 302, 494, 14, COL.panel, COL.line);
    tx('Panel decyzji', 830, 178, 20, COL.lime, 'left', 'bold');
    const ev1 = t >= A1c && t < E2 - .1, ev2 = t >= A2c;
    if (!ev1 && !ev2) tx('Czekam na zdarzenie...', 960, 400, 19, COL.mute, 'center');
    if (ev1) {
      tx('Pojazd zastępczy', 830, 214, 19, COL.mute);
      const cs = [['Trans-Max', '38 km'], ['Nord Cargo', '120 km'], ['Kuba-Trans', '210 km']];
      cs.forEach(([n, d], i) => {
        const y = 240 + i * 66, rec = i === 0 && t >= SUG, chosen = i === 0 && t >= PICK1;
        rr(826, y, 270, 56, 10, chosen ? 'rgba(195,235,100,.18)' : COL.bg, rec ? COL.lime : COL.line, rec ? 3 : 2);
        tx(n, 842, y + 28, 19, COL.white, 'left', 'bold'); tx(d, 1080, y + 28, 19, COL.mute, 'right');
      });
      if (t >= SUG) alpha(eo(seg(t, SUG, SUG + .3)), () => {
        rr(826, 448, 270, 100, 12, COL.panel2, COL.lime, 2); spark(850, 476, 10);
        tx('Najbliżej: Trans-Max', 872, 476, 17, COL.white, 'left', 'bold');
        tx('(38 km, wolny)', 842, 504, 17, COL.white); tx('źródło: pozycja z mSPEED', 842, 530, 15, COL.mute);
      });
      button(826, 568, 270, 50, t >= PICK1 ? 'Wybrano' : 'Wybierz', t >= PICK1);
    }
    if (ev2) {
      tx('Powiadom klienta', 830, 214, 19, COL.mute);
      alpha(eo(seg(t, A2c, A2c + .4)), () => {
        rr(826, 240, 270, 230, 12, COL.bg, COL.line);
        spark(850, 266, 10); tx('Szkic Asystenta', 872, 266, 17, COL.lime, 'left', 'bold');
        ['Dzień dobry, dostawa', 'opóźni się o 90 min', '(korek na A2).', 'Nowy ETA: 17:10.'].forEach((l, i) => tx(l, 842, 308 + i * 30, 17, COL.white));
        tx('źródło: dane trasy mSPEED', 842, 446, 15, COL.mute);
      });
      if (t >= A2c + .6) button(826, 568, 270, 50, t >= SEND ? 'Wysłano przez Ciebie' : 'Wyślij', t >= SEND);
    }
    cursor(keys, clicks, t);
  }
  G.push({ n: 8, title: 'Dyspozytor 112', tag: 'Spedycja: reagowanie na zdarzenia', dur: 20, introT: 1.4,
    rule: 'Reaguj na awarie i korki, zanim klient się zdenerwuje', fn: draw,
    caps: [[1.4, 3.0, 'Cztery trasy, wszystko w terminie'], [3.0, 10, 'Awaria! Asystent podpowiada, Ty wybierasz'], [10, 17.4, 'Korek: szkic wiadomości, wysyłasz Ty']],
    out: ['94% zadowolenia klientów', 'Dwie sprawy rozwiązane w 15 sekund'] });
})();

// ---------- GRA 9: Przetarg ----------
(function () {
  const offers = [
    { n: 'Szybki Trans', price: 3900, ot: 82, oc: false, a: 2.0, dir: -1, why: 'Za ryzykowne' },
    { n: 'Mega Cargo', price: 5600, ot: 99, oc: true, a: 3.9, dir: -1, why: 'Za drogo' },
    { n: 'Trans-Alp', price: 4120, ot: 98, oc: true, a: 5.8, dir: 1, why: 'Najlepsza oferta' }
  ];
  const cx = 576, cy = 330;
  const keys = [[0, 800, 620], [1.7, 640, 360], [2.0, 640, 360], [2.8, 150, 400], [3.5, 640, 360], [3.9, 640, 360], [4.7, 150, 400], [5.4, 640, 360], [5.8, 640, 360], [6.6, 1020, 400], [7.5, 900, 600]];
  const clicks = [2.0, 3.9, 5.8];
  function card(x, y, o, rot, a) {
    g.save(); g.translate(x, y); g.rotate(rot); g.globalAlpha *= a;
    rr(-190, -130, 380, 260, 18, COL.panel, COL.white, 3);
    tx(o.n, -164, -96, 28, COL.white, 'left', 'bold');
    tx(o.price.toLocaleString('pl-PL').replace(/ /g, ' ') + ' PLN', -164, -40, 42, COL.lime, 'left', 'bold');
    tx('Terminowość ' + o.ot + '%', -164, 20, 21, o.ot < 90 ? COL.red : COL.white);
    tx(o.oc ? 'Ubezpieczenie OC: jest' : 'Ubezpieczenie OC: brak', -164, 58, 21, o.oc ? COL.white : COL.red);
    g.restore();
  }
  function draw(t) {
    tx('Poznań → Mediolan  ·  24 palety  ·  dostawa do 14.11', 576, 118, 22, COL.white, 'center', 'bold');
    ['Cena', 'Terminowość', 'Ubezpieczenie'].forEach((l, i) => { const x = 330 + i * 190; rr(x - 80, 150, 160, 34, 17, COL.panel2, COL.lime, 2); tx(l, x, 167, 17, COL.lime, 'center', 'bold'); });
    // lewa i prawa strefa
    tx('ODRZUĆ', 150, 250, 22, COL.red, 'center', 'bold'); tx('WYBIERZ', 1020, 250, 22, COL.lime, 'center', 'bold');
    ln(150, 280, 150, 560, COL.red, 3); ln(1020, 280, 1020, 560, COL.lime, 3);
    offers.forEach((o, i) => {
      const prevGone = i === 0 ? 0 : offers[i - 1].a + .9;
      if (t < 1.4) return;
      const p = seg(t, o.a + .0, o.a + .9), vis = t < o.a + 1.9;
      if (!vis) return;
      const enter = i === 0 ? eo(seg(t, 1.2, 1.7)) : t >= offers[i - 1].a + .7 ? eo(seg(t, offers[i - 1].a + .7, offers[i - 1].a + 1.4)) : 0;
      if (enter <= 0 && i > 0) return;
      let x = cx, y = cy + (1 - enter) * 40, rot = 0, a = enter;
      const [kx, ky] = kpos(keys, t);
      if (t >= o.a && t < o.a + .9) { const e = ease(p); x = lerp(cx, cx + o.dir * 460, e); rot = o.dir * e * .25; y = cy + e * 40; a = 1 - e * .3; }
      else if (t >= o.a + .9) { x = cx + o.dir * 460; rot = o.dir * .25; a = 1 - seg(t, o.a + .9, o.a + 1.4); y = cy + 40; }
      card(x, y, o, rot, a);
      if (t >= o.a + .3 && t < o.a + 1.9) alpha(1 - seg(t, o.a + 1.4, o.a + 1.9), () => {
        const good = o.dir > 0; rr(cx - 140, 520, 280, 56, 12, good ? COL.lime : COL.red);
        tx(o.why, cx, 548, 24, COL.ink, 'center', 'bold');
      });
    });
    tx('Punkty ' + ((t >= 2.9 ? 100 : 0) + (t >= 4.8 ? 100 : 0) + (t >= 6.7 ? 500 : 0)), 1112, 118, 21, COL.lime, 'right', 'bold');
    cursor(keys, clicks, t);
  }
  G.push({ n: 9, title: 'Przetarg', tag: 'Spedycja: wybór przewoźnika', dur: 10, introT: 1.2,
    rule: 'Przesuń ofertę: tanio, ale bezpiecznie', fn: draw,
    caps: [[1.2, 5.6, 'Przesuwaj oferty przewoźników'], [5.6, 7.2, 'Nie zawsze wygrywa najniższa cena'], [7.2, 10, 'Wybierasz mądrze, nie tylko tanio']],
    out: null });
  // wynik w ostatnich sekundach
  const Gm = G[G.length - 1], base = Gm.fn;
  Gm.fn = t => {
    base(t);
    if (t > 7.3) alpha(eo(seg(t, 7.3, 7.7)), () => {
      rr(176, 300, 800, 260, 18, 'rgba(20,23,26,.94)', COL.lime, 3);
      tx('Wybrano: Trans-Alp', 576, 350, 38, COL.white, 'center', 'bold');
      tx('4 120 PLN  ·  98% na czas  ·  z OC', 576, 408, 26, COL.lime, 'center', 'bold');
      tx('1 480 PLN taniej niż najdroższa oferta', 576, 466, 24, COL.white, 'center');
      tx('Cena to nie wszystko', 576, 516, 22, COL.mute, 'center');
    });
  };
})();

// ---------- GRA 10: Sortownia ----------
(function () {
  const BIN = [
    { k: 'cold', name: 'Chłodnia', col: COL.blue, x: 200 },
    { k: 'adr', name: 'ADR', col: COL.amber, x: 430 },
    { k: 'glass', name: 'Delikatne', col: COL.pink, x: 660 },
    { k: 'std', name: 'Standard', col: COL.mute, x: 890 }
  ];
  const LAB = { cold: '-18°C', adr: 'ADR 3', glass: 'SZKŁO', std: 'KARTON' };
  const seq = ['std', 'cold', 'adr', 'glass', 'std', 'cold', 'adr', 'glass', 'std', 'cold'];
  const WRONG = 6; // numer paczki posortowanej błędnie
  const V = 230, PX = 420; let sp = .6;
  const P = seq.map((k, i) => {
    const o = { k, sp, put: k === 'std' && i === WRONG ? 'adr' : k }; if (i === WRONG) o.put = 'std';
    o.hit = sp + (PX + 70) / V; o.fly = .45; sp += [.9, .85, .8, .75, .7, .65, .65, .6, .6, .6][i]; return o;
  });
  const bx = k => BIN.find(b => b.k === k).x;
  const keys = [[0, 800, 560]], clicks = [];
  P.forEach((p, i) => {
    p.tx = bx(p.put); p.ty = 520;
    keys.push([p.hit - .12, PX, 300], [p.hit, PX, 300], [p.hit + p.fly, p.tx, 520]); clicks.push(p.hit);
  });
  // błędna paczka: trafia w niewłaściwy kosz
  P[WRONG].k = 'adr'; P[WRONG].put = 'std';
  function parcel(x, y, k, a = 1, sc = 1) {
    alpha(a, () => {
      g.save(); g.translate(x, y); g.scale(sc, sc);
      rr(-62, -42, 124, 84, 10, '#b88b4e', COL.ink, 3);
      rr(-50, -18, 100, 36, 6, COL.white); tx(LAB[k], 0, 0, 20, COL.ink, 'center', 'bold');
      g.restore();
    });
  }
  function draw(t) {
    // taśma
    rr(40, 190, 1072, 190, 14, COL.panel, COL.line);
    tx('Taśma', 64, 214, 17, COL.mute);
    for (let i = 0; i < 24; i++) { const x = ((i * 50 + t * V) % 1250); ln(x - 60, 340, x - 40, 340, COL.line, 3); }
    ln(40, 310, 1112, 310, COL.line, 1);
    let score = 0, combo = 0, lives = 3, best = 0;
    P.forEach((p, i) => {
      const ok = p.k === p.put;
      if (t >= p.hit + p.fly) { if (ok) { combo++; score += 100 * Math.min(combo, 5); best = Math.max(best, combo); } else { combo = 0; lives--; } }
    });
    P.forEach(p => {
      if (t < p.sp) return;
      if (t < p.hit) { parcel(-70 + (t - p.sp) * V, 300, p.k); return; }
      if (t < p.hit + p.fly) { const e = ease((t - p.hit) / p.fly), x = lerp(PX, p.tx, e), y = lerp(300, 520, e) - Math.sin(e * Math.PI) * 60; parcel(x, y, p.k, 1, 1 - e * .3); }
      else {
        const ok = p.k === p.put, d = t - p.hit - p.fly;
        if (d < .6) { parcel(p.tx, 520 - 10, p.k, 1 - seg(d, .1, .6), .7); if (!ok) alpha(1 - seg(d, .3, .6), () => { cross(p.tx, 470, 24, COL.red, 7); tx('Błąd! -1 życie', p.tx, 420, 24, COL.red, 'center', 'bold'); }); else alpha(1 - seg(d, .1, .6), () => tx('+' + (100 * Math.min(combo, 5)), p.tx, 440 - d * 30, 26, COL.lime, 'center', 'bold')); }
      }
    });
    BIN.forEach(b => {
      g.beginPath(); g.moveTo(b.x - 100, 480); g.lineTo(b.x + 100, 480); g.lineTo(b.x + 80, 610); g.lineTo(b.x - 80, 610); g.closePath();
      g.fillStyle = COL.panel; g.fill(); g.strokeStyle = b.col; g.lineWidth = 4; g.stroke();
      tx(b.name, b.x, 640 - 10, 24, b.col, 'center', 'bold'); tx(LAB[b.k], b.x, 548 + 20, 19, b.col, 'center');
    });
    tx('Punkty ' + score, 40, 118, 24, COL.white, 'left', 'bold');
    tx('Seria x' + combo, 330, 118, 24, COL.lime, 'left', 'bold');
    tx('Życia', 1000, 118, 21, COL.mute, 'right');
    for (let i = 0; i < 3; i++) circ(1030 + i * 30, 118, 10, i < lives ? COL.red : COL.bg, COL.red, 3);
    cursor(keys, clicks, t);
  }
  G.push({ n: 10, title: 'Sortownia', tag: 'Magazyn: sortowanie przesyłek', dur: 10, introT: 1.2,
    rule: 'Rozdziel paczki do właściwych stref, coraz szybciej', fn: draw,
    caps: [[1.2, 5, 'Rzuć każdą paczkę do właściwej strefy'], [5, 8.5, 'Błąd kosztuje życie i przerywa serię'], [8.5, 10, 'Chłodnia, ADR, szkło, standard']],
    out: null });
})();
