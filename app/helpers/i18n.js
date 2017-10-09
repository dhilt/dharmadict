import lang from './lang'

const i18n = {
  data: {},

  initialize: () => {
    lang.list.forEach(itemLang => i18n.data[itemLang] = require('../i18n/' + itemLang))
  },

  isPresent: (token) => {
    const userLang = lang.getUserLanguage()
    let language = i18n.data[userLang]
    if(language && !!language[token]) {
      return true
    }
    if(userLang !== lang.defaultLang) {
      language = i18n.data[lang.defaultLang]
      return language && !!language[token]
    }
    return false
  }
}

i18n.initialize()

export default i18n