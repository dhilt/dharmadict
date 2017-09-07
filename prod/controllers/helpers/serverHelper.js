const logger = require('../../log/logger');

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
  // res.statusCode = status ???
  res.send({
    error: true,
    message: text
  })
};

// responseSuccess ???

module.exports = {
  ApiError,
  sendApiError
};
