let localStorage
const langNameLS = 'userLanguage'

// If we're testing, use a local storage polyfill
if (global.process && process.env.NODE_ENV === 'test') {
  localStorage = require('localStorage')
} else {
  // If not, use the browser one
  localStorage = global.window.localStorage
}

const lang = {
  list: ['en', 'ru'],

  defaultLang: 'ru',

  get: (value) => {
    if(typeof value !== 'string') {
      return lang.defaultLang
    }
    value = value.slice(0, 2)
    return lang.list.find(l => l === value) || lang.defaultLang
  },

  getUserLanguage: () => {
    return lang.get(localStorage[langNameLS])
  },

  setUserLanguage: (value) => {
    localStorage[langNameLS] = lang.get(value)
  },

  initialize(initialState) {
    initialState['userLanguage'] = lang.getUserLanguage()
  }
}

export default lang