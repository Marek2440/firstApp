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
  { id: 'd1', subject: `Przykład (${title}): potwierdź termin`, from: 'Demo', date: '', unread: true, url: '#' },
  { id: 'd2', subject: `Przykład (${title}): oferta ważna do piątku`, from: 'Demo', date: '', unread: false, url: '#' }
];

module.exports = defs.map((d) => ({
  id: d.id,
  title: d.title,
  type: 'mail-list',
  refreshMs: 120000,
  async load() {
    if (!gmail.connected()) return { demo: true, total: 2, items: demoItems(d.title) };
    return { demo: false, ...(await gmail.threads(d.query)) };
  }
}));
