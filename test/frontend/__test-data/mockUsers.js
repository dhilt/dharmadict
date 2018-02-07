const defaultLang = require('../../../prod/helper').languages.getLang().id;

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

const admin = {
  id: 'ADMIN_ID',
  name: 'Admin name',
  role: 'admin',
  language: defaultLang
};

const defaultUser = {
  id: 'USER_ID',
  name: 'Name of default user',
  role: 'user',
  description: 'description of user',
  language: defaultLang
};

const defaultTranslator = {
  id: 'TRANSLATOR_ID',
  name: 'Name of default translator',
  role: 'translator',
  description: 'description of translator',
  language: defaultLang
};

module.exports = {
  defaultTranslator,
  defaultUser,
  translators,
  admin
};
