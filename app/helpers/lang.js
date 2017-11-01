const langNameLS = 'userLanguage'
const localStorage = global.window.localStorage

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