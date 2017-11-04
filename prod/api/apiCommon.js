const sendApiError = require('../helper').sendApiError;
const ApiError = require('../helper').ApiError;
const languages = require('../helper').languages;

const extractToken = require('../controllers/auth').extractToken;
const parseToken = require('../controllers/auth').parseToken;
const findByLogin = require('../controllers/users').findByLogin;
const findAll = require('../controllers/users').findAll;

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

const apiTest = (req, res) => {
  const param = req.query.param;
  res.send({success: true, param});
};

const apiCommon = (req, res) =>
  findAll('translator')
    .then(translators => res.send({
      success: true,
      translators,
      languages: languages.data
    }))
    .catch(error => sendApiError(res, 'Can\'t get common data.', error));

module.exports = {
  doAuthorize,
  apiTest,
  apiCommon
};
