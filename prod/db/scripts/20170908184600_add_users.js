const { Users } = require('./helpers/users.js');

const users = [{
  id: 'ADMIN',
  body: {
    role: 'admin',
    login: 'admin',
    name: 'Администратор',
    hash: 'sha1$e0ef0f22$1$d1931026965efb48a9d28b1fee6970a0e9983baf',
    description: ''
  }
}, {
  id: 'USER',
  body: {
    role: 'user',
    login: 'user',
    name: 'Пользователь',
    hash: 'sha1$b860d9c2$1$36010684ad559eb7f7e039fb01839ce2b52b4880',
    description: ''
  }
}, {
  id: 'MK',
  body: {
    role: 'translator',
    login: 'mk',
    name: 'М.Н. Кожевникова',
    hash: 'sha1$ce4a9ca0$1$ef1aabb5804cf7e7b397344720224f33a5a788c6',
    language: 'ru',
    description: ''
  }
}, {
  id: 'AKT',
  body: {
    role: 'translator',
    login: 'akt',
    name: 'А. Кугявичус - А.А. Терентьев',
    hash: 'sha1$b4089de2$1$3fc5af2bf791224f1316fe2e2b0a530dc8aa4ba0',
    language: 'ru',
    description: ''
  }
}, {
  id: 'ZAG',
  body: {
    role: 'translator',
    login: 'zag',
    name: 'Б.И. Загуменнов',
    hash: 'sha1$26f87429$1$af2f2de31509fc6da7432f70773ed529288c1daa',
    language: 'ru',
    description: ''
  }
}, {
  id: 'DON',
  body: {
    role: 'translator',
    login: 'don',
    name: 'А.М. Донец',
    hash: 'sha1$81db2f3b$1$8580e47f134905fbe6885f6e7aed31ac283d21a6',
    language: 'ru',
    description: ''
  }
}, {
  id: 'HOP',
  body: {
    role: 'translator',
    login: 'hop',
    name: 'J. Hopkins',
    hash: 'sha1$7c4a6e42$1$1fe059bfe474c38bcc74f6d44f54928d12fa27d5',
    language: 'en',
    description: ''
  }
}, {
  id: 'BRZ',
  body: {
    role: 'translator',
    login: 'brz',
    name: 'A. Berzin',
    hash: 'sha1$ec042dac$1$e88e2babfc1730d1ba4ae8da16fc5f624f9bc858',
    language: 'en',
    description: ''
  }
}, {
  id: 'MM',
  body: {
    role: 'translator',
    login: 'mm',
    name: 'М. Малыгина',
    hash: 'sha1$18cbc60d$1$48da07d81b01164028c0eb727df7fa2b6ed57b3a',
    language: 'ru',
    description: ''
  }
}, {
  id: 'RAG',
  body: {
    role: 'translator',
    login: 'rag',
    name: 'В.К. Рагимов',
    hash: 'sha1$a81da821$1$713b00c1960eaa33e1a8b4aabe5155f64755cab6',
    language: 'ru',
    description: ''
  }
}, {
  id: 'JRK',
  body: {
    role: 'translator',
    login: 'jrk',
    name: 'Ю. Жиронкина',
    hash: 'sha1$c419206b$1$d0016a4ad283df8eebce4f12b8f57eb27ec300df',
    language: 'ru',
    description: ''
  }
}];

const script = {
  title: `Add users`,
  run: (client) => Users.run(client, users)
};

module.exports = script;
