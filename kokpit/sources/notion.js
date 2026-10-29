require('./env');

const BASE = process.env.NOTION_API_BASE || 'https://api.notion.com';
// Tasks Tracker (data source). Nadpisz w .env, jeśli używasz innej bazy.
const TASKS_DS = process.env.NOTION_TASKS_DS || '1fde214f-3164-8002-8e37-000b88ac147a';

const connected = () => Boolean(process.env.NOTION_TOKEN);

async function query(dataSourceId, body) {
  const r = await fetch(`${BASE}/v1/data_sources/${dataSourceId}/query`, {
    method: 'POST',
    headers: {
      authorization: 'Bearer ' + process.env.NOTION_TOKEN,
      'notion-version': '2025-09-03',
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.message || 'Notion API ' + r.status);
  return j;
}

const text = (p) => (p?.title || p?.rich_text || []).map((t) => t.plain_text).join('');
const choice = (p) => p?.status?.name || p?.select?.name || '';

// Otwarte zadania z Tasks Tracker, od najbliższego terminu. Cache 60 s, żeby kilka cegiełek nie odpytywało Notion osobno.
let cache = { at: 0, rows: null };
async function openTasks() {
  if (cache.rows && Date.now() - cache.at < 60000) return cache.rows;
  const rows = [];
  let cursor;
  do {
    const j = await query(TASKS_DS, {
      page_size: 100,
      start_cursor: cursor,
      sorts: [{ property: 'Due date', direction: 'ascending' }]
    });
    for (const page of j.results) {
      const p = page.properties;
      const status = choice(p['Status']);
      if (status === 'Done') continue;
      rows.push({
        id: page.id,
        name: text(p['Task name']) || '(bez nazwy)',
        status,
        priority: choice(p['Priority']),
        due: p['Due date']?.date?.start?.slice(0, 10) || '',
        url: page.url
      });
    }
    cursor = j.has_more ? j.next_cursor : undefined;
  } while (cursor && rows.length < 400);
  cache = { at: Date.now(), rows };
  return rows;
}

module.exports = { connected, openTasks };
