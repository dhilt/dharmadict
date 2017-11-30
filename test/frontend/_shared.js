global.window.localStorage = {};

module.exports = Object.assign({}, {
  getNotificationAction: require('./__test-methods/getNotificationAction'),
  defaultLang: require('../../app/helpers/lang').default.defaultLang,
  initialState: require('../../app/reducers/_initial').default,
  cloneState: require('./__test-methods/cloneInitialState'),
  languages: require('./__test-data/mockLanguages'),
  lang: require('../../app/helpers/lang').default,
  terms: require('./__test-data/mockTerms'),
  _appPath: '../../../../app/',
  appPath: '../../../app/'
},
  require('./__test-methods/mountTestedComponent'),
  require('./__test-data/mockUsers')
);
