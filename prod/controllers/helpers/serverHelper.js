const logger = require('../../log/logger');

let responseError = (res, message, status, logLevel = 'error') => {
  if (logLevel === 'error') {
    logger.error(message)
  } else {
    logger.info(message)
  }
  // res.statusCode = status ???
  res.send({
    error: true,
    message: message
  })
};

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
  responseError(res, text, code)
};

// responseSuccess ???

module.exports = {
  responseError,
  ApiError,
  sendApiError
};
