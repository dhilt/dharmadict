const jwt = require('jsonwebtoken');
const logger = require('../log/logger');
const config = require('../config.js');
const ApiError = require('./../helper.js').ApiError;

const extractToken = (authHeader) => {
  if (!authHeader) {
    return
  }
  let bearer = authHeader.substr(7);
  if (!bearer || bearer.length < 10) {
    return
  }
  return bearer
};

const parseToken = (token) => new Promise((resolve, reject) => {
  jwt.verify(token, config.token.secretKey, (err, decoded) => {
    if (err || !decoded) {
      return reject(new ApiError('Invalid token', 302))
    }
    resolve(decoded.login)
  })
});

const generateToken = (user) => {
  logger.info('Logged in as ' + user.login);
  return jwt.sign(user, config.token.secretKey, {
    expiresIn: config.token.expiration
  })
};

module.exports = {
  extractToken,
  parseToken,
  generateToken
};
