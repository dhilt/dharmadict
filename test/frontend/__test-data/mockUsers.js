const languages = require('../../../prod/helper').languages.data;

const roles = ['user', 'translator', 'admin'];

const userMutableProperties = ['name', 'description', 'language'];

const admin = {
  id: 'ADMIN_ID',
  name: 'Admin name',
  role: 'admin',
  language: languages[0].id
};

const translators = [{
  id: 'ZAG',
  name: 'Б.И. Загуменнов',
  role: 'translator',
  description: 'desc',
  language: 'ru'
}, {
  id: 'AKT',
  name: 'А. Кугявичус - А.А. Терентьев',
  role: 'translator',
  description: '',
  language: 'ru'
}, {
  id: 'MM',
  name: 'М. Малыгина',
  role: 'translator',
  description: '',
  language: 'ru'
}, {
  id: 'HOP',
  name: 'J. Hopkins',
  role: 'translator',
  description: '',
  language: 'en'
}, {
  id: 'BRZ',
  name: 'A. Berzin',
  role: 'translator',
  description: '',
  language: 'en'
}, {
  id: 'DON',
  name: 'А.М. Донец',
  role: 'translator',
  description: '',
  language: 'ru'
}, {
  id: 'MK',
  name: 'М.Н. Кожевникова',
  role: 'translator',
  description: '',
  language: 'en'
}];

// Creation of users occurs with each import into the component.
// This process needs to be done only once.
let users = [];

languages.forEach(lang => {
  roles.forEach(role => {
    users.push({
      id: 'ID',
      name: `${lang.id}-${role}`,
      role: role,
      description: '',
      language: lang.id
    });
  });
});

module.exports = {
  userMutableProperties,
  roles,
  admin,
  translators,
  users
};
