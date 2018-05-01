const { Descriptions } = require('./helpers/descriptions.js');

const users = [
  { id: 'AKT', body: { description: '/pages/AK' } },
  { id: 'DON', body: { description: '/pages/DON' } },
  { id: 'HOP', body: { description: '/pages/HOP' } },
  { id: 'MM', body: { description: '/pages/MM' } },
  { id: 'RAG', body: { description: '/pages/RAG' } },
  { id: 'ZAG', body: { description: '/pages/ZAG' } }
];

const script = {
  title: `Add users descriptions`,
  run: (client) => Descriptions.run(client, users)
};

module.exports = script;
