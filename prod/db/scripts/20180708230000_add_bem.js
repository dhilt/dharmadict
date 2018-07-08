const { Translations } = require('./helpers/translations.js');
const { Users } = require('./helpers/users.js');
const { Pages } = require('./helpers/pages.js');

const users = [{
  id: 'BEM',
  body: {
    role: 'translator',
    login: 'bem',
    name: 'Бем Митруев',
    hash: 'sha1$f3ad56b3$1$d025a30301629025ee6eddcb527801d788c31f80',
    language: 'ru',
    description: '/pages/BEM'
  }
}];

const translations = [{
  id: 'BEM',
  file: 'BEM.csv',
  lang: 'ru'
}];

const pages = [{
  url: 'BEM',
  title: 'Бем Митруев',
  text: `
<p>
Бем Митруев – переводчик с тибетского языка. С 1995 по 2005 гг. проходил обучение в
Институте высших тибетских знаний в Варанаси (Индия), где изучал тибетскую историю,
поэзию, буддийскую философию, тибетский язык, санскрит и хинди.
Получил степень ачарьи (магистр буддийской философии). В настоящее время является
переводчиком учений Его Святейшества Далай Ламы (Рига) и других учителей,
которые приезжают в Россию с учениями.
</p>
`
}];


const script = {
  title: `Add Bem data`,
  run: (client) =>
    Users.run(client, users)
    .then(Translations.run(client, translations))
    .then(Pages.run(client, pages))
};

module.exports = script;
