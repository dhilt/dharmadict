const doAuthorize = require('./doAuthorize');
const sendApiError = require('../helper').sendApiError;
const logger = require('../log/logger');

const {checkPermissionByIdAndRole, isAdmin} = require('../controllers/users');
const pagesController = require('../controllers/pages');

const searchAll = (req, res) =>
  pagesController.findAll()
    .then(result => res.json(result))
    .catch(error => sendApiError(res, 'Search error.', error));

const search = (req, res) =>
  pagesController.findByUrl(req.query.url)
    .then(result => res.json(result))
    .catch(error => sendApiError(res, 'Search error.', error));

const create = (req, res) =>
  doAuthorize(req)
    .then(user => checkPermissionByIdAndRole(user, [
      {role: 'translator', requiredId: null},
      {role: 'admin', requiredId: null}
    ]))
    .then((user) => pagesController.create(req.body.payload, user.id))
    .then(page => res.json({success: true, page}))
    .catch(error => sendApiError(res, 'Can\'t create new page.', error));

const edit = (req, res) =>
  pagesController.findByUrl(req.query.url)
    .then(page => doAuthorize(req)
      .then(user => checkPermissionByIdAndRole(user, [
        {role: 'translator', requiredId: page.author},
        {role: 'admin', requiredId: null}
      ]))
      .then(() => pagesController.update(req.query.url, req.body.payload))
      .then(page => res.json({success: true, page}))
      .catch(error => sendApiError(res, 'Can\'t update page.', error))
    )
    .catch(error => sendApiError(res, 'Can\'t update page.', error));

const remove = (req, res) =>
  pagesController.findByUrl(req.query.url)
    .then(page => doAuthorize(req)
      .then(user => checkPermissionByIdAndRole(user, [
        {role: 'translator', requiredId: page.author},
        {role: 'admin', requiredId: null}
      ]))
      .then(() => pagesController.removeByUrl(req.query.url))
      .then(() => res.json({success: true}))
      .catch(error => sendApiError(res, 'Can\'t delete page.', error))
    )
    .catch(error => sendApiError(res, 'Can\'t delete page.', error));

module.exports = {
  searchAll,
  search,
  create,
  remove,
  edit
};
