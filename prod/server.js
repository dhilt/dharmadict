const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const config = require('./config.js');
const logger = require('./log/logger');

const apiCommon = require('./api/apiCommon').apiCommon;
const apiTest = require('./api/apiCommon').apiTest;
const apiLogin = require('./api/apiLogin');

const apiTranslation = require('./api/apiTranslation');
const apiUsers = require('./api/apiUsers');
const apiTerms = require('./api/apiTerms');
const apiPages = require('./api/apiPages');

const app = express();
app.use(bodyParser.json());

app.get('/api/common', apiCommon);
app.post('/api/login', apiLogin);
app.get('/api/test', apiTest);

app.patch('/api/translators/:id', apiUsers.editPassword);
app.get('/api/userInfo', apiUsers.userInfo);
app.get('/api/users/:id', apiUsers.getById);
app.patch('/api/users/:id', apiUsers.edit);
app.post('/api/users', apiUsers.create);

app.get('/api/terms/translation', apiTranslation.get);
app.delete('/api/terms/:id', apiTerms.remove);
app.post('/api/terms', apiTerms.create);
app.patch('/api/terms', apiTerms.edit);
app.get('/api/terms', apiTerms.search);

app.get('/api/pages/all', apiPages.searchAll);
app.get('/api/pages', apiPages.search);
// app.post('/api/pages', apiPages.create);  // ???
app.patch('/api/pages', apiPages.edit);
app.delete('/api/pages', apiPages.remove);

// serve static
app.use(express.static(path.join(__dirname, '/client')));
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

app.listen(config.app.port);

logger.info(`Listening on port ${config.app.port}...`);

module.exports = app;
