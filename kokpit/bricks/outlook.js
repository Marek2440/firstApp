// Cegiełka DEMO (przykładowe dane, bez żadnych połączeń).
const items = [
  { id: 'ol1', subject: 'Przykład: Schody w budynku B – protokół odbioru', from: 'Anna Nowak', date: '2026-10-29', unread: true, url: '#',
    notion: 'https://www.notion.so/demo',
    detail: {
      history: [{ title: 'Przykład: sprawa schodów – oględziny', date: '2026-10-20', url: 'https://www.notion.so/demo' }],
      caseHistory: 'Przykład: 20.10 oględziny, 27.10 poprawki wykonawcy, 29.10 protokół do podpisu.'
    } },
  { id: 'ol2', subject: 'Przykład: Alhen – potwierdzenie zamówienia 45/2026', from: 'Alhen Sp. z o.o.', date: '2026-10-28', unread: true, url: '#',
    notion: null, detail: { history: [], caseHistory: 'Przykład: zamówienie złożone 26.10, dostawa w przyszłym tygodniu.' } },
  { id: 'ol3', subject: 'Przykład: Zaproszenie na przegląd kwartalny', from: 'Piotr Wiśniewski', date: '2026-10-27', unread: false, url: '#',
    notion: null, detail: { history: [], caseHistory: '' } },
  { id: 'ol4', subject: 'Przykład: Faktura 118/10/2026 do akceptacji', from: 'Księgowość', date: '2026-10-26', unread: false, url: '#',
    notion: null, detail: { history: [], caseHistory: '' } }
];

module.exports = [
  {
    id: 'outlook-inbox',
    title: 'Outlook (firmowy)',
    type: 'mail-list',
    refreshMs: 180000,
    via: 'dyrygent',
    demo: true,
    async load() {
      return { demo: true, via: 'dyrygent', total: items.length, items: items.map((i) => ({ ...i })) };
    }
  }
];
