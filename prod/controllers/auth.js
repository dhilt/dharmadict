const jwt = require('jsonwebtoken');
const logger = require('../log/logger');

const secretKey = 'supersecret';
const accessTokenExpiration = 60 * 60 * 24 * 31;  // 1 month

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
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err || !decoded) {
      return reject('Missed token')
    }
    resolve(decoded.login)
  })
});

const generateToken = (user) => {
  logger.info('Logged in as ' + user.login);
  const token = jwt.sign(user, secretKey, {
    expiresIn: accessTokenExpiration
  });
  return {user, token}
};

module.exports = {
  extractToken,
  parseToken,
  generateToken
};
