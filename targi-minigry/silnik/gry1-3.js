// GRY 1-3: nauka iSPEED (schematy, nie zrzuty z systemu)

// ---------- GRA 1: Pierwsze zlecenie ----------
(function () {
  const items = [
    { lab: 'Załadunek:', val: 'Poznań, 12.11, 8:00', field: 'Załadunek', t0: 2.2 },
    { lab: 'Rozładunek:', val: 'Gdańsk, 12.11, 16:00', field: 'Rozładunek', t0: 4.9 },
    { lab: 'Towar:', val: '24 palety EUR', field: 'Towar', t0: 7.6 },
    { lab: 'Stawka:', val: '1 850 PLN', field: 'Stawka', t0: 10.3 }
  ];
  const mailY = i => 300 + i * 70, fieldY = i => 160 + i * 92;
  const SAVE = [886, 590, 200, 46], tSave = 15.4;
  let keys = [[0, 330, 610]], clicks = [];
  items.forEach((it, i) => {
    it.cx = 64 + tw(it.lab, 21) + 12 + tw(it.val, 21, 'bold') / 2; it.cy = mailY(i);
    it.fx = 840; it.fy = fieldY(i) + 49;
    keys.push([it.t0, it.cx, it.cy], [it.t0 + .35, it.cx, it.cy], [it.t0 + 1.5, it.fx, it.fy], [it.t0 + 1.8, it.fx, it.fy]);
    clicks.push(it.t0 + .35); it.pick = it.t0 + .35; it.drop = it.t0 + 1.5;
  });
  keys.push([13.3, 900, 560], [tSave, SAVE[0] + 100, SAVE[1] + 23]); clicks.push(tSave);

  function draw(t) {
    // e-mail
    rr(40, 92, 490, 552, 14, COL.panel, COL.line);
    tx('E-mail', 64, 120, 21, COL.lime, 'left', 'bold');
    const rem = t >= tSave ? Math.max(0, 60 - Math.round(tSave * 2.4)) : Math.max(0, 60 - Math.round(t * 2.4));
    tx('Czas 0:' + String(rem).padStart(2, '0'), 506, 120, 21, COL.amber, 'right', 'bold');
    tx('Od: dyspozycja@transport-pol.pl', 64, 154, 17, COL.mute);
    tx('Temat: Zlecenie transportowe 12.11', 64, 180, 17, COL.mute);
    ln(64, 200, 506, 200, COL.line);
    tx('Dzień dobry, proszę o transport:', 64, 244, 21);
    items.forEach((it, i) => {
      const y = mailY(i), w = tw(it.val, 21, 'bold'), x = 64 + tw(it.lab, 21) + 12;
      const taken = t >= it.pick;
      tx(it.lab, 64, y, 21);
      alpha(taken ? .3 : 1, () => {
        rr(x - 8, y - 20, w + 16, 40, 8, 'rgba(195,235,100,.18)', COL.lime);
        tx(it.val, x, y, 21, COL.white, 'left', 'bold');
      });
    });
    tx('Pozdrawiam, Anna', 64, 590, 21, COL.mute);

    // formularz
    rr(570, 92, 542, 552, 14, COL.panel, COL.line);
    tx('Nowe zlecenie', 596, 120, 21, COL.lime, 'left', 'bold');
    const sc = items.filter(it => t >= it.drop).length * 250 + (t >= tSave + .1 ? 300 : 0);
    tx('Punkty ' + sc, 1090, 120, 21, COL.white, 'right', 'bold');
    items.forEach((it, i) => {
      const y = fieldY(i), filled = t >= it.drop;
      tx(it.field, 596, y + 6, 17, COL.mute);
      rr(596, y + 22, 490, 54, 10, filled ? 'rgba(195,235,100,.12)' : COL.bg, filled ? COL.lime : COL.line);
      if (filled) {
        const k = eo(seg(t, it.drop, it.drop + .3));
        alpha(k, () => { tx(it.val, 616, y + 49, 21, COL.white, 'left', 'bold'); tick(1058, y + 49, 11 * (0.6 + .4 * k), COL.lime); });
      } else if (t > 1.2 && t < it.drop && Math.abs(t - it.pick) < 9) {
        // wskazanie, które pole czeka
        if (items.findIndex(z => t < z.drop) === i) alpha(.5 + .5 * Math.sin(t * 6), () => rr(596, y + 22, 490, 54, 10, null, COL.lime, 3));
      }
    });
    // przeciągany chip
    items.forEach(it => {
      if (t >= it.pick && t < it.drop + .0) {
        const [x, y] = kpos(keys, t), w = tw(it.val, 21, 'bold') + 26;
        rr(x - w / 2, y - 22, w, 44, 10, COL.lime);
        tx(it.val, x, y, 21, COL.ink, 'center', 'bold');
      }
    });
    // Asystent
    if (t >= 12.6 && t < tSave) alpha(Math.min(seg(t, 12.6, 12.9), 1 - seg(t, tSave - .4, tSave)), () =>
      bubble(596, 524, 490, 52, 'Daty zgodne z załączonym PDF', 'z e-maila'));
    const pr = pressed(clicks, t) && t >= tSave;
    button(SAVE[0], SAVE[1], SAVE[2], SAVE[3], t >= tSave + .1 ? 'Zapisano' : 'Zapisz zlecenie', t >= tSave);
    if (t >= tSave + .1) alpha(eo(seg(t, tSave + .1, tSave + .5)), () => {
      rr(596, 524, 262, 112, 14, COL.panel2, COL.lime, 2);
      tx('Zlecenie zapisane', 727, 566, 21, COL.lime, 'center', 'bold');
      tx('przez Ciebie', 727, 596, 19, COL.mute, 'center');
    });
    cursor(keys, clicks, t);
  }
  G.push({ n: 1, title: 'Pierwsze zlecenie', tag: 'Uczy: tworzenia zlecenia z e-maila', dur: 20,
    rule: 'Przeciągnij dane z e-maila do zlecenia - na czas', fn: draw,
    caps: [[1.4, 12.4, 'Przeciągnij dane z e-maila do pól zlecenia'], [12.4, 15, 'Asystent podpowiada i pokazuje źródło'], [15, 17.7, 'Zapisujesz Ty - kliknięciem w przycisk']],
    out: ['Zlecenie w 14 sekund', 'Tak wygląda praca z iSPEED i Asystentem'] });
})();

// ---------- GRA 2: Gdzie to jest? ----------
(function () {
  const rounds = [
    { find: 'Lista zleceń', a: 1.4, b: 4.6, parent: 'Spedycja FTL', leaf: 'Zlecenia', tOpen: 2.4, tLeaf: 3.5, pts: 100 },
    { find: 'Faktury', a: 4.9, b: 8.3, parent: 'Finanse', leaf: 'Faktury', tOpen: 6.0, tLeaf: 7.2, pts: 200 }
  ];
  function layout(t) {
    const openS = t >= 2.4 && t < 4.9, openF = t >= 6.0;
    const items = []; let y = 148;
    const add = (label, lvl, open, kids) => {
      items.push({ label, lvl, y: y + (lvl ? 22 : 26), open, kid: lvl }); y += lvl ? 44 : 52;
      if (open) kids.forEach(k => { items.push({ label: k, lvl: 1, y: y + 22, kid: 1 }); y += 44; });
    };
    add('Spedycja FTL', 0, openS, ['Zlecenia', 'Plan trasy', 'Kierowcy']);
    add('Flota', 0, false, []);
    add('Finanse', 0, openF, ['Faktury', 'Rozliczenia']);
    add('Raporty', 0, false, []);
    add('Administracja', 0, false, []);
    return items;
  }
  const yOf = (t, label) => layout(t).find(i => i.label === label).y;
  const keys = [[0, 700, 560], [1.6, 700, 560], [2.3, 230, yOf(2.5, 'Spedycja FTL')], [2.5, 230, yOf(2.5, 'Spedycja FTL')],
    [3.4, 250, yOf(3.5, 'Zlecenia')], [3.6, 250, yOf(3.5, 'Zlecenia')], [5.8, 230, yOf(6.1, 'Finanse')], [6.0, 230, yOf(6.1, 'Finanse')],
    [7.1, 250, yOf(7.2, 'Faktury')], [7.3, 250, yOf(7.2, 'Faktury')], [8.5, 700, 560]];
  const clicks = [2.5, 3.6, 6.0, 7.3];
  function draw(t) {
    rr(40, 92, 360, 552, 14, COL.panel, COL.line);
    tx('Menu', 64, 118, 21, COL.lime, 'left', 'bold');
    layout(t).forEach(it => {
      const hot = (t > 2.4 && t < 2.9 && it.label === 'Spedycja FTL') || (t > 3.5 && t < 4 && it.label === 'Zlecenia') ||
        (t > 6 && t < 6.4 && it.label === 'Finanse') || (t > 7.2 && t < 7.7 && it.label === 'Faktury');
      if (it.lvl) { rr(64, it.y - 19, 312, 38, 8, hot ? COL.lime : COL.panel2); tx(it.label, 84, it.y, 20, hot ? COL.ink : COL.white); }
      else {
        rr(52, it.y - 23, 336, 46, 8, hot ? COL.lime : null);
        tx(it.label, 72, it.y, 21, hot ? COL.ink : COL.white, 'left', 'bold');
        if (it.label === 'Spedycja FTL' || it.label === 'Finanse') tx(it.open ? '-' : '+', 372, it.y, 24, hot ? COL.ink : COL.mute, 'right', 'bold');
      }
    });
    // wyzwanie
    rr(440, 92, 672, 552, 14, COL.panel, COL.line);
    const R = rounds.find(r => t >= r.a && t < r.b + .4) || rounds[1];
    const showR = t >= 1.4 && t < 8.6;
    if (showR) {
      const done = t >= R.tLeaf, rt = t - R.a;
      tx('Znajdź w menu:', 776, 170, 24, COL.mute, 'center');
      tx(R.find, 776, 250, 58, COL.white, 'center', 'bold');
      const frac = done ? 1 - (R.tLeaf - R.a) / 5 : 1 - rt / 5;
      rr(520, 320, 512, 22, 11, COL.bg, COL.line);
      rr(520, 320, 512 * clamp(frac), 22, 11, frac > .35 ? COL.lime : COL.amber);
      tx('Zostało ' + (clamp(5 - (done ? R.tLeaf - R.a : rt), 0, 5)).toFixed(1).replace('.', ',') + ' s', 776, 370, 22, COL.mute, 'center');
      if (done) alpha(eo(seg(t, R.tLeaf, R.tLeaf + .3)), () => {
        rr(560, 430, 432, 130, 16, 'rgba(195,235,100,.16)', COL.lime, 3);
        tx('Trafione!', 776, 476, 38, COL.lime, 'center', 'bold');
        tx('+' + R.pts + ' pkt  ·  Seria x' + (R === rounds[0] ? 1 : 2), 776, 530, 26, COL.white, 'center', 'bold');
      });
    }
    const total = (t >= 3.5 ? 100 : 0) + (t >= 7.2 ? 200 : 0);
    tx('Punkty ' + total, 1090, 118, 21, COL.white, 'right', 'bold');
    cursor(keys, clicks, t);
  }
  G.push({ n: 2, title: 'Gdzie to jest?', tag: 'Uczy: poruszania się po menu', dur: 10, introT: 1.2,
    rule: 'Znajdź funkcję w menu, zanim minie czas', fn: draw,
    caps: [[1.2, 4.6, 'Znajdź funkcję w menu - liczy się czas'], [4.8, 8.4, 'Kolejne pytania, rosnąca seria'], [8.4, 10, 'Poznajesz menu, nie czytając instrukcji']],
    out: null });
})();

// ---------- GRA 3: Mail kontra PDF ----------
(function () {
  const R = [
    { a: 1.4, rows: [['Zleceniodawca', 'Transport-Pol', 'Transport-Pol'], ['Załadunek', '12.11, 8:00', '13.11, 8:00'], ['Rozładunek', 'Gdańsk, 16:00', 'Gdańsk, 16:00'], ['Towar', '24 palety', '24 palety'], ['Stawka', '1 850 PLN', '1 850 PLN']], m: 1,
      msg: 'Różnica: załadunek w mailu 12.11, w PDF 13.11' },
    { a: 9.8, rows: [['Zleceniodawca', 'Eurofrach', 'Eurofrach'], ['Załadunek', 'Łódź, 3.12', 'Łódź, 3.12'], ['Rozładunek', 'Lyon, 5.12', 'Lyon, 5.12'], ['Towar', '24 palety', '28 palet'], ['Stawka', '2 400 EUR', '2 400 EUR']], m: 3,
      msg: 'Różnica: w mailu 24 palety, w PDF 28 palet' }
  ];
  const D = 8.2, rowY = i => 168 + i * 78;
  const keys = [[0, 560, 600]], clicks = [];
  R.forEach(r => {
    r.rows.forEach((row, i) => {
      const tt = r.a + .9 + i * .9; if (i > r.m) return;
      keys.push([tt, 250, rowY(i) + 32]); clicks.push(tt + .3); row.tc = tt + .3;
    });
    r.det = r.a + .9 + r.m * .9 + .3;
  });
  function draw(t) {
    const r = R.find(x => t >= x.a - .3 && t < x.a + D) || (t < 9 ? R[0] : R[1]);
    const idx = R.indexOf(r), lt = t - r.a;
    const fade = Math.min(seg(t, r.a - .3, r.a + .1), 1);
    alpha(t < 18 ? fade : 0, () => {
      [['E-mail', 40, 1], ['PDF zlecenia', 612, 2]].forEach(([title, x, col]) => {
        rr(x, 92, 500, 480, 14, COL.panel, COL.line);
        tx(title, x + 24, 120, 21, COL.lime, 'left', 'bold');
        r.rows.forEach((row, i) => {
          const y = rowY(i), seen = t >= row.tc && i <= r.m, bad = i === r.m && t >= r.det;
          const sh = bad ? Math.sin(t * 40) * 2 * (1 - seg(t, r.det, r.det + .6)) : 0;
          rr(x + 16 + sh, y, 468, 64, 10, bad ? 'rgba(255,107,94,.16)' : seen ? 'rgba(195,235,100,.1)' : COL.bg, bad ? COL.red : seen ? COL.limeD : COL.line, bad ? 3 : 2);
          tx(row[0], x + 34 + sh, y + 20, 16, COL.mute);
          tx(row[col], x + 34 + sh, y + 44, 22, bad ? COL.red : COL.white, 'left', 'bold');
        });
      });
      r.rows.forEach((row, i) => {
        const y = rowY(i) + 32, bad = i === r.m && t >= r.det;
        if (t >= row.tc && i < r.m) alpha(eo(seg(t, row.tc, row.tc + .25)), () => tick(576, y, 10));
        if (bad) { alpha(eo(seg(t, r.det, r.det + .2)), () => cross(576, y, 10)); }
      });
      const bad = t >= r.det && t < r.a + D - .1;
      if (bad) alpha(Math.min(seg(t, r.det + .2, r.det + .5), 1 - seg(t, r.a + D - .4, r.a + D - .1)), () =>
        bubble(40, 586, 780, 56, r.msg, 'z e-maila i PDF'));
      else tx('Porównaj pola i znajdź różnicę', 64, 614, 20, COL.mute);
      const sc = (t >= R[0].det ? 500 : 0) + (t >= R[1].det ? 500 : 0);
      tx('Runda ' + (idx + 1) + '/2  ·  ' + sc + ' pkt', 1112, 614, 21, COL.white, 'right', 'bold');
    });
    if (t < 18) cursor(keys, clicks, t);
  }
  G.push({ n: 3, title: 'Mail kontra PDF', tag: 'Uczy: kontroli danych i źródeł', dur: 20,
    rule: 'Znajdź różnicę między mailem a PDF-em zlecenia', fn: draw,
    caps: [[1.4, 4.6, 'Porównuj pola jedno po drugim'], [4.6, 9.2, 'Asystent wskazuje różnicę i źródło'], [9.8, 17.6, 'Kolejna runda, kolejny haczyk'], ],
    out: ['Dwie pomyłki wyłapane', 'Zanim stały się reklamacją'] });
})();
