const { Pages } = require('./helpers/pages.js');

const pages = [{
  url: 'translators',
  title: 'Переводчики',
  text: ``
}, {
  url: 'history',
  title: 'История буддийских текстов в России',
  text: ``
}];

const script = {
  title: `Add pages: translators and history`,
  run: (client) =>
    Pages.run(client, pages)
};

module.exports = script;
