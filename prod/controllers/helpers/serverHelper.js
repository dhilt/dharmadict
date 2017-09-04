const logger = require('../../log/logger')

let responseError = (res, message, status, level = 'error') => {
  if (level === 'error') {
    logger.error(message)
  } else {
    logger.info(message)
  }
  //res.status(status) ???
  res.send({
    error: true,
    message: message
  })
}

let redirect302 = (res) => {
  res.statusCode = 302
  res.send({
    error: true,
    message: 'Authorization is needed'
  })
}

let getTokenFromRequest = (req) => {
  let authHeader = req.headers.authorization
  if (!authHeader) {
    return
  }
  let bearer = authHeader.substr(7)
  if (!bearer || bearer.length < 10) {
    return
  }
  return bearer
}

// responseSuccess ???

module.exports = {
  responseError,
  redirect302,
  getTokenFromRequest
}
