const notion = require('../sources/notion');

const today = () => new Date().toISOString().slice(0, 10);
const inDays = (n) => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);

// Ten sam kształt danych co cegiełki Gmaila, więc strona rysuje je tak samo.
const defs = [
  { id: 'notion-overdue',  title: 'Notion: po terminie',     pick: (t) => t.due && t.due < today(), overdue: true },
  { id: 'notion-upcoming', title: 'Notion: najbliższe 7 dni', pick: (t) => t.due && t.due >= today() && t.due <= inDays(7), overdue: false }
];

const demo = (title) => [
  { id: 'n1', subject: `Przykład (${title}): zaktualizować umowę B2B`, from: 'High · Not started', date: '2026-10-29', unread: true, url: '#' },
  { id: 'n2', subject: `Przykład (${title}): dopisać PKD do JDG`, from: 'Medium · In progress', date: '2026-10-31', unread: false, url: '#' }
];

module.exports = defs.map((d) => ({
  id: d.id,
  title: d.title,
  type: 'mail-list',
  refreshMs: 300000,
  async load() {
    if (!notion.connected()) return { demo: true, total: 2, items: demo(d.title) };
    const rows = (await notion.openTasks()).filter(d.pick);
    return {
      demo: false,
      total: rows.length,
      items: rows.slice(0, 20).map((t) => ({
        id: t.id,
        subject: t.name,
        from: [t.priority, t.status].filter(Boolean).join(' · '),
        date: t.due,
        unread: d.overdue,
        url: t.url
      }))
    };
  }
}));
