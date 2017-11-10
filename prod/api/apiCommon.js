const sendApiError = require('../helper').sendApiError;
const languages = require('../helper').languages;

const findAll = require('../controllers/users').findAll;

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
  apiTest,
  apiCommon
};
