const logger = require('./log/logger');

class ApiError {
  constructor(text, code = 500) {
    this.text = text;
    this.code = code;
  }
}

const sendApiError = (res, text, error) => {
  let code = 500;
  if (error instanceof ApiError) {
    text = text + ' ' + error.text;
    code = error.code
  }
  else { // really need else ?
    logger.error(error);
  }
  // res.statusCode = code ???
  res.send({
    error: true,
    code,
    message: text
  })
};

const languages = {
  data: [
    {
      id: 'ru',
      name: 'русский',
      name_ru: 'русский',
      name_en: 'russian',
      default: true
    },
    {
      id: 'en',
      name: 'english',
      name_ru: 'английский',
      name_en: 'english'
    }
  ],
  getLang: (id) => {
    const lang = languages.data.find(lang => lang.id === id);
    return lang || languages.data.find(lang => lang.default)
  }
};

// responseSuccess ???

module.exports = {
  ApiError,
  sendApiError,
  languages
};
