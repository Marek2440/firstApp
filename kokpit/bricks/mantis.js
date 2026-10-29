// Cegiełka DEMO (przykładowe dane, bez żadnych połączeń).
const items = [
  { id: 'mt1234', subject: '#1234 Błąd generowania raportu miesięcznego (przykład)', from: 'Wysoki · Przypisane', date: '2026-10-28', unread: true, url: '#', notion: null, detail: { history: [], caseHistory: '' } },
  { id: 'mt1229', subject: '#1229 Brak uprawnień dla roli Kierownik budowy (przykład)', from: 'Normalny · W toku', date: '2026-10-26', unread: false, url: '#',
    notion: 'https://www.notion.so/demo',
    detail: { history: [{ title: 'Przykład: analiza uprawnień', date: '2026-10-24', url: 'https://www.notion.so/demo' }], caseHistory: 'Przykład: Normalny · W toku' } },
  { id: 'mt1217', subject: '#1217 Literówka w szablonie protokołu odbioru (przykład)', from: 'Niski · Potwierdzone', date: '2026-10-21', unread: false, url: '#', notion: null, detail: { history: [], caseHistory: '' } }
];

module.exports = [
  {
    id: 'mantis-assigned',
    title: 'Mantis: przypisane do mnie',
    type: 'mail-list',
    refreshMs: 300000,
    via: 'cli',
    demo: true,
    async load() {
      return { demo: true, via: 'cli', total: items.length, items: items.map((i) => ({ ...i })) };
    }
  }
];
