global.window.localStorage = {};

module.exports = Object.assign({}, {
  getNotificationAction: require('./__test-methods/getNotificationAction'),
  defaultLang: require('../../app/helpers/lang').default.defaultLang,  // probably can be removed
  initialState: require('../../app/reducers/_initial').default,
  cloneState: require('./__test-methods/cloneInitialState'),
  getLang: require('../../prod/helper').languages.getLang,
  languages: require('../../prod/helper').languages.data,
  lang: require('../../app/helpers/lang').default,  // probably can be removed
  terms: require('./__test-data/mockTerms'),
  _appPath: '../../../../app/',
  appPath: '../../../app/'
},
  require('./__test-methods/mountTestedComponent'),
  require('./__test-data/mockUsers')
);
