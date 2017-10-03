
const lang = {
  list: ['en', 'ru'],

  defaultLang: 'en',

  get: (value) => {
    if(typeof value !== 'string') {
      return lang.defaultLang
    }
    value = value.slice(0, 2)
    return lang.list.find(l => l === value) || lang.defaultLang
  }
}

export default lang