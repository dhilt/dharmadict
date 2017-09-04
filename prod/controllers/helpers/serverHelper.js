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

let redirect302 = (res) => {
  logger.info('Unauthorized access');
  res.statusCode = 302;
  res.send({
    error: true,
    message: 'Authorization is needed'
  })
};

// responseSuccess ???

module.exports = {
  responseError,
  redirect302
};
