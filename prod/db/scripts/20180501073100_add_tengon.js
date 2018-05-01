const { Translations } = require('./helpers/translations.js');
const { Users } = require('./helpers/users.js');
const { Pages } = require('./helpers/pages.js');

const users = [{
  id: 'TENGON',
  body: {
    role: 'translator',
    login: 'tengon',
    name: 'Тенгон',
    hash: 'sha1$7f2da956$1$041d225dea335754719b5bca02487631ff4e3309',
    language: 'ru',
    description: '/pages/TENGON'
  }
}];

const translations = [{
  id: 'TENGON',
  file: 'TENGON.csv',
  lang: 'ru'
}];

const pages = [{
  url: 'TENGON',
  title: 'Тенгон',
  text: `
<p>
С 1992 до 1994 года учился в Иволгинском дацане, где изучал технику
письменного перевода с тибетского на монгольский под руководством
монгольского геше Цеден-Дамба бакши. С 1993 года устно переводил  на
аудиенциях и учениях Бакула Ринпоче, Госок Ринпоче, Ело Ринпоче и
некоторых других лам. С 1997 начал переводить для Богдо Гегена. В 2002
составил и перевёл первое издание «Текстов для ежедневных практик». С
2003 года, живя в резиденции Богдо Гегена, письменно переводил по его
указанию тексты различных практик и сутры. Также устно переводил на
аудиенциях и учениях Далай Ламы и Богдо Гегена. В 2016 г. переработал и
дополнил «Тексты для ежедневных практик».
</p>
`
}];


const script = {
  title: `Add Tengon data`,
  run: (client) =>
    Users.run(client, users)
    .then(Translations.run(client, translations))
    .then(Pages.run(client, pages))
};

module.exports = script;
