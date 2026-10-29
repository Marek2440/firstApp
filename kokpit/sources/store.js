// Magazyn plikowy: ustawienia i szkice w .data/. Bez sieci, bez zależności.
// Docelowo do podmiany na Notion – dostęp wyłącznie przez ten moduł.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DIR = path.join(__dirname, '..', '.data');
const SETTINGS_FILE = path.join(DIR, 'settings.json');
const DRAFTS_FILE = path.join(DIR, 'drafts.json');
const DEFAULT_REFRESH = 120000;
const MAX_DRAFTS = 500;
const MAX_TEXT = 5000;
const ACTIONS = ['reply', 'add-to-notion', 'move'];
const REFRESH = ['default', 'auto', 'manual'];

const fail = (status, message) => Object.assign(new Error(message), { status });
const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

const readJson = (file) => {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return null; }
};
// Zapis atomowy: plik tymczasowy + rename.
const writeJson = (file, data) => {
  fs.mkdirSync(DIR, { recursive: true });
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, file);
};

const defaultBrick = () => ({ enabled: true, expanded: false, refresh: 'default' });

const build = (raw, brickIds) => {
  const src = isObj(raw) ? raw : {};
  const sb = isObj(src.bricks) ? src.bricks : {};
  const ms = src.refreshDefaultMs;
  const out = { refreshDefaultMs: Number.isInteger(ms) && ms >= 10000 && ms <= 3600000 ? ms : DEFAULT_REFRESH, bricks: {} };
  for (const id of brickIds) {
    const b = isObj(sb[id]) ? sb[id] : {};
    const d = defaultBrick();
    out.bricks[id] = {
      enabled: typeof b.enabled === 'boolean' ? b.enabled : d.enabled,
      expanded: typeof b.expanded === 'boolean' ? b.expanded : d.expanded,
      refresh: REFRESH.includes(b.refresh) ? b.refresh : d.refresh,
    };
  }
  return out;
};

const getSettings = (brickIds) => build(readJson(SETTINGS_FILE), brickIds);

const putSettings = (patch, brickIds) => {
  if (!isObj(patch)) throw fail(400, 'Body musi być obiektem JSON');
  for (const k of Object.keys(patch)) {
    if (k !== 'refreshDefaultMs' && k !== 'bricks') throw fail(400, `Nieznany klucz: ${k}`);
  }
  if ('refreshDefaultMs' in patch) {
    const v = patch.refreshDefaultMs;
    if (!Number.isInteger(v) || v < 10000 || v > 3600000) throw fail(400, 'refreshDefaultMs: liczba całkowita 10000..3600000');
  }
  if ('bricks' in patch) {
    if (!isObj(patch.bricks)) throw fail(400, 'bricks musi być obiektem');
    for (const [id, b] of Object.entries(patch.bricks)) {
      if (!brickIds.includes(id)) throw fail(400, `Nieznana cegiełka: ${id}`);
      if (!isObj(b)) throw fail(400, `Ustawienia cegiełki ${id} muszą być obiektem`);
      for (const [k, v] of Object.entries(b)) {
        if (k === 'enabled' || k === 'expanded') {
          if (typeof v !== 'boolean') throw fail(400, `${id}.${k} musi być typu boolean`);
        } else if (k === 'refresh') {
          if (!REFRESH.includes(v)) throw fail(400, `${id}.refresh: jedno z ${REFRESH.join(', ')}`);
        } else throw fail(400, `Nieznany klucz: ${id}.${k}`);
      }
    }
  }
  const cur = getSettings(brickIds);
  if ('refreshDefaultMs' in patch) cur.refreshDefaultMs = patch.refreshDefaultMs;
  for (const [id, b] of Object.entries(patch.bricks || {})) Object.assign(cur.bricks[id], b);
  // Zachowaj wpisy nieaktywnych id z pliku, żeby ich nie gubić.
  const old = readJson(SETTINGS_FILE);
  const keep = isObj(old) && isObj(old.bricks) ? old.bricks : {};
  writeJson(SETTINGS_FILE, { version: 1, refreshDefaultMs: cur.refreshDefaultMs, bricks: { ...keep, ...cur.bricks } });
  return cur;
};

const loadDrafts = () => {
  const d = readJson(DRAFTS_FILE);
  return d && Array.isArray(d.drafts) ? d.drafts : [];
};

const listDrafts = ({ brickId, itemId } = {}) =>
  loadDrafts()
    .filter((d) => (!brickId || d.brickId === brickId) && (!itemId || d.itemId === itemId))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0));

const addDraft = (input, brickIds) => {
  if (!isObj(input)) throw fail(400, 'Body musi być obiektem JSON');
  const { brickId, itemId, text, action, subject } = input;
  if (typeof brickId !== 'string' || !brickId) throw fail(400, 'brickId jest wymagane');
  if (!brickIds.includes(brickId)) throw fail(404, 'brak cegiełki');
  if (typeof itemId !== 'string' || !itemId || itemId.length > 200) throw fail(400, 'itemId: niepusty tekst do 200 znaków');
  if (typeof text !== 'string' || !text.trim()) throw fail(400, 'text nie może być pusty');
  if (text.length > MAX_TEXT) throw fail(400, `text: maksymalnie ${MAX_TEXT} znaków`);
  if (!ACTIONS.includes(action)) throw fail(400, `action: jedno z ${ACTIONS.join(', ')}`);
  if (subject !== undefined && (typeof subject !== 'string' || subject.length > 300)) throw fail(400, 'subject: tekst do 300 znaków');
  const drafts = loadDrafts();
  if (drafts.length >= MAX_DRAFTS) throw fail(409, `Limit ${MAX_DRAFTS} szkiców`);
  const now = new Date().toISOString();
  const draft = { id: crypto.randomUUID(), brickId, itemId, subject: subject || '', text, action, status: 'draft', sent: false, createdAt: now, updatedAt: now };
  drafts.push(draft);
  writeJson(DRAFTS_FILE, { version: 1, drafts });
  return draft;
};

const deleteDraft = (id) => {
  const drafts = loadDrafts();
  const rest = drafts.filter((d) => d.id !== id);
  if (rest.length === drafts.length) return false;
  writeJson(DRAFTS_FILE, { version: 1, drafts: rest });
  return true;
};

module.exports = { getSettings, putSettings, listDrafts, addDraft, deleteDraft };
