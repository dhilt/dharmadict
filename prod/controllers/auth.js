const serverHelper = require('./helpers/serverHelper.js')
const jwt = require('jsonwebtoken')
const logger = require('../log/logger')

const canLogin = require('./users').canLogin
const findByLogin = require('./users').findByLogin

const secretKey = 'supersecret'
const accessTokenExpiration = 60 * 60 * 24 * 31  // 1 month

let authorize = (req, res, onSuccess) => {
  let token
  if (!(token = serverHelper.getTokenFromRequest(req))) {
    return serverHelper.redirect302(res)
  }
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return serverHelper.responseError(res, 'Authorization error. Missed token', 500)
    }
    findByLogin(decoded.login)
      .then(user => onSuccess(user))
      .catch(error => serverHelper.responseError(res, error, 500))
  })
}

let doLogin = (req) => new Promise((resolve, reject) => {
  const login = req.body.login
  const password = req.body.password
  canLogin(login, password)
    .then(user => {
      logger.info('Logged in as ' + user.login)
      const token = jwt.sign(user, secretKey, {
        expiresIn: accessTokenExpiration
      })
      return resolve({ user, token })
    })
    .catch(error => {
      return reject(`Can't login. ${error}`)
    })
})

module.exports = {
  authorize,
  doLogin
}
