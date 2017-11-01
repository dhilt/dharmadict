const assert = require('assert');
const { request, shouldLogIn, shouldNotLogIn } = require('./_shared.js');
const { testAdmin, testTranslator, testTranslator2 } = require('./_shared.js');

const currentPassword = testTranslator.password;
const newPassword = 'new_password';

const requestObj = {
  payload: {
    currentPassword,
    newPassword,
    confirmPassword: newPassword
  }
};

describe('Update translator API', () => {

  const queryUpdateTranslator = '/api/translators/' + testTranslator.id;

  it('should work', (done) => {
    request.patch(queryUpdateTranslator).end(
      (err, res) => {
        res.should.have.status(200);
        done();
      }
    )
  });

  it('should not update translator password (auth needed)', (done) => {
    request.patch(queryUpdateTranslator)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update password. Authorization needed");
          done();
        }
      )
  });

  shouldLogIn(testTranslator2);

  it('should not update translator password (invalid user)', (done) => {
    request.patch(queryUpdateTranslator)
      .set('Authorization', 'Bearer ' + testTranslator2.token)
      .send(requestObj)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update password. Unpermitted success");
          done();
        }
      )
  });

  shouldLogIn(testAdmin);

  it('should not update translator password (invalid user)', (done) => {
    request.patch(queryUpdateTranslator)
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send(requestObj)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update password. Unpermitted success");
          done();
        }
      )
  });

  shouldLogIn(testTranslator);

  it('should not update translator password (no payload)', (done) => {
    let _requestObj = Object.assign({}, requestObj);
    delete _requestObj.payload;
    request.patch(queryUpdateTranslator)
      .set('Authorization', 'Bearer ' + testTranslator.token)
      .send(_requestObj)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update password. Invalid payload");
          done();
        }
      )
  });

  it('should not update translator password (invalid payload)', (done) => {
    let _requestObj = Object.assign({}, requestObj);
    _requestObj.payload = false;
    request.patch(queryUpdateTranslator)
      .set('Authorization', 'Bearer ' + testTranslator.token)
      .send(_requestObj)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update password. Invalid payload");
          done();
        }
      )
  });

  it('should not update translator password (no id)', (done) => {
    let _requestObj = Object.assign({}, requestObj);
    request.patch('/api/translators/')
      .set('Authorization', 'Bearer ' + testTranslator.token)
      .send(_requestObj)
      .end(
        (err, res) => {
          res.should.have.status(404);
          done();
        }
      )
  });

  it('should not update translator password (translator not found)', (done) => {
    let _requestObj = Object.assign({}, requestObj);
    request.patch('/api/translators/INEXISTENT_USER!')
      .set('Authorization', 'Bearer ' + testTranslator.token)
      .send(_requestObj)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update password. Unpermitted success");
          done();
        }
      )
  });

  it('should not update translator password (invalid currentPassword)', (done) => {
    let _requestObj = JSON.parse(JSON.stringify(requestObj));
    _requestObj.payload['currentPassword'] = false;
    request.patch(queryUpdateTranslator)
      .set('Authorization', 'Bearer ' + testTranslator.token)
      .send(_requestObj)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update password. Invalid current password");
          done();
        }
      )
  });

  it('should not update translator password (invalid newPassword)', (done) => {
    let _requestObj = JSON.parse(JSON.stringify(requestObj));
    _requestObj.payload['newPassword'] = false;
    request.patch(queryUpdateTranslator)
      .set('Authorization', 'Bearer ' + testTranslator.token)
      .send(_requestObj)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update password. Invalid new password");
          done();
        }
      )
  });

  it('should not update translator password (invalid confirmPassword)', (done) => {
    let _requestObj = JSON.parse(JSON.stringify(requestObj));
    _requestObj.payload['confirmPassword'] = false;
    request.patch(queryUpdateTranslator)
      .set('Authorization', 'Bearer ' + testTranslator.token)
      .send(_requestObj)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update password. Invalid password confirmation");
          done();
        }
      )
  });

  it('should not update translator password (password is too short)', (done) => {
    let _requestObj = JSON.parse(JSON.stringify(requestObj));
    _requestObj.payload['newPassword'] = 'short';
    request.patch(queryUpdateTranslator)
      .set('Authorization', 'Bearer ' + testTranslator.token)
      .send(_requestObj)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update password. Password is too short");
          done();
        }
      )
  });

  it('should not update translator password (password is not confirmed)', (done) => {
    let _requestObj = JSON.parse(JSON.stringify(requestObj));
    _requestObj.payload['newPassword'] = 'password';
    _requestObj.payload['confirmPassword'] = 'password_';
    request.patch(queryUpdateTranslator)
      .set('Authorization', 'Bearer ' + testTranslator.token)
      .send(_requestObj)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update password. Password is not confirmed");
          done();
        }
      )
  });

  it('should not update translator password (passwords does not match)', (done) => {
    let _requestObj = JSON.parse(JSON.stringify(requestObj));
    _requestObj.payload['currentPassword'] = 'wrong_password';
    request.patch(queryUpdateTranslator)
      .set('Authorization', 'Bearer ' + testTranslator.token)
      .send(_requestObj)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update password. The password does not match the current one");
          done();
        }
      )
  });

  it('should update translator password', (done) => {
    let _requestObj = JSON.parse(JSON.stringify(requestObj));
    _requestObj.payload['currentPassword'] = testTranslator.password;
    request.patch(queryUpdateTranslator)
      .set('Authorization', 'Bearer ' + testTranslator.token)
      .send(_requestObj)
      .end(
        (err, res) => {
          assert.equal(res.body.success, true);
          assert.equal(res.body.user.id, testTranslator.id);
          assert.equal(res.body.user.role, testTranslator.role);
          assert.equal(res.body.user.language, testTranslator.language);
          done();
        }
      )
  });

  let translatorWithOldPassword = JSON.parse(JSON.stringify(testTranslator));
  let translatorWithNewPassword = JSON.parse(JSON.stringify(testTranslator));
  translatorWithNewPassword['password'] = newPassword;

  shouldNotLogIn(translatorWithOldPassword);
  shouldLogIn(translatorWithNewPassword);
});
