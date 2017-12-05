global.window.localStorage = {};

module.exports = {
  shallowWithIntl: require('./__test-methods/mountTestedComponent').shallowWithIntl,
  mountWithStore: require('./__test-methods/mountTestedComponent').mountWithStore,
  mountWithIntl: require('./__test-methods/mountTestedComponent').mountWithIntl,
  shallow: require('./__test-methods/mountTestedComponent').shallow,
  getNotificationAction: require('./__test-methods/getNotificationAction'),
  cloneState: require('./__test-methods/cloneInitialState'),

  defaultTranslator: require('./__test-data/mockUsers').defaultTranslator,
  defaultUser: require('./__test-data/mockUsers').defaultUser,
  admin: require('./__test-data/mockUsers').admin,
  defaultTerm: require('./__test-data/mockTerms')[0],
  terms: require('./__test-data/mockTerms'),

  getEditableUserDataObject: require('../../app/actions/admin/changeUser').getEditableUserDataObject,
  defaultLang: require('../../prod/helper').languages.getLang().id,
  initialState: require('../../app/reducers/_initial').default,
  getLang: require('../../prod/helper').languages.getLang,
  languages: require('../../prod/helper').languages.data,
  _appPath: '../../../../app/',
  appPath: '../../../app/',

  // all code below should be removed
  checkWrapActions: require('./__test-methods/mountTestedComponent').checkWrapActions,
  setupComponent: require('./__test-methods/mountTestedComponent').setupComponent,
  checkWrap: require('./__test-methods/mountTestedComponent').checkWrap,
  newStore: require('./__test-methods/mountTestedComponent').newStore,

  userMutableProperties: require('./__test-data/mockUsers').userMutableProperties,
  roles: require('./__test-data/mockUsers').roles,
  translators: require('./__test-data/mockUsers').translators,
  users: require('./__test-data/mockUsers').users
};
