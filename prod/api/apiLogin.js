const sendApiError = require('../helper').sendApiError;

const generateToken = require('../controllers/auth').generateToken;
const getUserInfo = require('../controllers/users').getUserInfo;
const canLogin = require('../controllers/users').canLogin;

const apiLogin = (req, res) => {
  const {login, password} = req.body;
  canLogin(login, password)
    .then(user => {
      const _user = getUserInfo(user, false);
      const token = generateToken(_user);
      res.send({user: _user, token})
    })
    .catch(error => sendApiError(res, 'Can\'t login.', error))
};

module.exports = apiLogin;
