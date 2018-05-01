const { Translations } = require('./helpers/translations.js');

const list = [{
  id: 'MK',
  file: 'MK.csv',
  lang: 'ru'
}, {
  id: 'AKT',
  file: 'AKT.csv',
  lang: 'ru'
}, {
  id: 'ZAG',
  file: 'ZAG.csv',
  lang: 'ru'
}, {
  id: 'DON',
  file: 'DON.csv',
  lang: 'ru'
}, {
  id: 'HOP',
  file: 'HOP.csv',
  lang: 'en'
}, {
  id: 'BRZ',
  file: 'BRZ.csv',
  lang: 'en'
}, {
  id: 'MM',
  file: 'MM.csv',
  lang: 'ru'
}, {
  id: 'RAG',
  file: 'RAG.csv',
  lang: 'ru'
}, {
  id: 'JRK',
  file: 'JRK.csv',
  lang: 'ru'
}];

const script = {
  title: `Add translations`,
  run: (client) => Translations.run(client, list)
};

module.exports = script;
