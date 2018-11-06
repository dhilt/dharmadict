const { Users } = require('./helpers/users.js');
const { Pages } = require('./helpers/pages.js');

const users = [{
  id: 'DU',
  body: {
    role: 'translator',
    login: 'du',
    name: 'Дмитрий Устьянцев',
    hash: 'sha1$66268e00$1$674896a755114c4c786e617fab3340cf7dc82f90',
    language: 'ru',
    description: '/pages/DU'
  }
}];

const pages = [{
  url: 'DmitrijUst\'yancev',
  title: 'Дмитрий Устьянцев',
  author: 'DU',
  bio: true,
  text: `
<p>
С 1996 года обучался в рамках традиционного тибетско-буддийского образования (шедра)
под руководством квалифицированных тибетских учителей (кхенпо) в Индии, Непале и в
России. Начал заниматься переводами с 2000 года.
</p>
<p>
Список изданных переводов:
</p>
<ul>
<li>"Буддийское учение о пустотности, Введение в мадхьямаку", Чандракирти - 2009;</li>
<li>"Стадии медитации, Советы царю", Камалашила - 2011;</li>
<li>"Абсолютное и относительное в буддизме", сборник - 2012;</li>
<li>и многие другие.</li>
</ul>
`
}];


const script = {
  title: `Add Ust'yancev user and page`,
  run: (client) =>
    Users.run(client, users)
    .then(Pages.run(client, pages))
};

module.exports = script;
