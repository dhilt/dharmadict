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
      id: 'rus',
      name: 'русский',
      name_rus: 'русский',
      name_eng: 'russian',
      default: true
    },
    {
      id: 'eng',
      name: 'english',
      name_rus: 'английский',
      name_eng: 'english'
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
