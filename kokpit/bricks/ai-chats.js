// Cegiełka DEMO (przykładowe dane, bez żadnych połączeń).
const items = [
  { id: 'chatgpt-private', subject: 'ChatGPT prywatny', from: 'Przykład: Plan remontu łazienki', date: '2026-10-29', unread: true, url: '#', via: 'konto', notion: null, detail: { history: [], caseHistory: '' } },
  { id: 'chatgpt-work', subject: 'ChatGPT firmowy', from: 'Przykład: Szkic pisma do Alhen', date: '2026-10-29', unread: false, url: '#', via: 'konto', notion: null, detail: { history: [], caseHistory: '' } },
  { id: 'codex-work', subject: 'Codex CLI firmowy', from: 'Przykład: Refaktoryzacja modułu raportów', date: '2026-10-29', unread: true, url: '#', via: 'cli', notion: null, detail: { history: [], caseHistory: '' } },
  { id: 'claude-private', subject: 'Claude prywatny', from: 'Przykład: Rozliczenie JDG – PKD', date: '2026-10-29', unread: false, url: '#', via: 'konto', notion: null, detail: { history: [], caseHistory: '' } },
  { id: 'claudecode-private', subject: 'Claude Code prywatny', from: 'Przykład: Kokpit: nowe cegiełki', date: '2026-10-29', unread: true, url: '#', via: 'cli', notion: null, detail: { history: [], caseHistory: '' } },
  { id: 'claude-work', subject: 'Claude firmowy', from: 'Przykład: Streszczenie protokołu ze schodów', date: '2026-10-29', unread: false, url: '#', via: 'konto', notion: null, detail: { history: [], caseHistory: '' } },
  { id: 'claudecode-work', subject: 'Claude Code firmowy', from: 'Przykład: Poprawka skryptu importu', date: '2026-10-29', unread: false, url: '#', via: 'cli', notion: null, detail: { history: [], caseHistory: '' } }
];

module.exports = [
  {
    id: 'ai-chats',
    title: 'Czaty AI',
    type: 'mail-list',
    refreshMs: 180000,
    via: 'konto',
    demo: true,
    async load() {
      return { demo: true, via: 'konto', total: items.length, items: items.map((i) => ({ ...i })) };
    }
  }
];
