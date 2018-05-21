const { Translations } = require('./helpers/translations.js');

const translations = [{
  id: 'DON',
  file: 'DON-2.csv',
  lang: 'ru'
}];

const script = {
  title: `Reset DON data`,
  run: (client) =>
    Translations.run(client, translations)
};

module.exports = script;
