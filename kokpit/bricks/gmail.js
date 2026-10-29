const gmail = require('../sources/gmail');

// Jedna cegiełka = jeden wpis: id, tytuł, zapytanie Gmaila, odświeżanie.
// Nową cegiełkę dodajesz jedną linijką.
const defs = [
  { id: 'gmail-inbox',   title: 'Skrzynka odbiorcza', query: 'in:inbox' },
  { id: 'gmail-aktywne', title: 'AKTYWNE',            query: 'label:AKTYWNE' },
  { id: 'gmail-todo',    title: 'DO ZROBIENIA',       query: 'label:DO-ZROBIENIA' },
  { id: 'gmail-czekam',  title: 'CZEKAM',             query: 'label:CZEKAM' }
];

const demoItems = (title) => [
  {
    id: 'd1', subject: `Przykład (${title}): potwierdź termin`, from: 'Demo', date: '', unread: true, url: '#',
    notion: 'https://www.notion.so/demo',
    detail: {
      history: [
        { title: 'Przykład: notatka ze spotkania w sprawie schodów', date: '2026-10-20', url: 'https://www.notion.so/demo' },
        { title: 'Przykład: wycena Alhen – wersja 2', date: '2026-10-25', url: null }
      ],
      caseHistory: 'Przykład: 20.10 oględziny schodów, 25.10 wycena od Alhen, oczekiwanie na potwierdzenie terminu.'
    }
  },
  {
    id: 'd2', subject: `Przykład (${title}): oferta ważna do piątku`, from: 'Demo', date: '', unread: false, url: '#',
    notion: null,
    detail: { history: [], caseHistory: '' }
  }
];

// Dopina pola rozszerzone do pozycji realnych (sources/gmail.js bez zmian).
const extend = (it) => ({ ...it, notion: null, detail: { history: [], caseHistory: '' } });

module.exports = defs.map((d) => ({
  id: d.id,
  title: d.title,
  type: 'mail-list',
  refreshMs: 120000,
  async load() {
    if (!gmail.connected()) return { demo: true, total: 2, items: demoItems(d.title) };
    const r = await gmail.threads(d.query);
    return { demo: false, ...r, items: (r.items || []).map(extend) };
  }
}));
