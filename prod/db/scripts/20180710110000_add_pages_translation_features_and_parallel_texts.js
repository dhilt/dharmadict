const { Pages } = require('./helpers/pages.js');

const pages = [{
  url: 'translation_features',
  title: 'Особенности переводов',
  text: ``
}, {
  url: 'parallel_texts',
  title: 'Параллельные тексты',
  text: ``
}];

const script = {
  title: `Add pages: translation features and parallel texts`,
  run: (client) =>
    Pages.run(client, pages)
};

module.exports = script;
