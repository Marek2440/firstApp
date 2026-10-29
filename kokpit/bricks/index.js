// Rejestr cegiełek. Każdy plik w tym katalogu eksportuje tablicę cegiełek.
// Kolejność tutaj = kolejność w UI. Duplikat id to błąd konfiguracji.
const all = [
  ...require('./gmail'),
  ...require('./notion'),
  ...require('./outlook'),
  ...require('./teams'),
  ...require('./mantis'),
  ...require('./ai-chats')
];

const seen = new Set();
for (const b of all) {
  if (seen.has(b.id)) throw new Error(`Duplikat id cegiełki: ${b.id}`);
  seen.add(b.id);
}

module.exports = all;
