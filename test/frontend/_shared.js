global.window.localStorage = {};

const initialState = require('../../app/reducers/_initial').default;
const lang = require('../../app/helpers/lang').default;

const {terms} = require('./__test-data/mockTerms');
const {languages} = require('./__test-data/mockLanguages');
const {
  userMutableProperties,
  roles,
  admin,
  translators,
  users
} = require('./__test-data/mockUsers');

const {cloneState} = require('./__test-methods/cloneInitialState');
const {getNotificationAction} = require('./__test-methods/getNotificationAction');
const {
  setupComponent,
  checkWrap
} = require('./__test-methods/mountTestedComponent');

module.exports = {
  appPath: '../../../../app/',
  defaultLang: lang.defaultLang,
  initialState,
  cloneState,
  setupComponent,
  checkWrap,
  getNotificationAction,
  admin,
  translators,
  users,
  userMutableProperties,
  roles,
  languages,
  terms
};
