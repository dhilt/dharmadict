const doAuthorize = require('./doAuthorize');
const sendApiError = require('../helper').sendApiError;
const logger = require('../log/logger');

const isAdmin = require('../controllers/users').isAdmin;
const termsController = require('../controllers/terms');

const searchAll = (req, res) =>
  termsController.findAll()
    .then(result => res.json({success: true, terms: result}))
    .catch(error => sendApiError(res, 'Search error.', error));

const search = (req, res) =>
  termsController.searchByPattern(req.query.pattern)
    .then(result => res.json(result))
    .catch(error => sendApiError(res, 'Search error.', error));

const edit = (req, res) => {
  const {termId, translation} = req.body;
  doAuthorize(req)
    .then(user => termsController.update(user, termId, translation))
    .then(term => res.json({success: true, term}))
    .catch(error => sendApiError(res, 'Can\'t update term.', error))
};

const create = (req, res) =>
  doAuthorize(req)
    .then(user => isAdmin(user))
    .then(() => termsController.create(req.body.term, req.body.sanskrit))
    .then(term => res.json({success: true, term}))
    .catch(error => sendApiError(res, 'Can\'t create new term.', error));

const remove = (req, res) =>
  doAuthorize(req)
    .then(user => isAdmin(user))
    .then(() => termsController.removeById(req.params.id))
    .then(() => res.json({success: true}))
    .catch(error => sendApiError(res, 'Can\'t delete term.', error));

module.exports = {
  searchAll,
  search,
  edit,
  create,
  remove
};
