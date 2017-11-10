const doAuthorize = require('./doAuthorize');
const sendApiError = require('../helper').sendApiError;
const logger = require('../log/logger');

const findUserById = require('../controllers/users').findById;
const termsController = require('../controllers/terms');

const get = (req, res) => {
  const {termId, translatorId} = req.query;
  if (!termId || !translatorId) {
    return sendApiError(res, 'Incorrect /api/term request params', null);
  }
  logger.info('Requesting a translation by term id "' + termId + '" and translatorId "' + translatorId + '"');
  let user, term, translations;
  doAuthorize(req)
    .then(result => {
      user = result;
      return termsController.findById(termId);
    })
    .then(_term => {
      term = _term;
      if (!(translations = term ? term.translations : null)) {
        throw 'Can not find a translation by termId'
      }
      return findUserById(translatorId)
    })
    .then(translator => {
      if (user.id !== translator.id && user.role !== 'admin') {
        throw 'Unpermitted access'
      }
      return termsController.findTranslations(translator, term, translations)
    })
    .then(result => res.json({result}))
    .catch(error => {
      console.log(error);
      sendApiError(res, `Can't get a translation.`, error)
    })
};

module.exports = {
  get
};
