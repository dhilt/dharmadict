const doAuthorize = require('./doAuthorize');
const sendApiError = require('../helper').sendApiError;
const logger = require('../log/logger');

const usersController = require('../controllers/users');
const pagesController = require('../controllers/pages');

const userInfo = (req, res) =>
  doAuthorize(req)
    .then(user => {
      logger.info('Authenticated as ' + user.login);
      res.send(usersController.getUserInfo(user));
    })
    .catch(error => sendApiError(res, 'Can\'t get user info.', error));

const getAll = (req, res) =>
  doAuthorize(req)
    .then(user => usersController.checkPermissionByIdAndRole(user, [
      { role: 'admin' }
    ]))
    .then(() => usersController.findAll())
    .then(users => res.json({success: true, users}))
    .catch(error => sendApiError(res, 'Can\'t find users.', error));

const getById = (req, res) =>
  usersController.findById(req.params.id)
    .then(user => pagesController.findByAuthorId(user.id)
      .then(pages => Promise.resolve({ user, pages }))
    )
    .then(({ user, pages }) => res.json({
      user: usersController.getUserInfo(user),
      pages: pages,
      success: true
    }))
    .catch(error => sendApiError(res, 'Can\'t find user.', error));

const create = (req, res) =>
  doAuthorize(req)
    .then(user => usersController.isAdmin(user))
    .then(user => usersController.create(req.body.user))
    .then(result => res.json({success: true, user: result}))
    .catch(error => sendApiError(res, 'Can\'t create new user.', error));

const edit = (req, res) =>
  doAuthorize(req)
    .then(user => usersController.isAdmin(user))
    .then(user => usersController.update(req.params.id, req.body.payload))
    .then(result => res.json({success: true, user: usersController.getUserInfo(result)}))
    .catch(error => sendApiError(res, 'Can\'t update user data.', error));

const editPassword = (req, res) =>
  doAuthorize(req)
    .then(user => usersController.isSameUser(req.params.id, user))
    .then(user => usersController.updatePasswordByTranslator(user, req.body.payload))
    .then(result => res.json({success: true, user: usersController.getUserInfo(result)}))
    .catch(error => sendApiError(res, 'Can\'t update password.', error));

module.exports = {
  editPassword,
  userInfo,
  getById,
  getAll,
  create,
  edit
};
