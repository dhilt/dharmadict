const ApiError = require('../helper').ApiError;

const extractToken = require('../controllers/auth').extractToken;
const parseToken = require('../controllers/auth').parseToken;
const findByLogin = require('../controllers/users').findByLogin;

const doAuthorize = (req) => {
  const token = extractToken(req.headers.authorization);
  if (!token) {
    return Promise.reject(new ApiError('Authorization needed', 302));
  }
  return parseToken(token)
    .then(login => findByLogin(login))
    .catch(error => {
      throw new ApiError(`Unauthorized access. ${error.text}`, error.code)
    })
};

module.exports = doAuthorize;
