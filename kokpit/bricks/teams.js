// Cegiełka DEMO (przykładowe dane, bez żadnych połączeń).
const items = [
  { id: 'tm1', subject: 'Przykład: Czy schody są już odebrane?', from: 'Czat · Jan Kowalski', date: '2026-10-29', unread: true, url: '#', notion: null, detail: { history: [], caseHistory: '' } },
  { id: 'tm2', subject: 'Przykład: Harmonogram dostaw Alhen', from: 'Kanał · Budowa B / Ogólny', date: '2026-10-29', unread: true, url: '#',
    notion: 'https://www.notion.so/demo',
    detail: { history: [{ title: 'Przykład: harmonogram dostaw', date: '2026-10-22', url: 'https://www.notion.so/demo' }], caseHistory: 'Przykład: dostawy w poniedziałki i czwartki.' } },
  { id: 'tm3', subject: 'Przykład: Lunch o 13:00?', from: 'Grupa · Zespół projektowy', date: '2026-10-29', unread: true, url: '#', notion: null, detail: { history: [], caseHistory: '' } },
  { id: 'tm4', subject: 'Przykład: Wrzuciłem rysunki rewizja C', from: 'Kanał · Projekt / Rysunki', date: '2026-10-28', unread: true, url: '#', notion: null, detail: { history: [], caseHistory: '' } },
  { id: 'tm5', subject: 'Przykład: Dzięki, zajmę się tym jutro', from: 'Czat · Ewa Zielińska', date: '2026-10-28', unread: true, url: '#', notion: null, detail: { history: [], caseHistory: '' } }
];

module.exports = [
  {
    id: 'teams-unread',
    title: 'Teams: nieprzeczytane',
    type: 'mail-list',
    refreshMs: 120000,
    via: 'dyrygent',
    demo: true,
    async load() {
      return { demo: true, via: 'dyrygent', total: items.length, items: items.map((i) => ({ ...i })) };
    }
  }
];
