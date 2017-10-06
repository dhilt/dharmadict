const assert = require('assert');
const request = require('./_shared.js').request;
const shouldLogIn = require('./_shared.js').shouldLogIn;
const testAdmin = require('./_shared.js').testAdmin;
const testTranslator = require('./_shared.js').testTranslator;

const requestObj = {
  payload: {
    name: 'Name of test-translator',
    language: 'en',
    description: 'New description written by admin'
  }
};

describe('Update user API', () => {

  const queryUpdateUser = '/api/users/' + testTranslator.id;

  it('should work', (done) => {
    request.patch(queryUpdateUser).end(
      (err, res) => {
        res.should.have.status(200);
        done();
      }
    )
  });

  it('should not update user data (auth needed)', (done) => {
    request.patch(queryUpdateUser)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update user data. Authorization needed");
          done();
        }
      )
  });

  shouldLogIn(testTranslator);

  it('should not update user data (admin only)', (done) => {
    request.patch(queryUpdateUser)
      .set('Authorization', 'Bearer ' + testTranslator.token)
      .send(requestObj)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update user data. Admin only");
          done();
        }
      )
  });

  shouldLogIn(testAdmin);

  it('should not update user data (no payload)', (done) => {
    let _requestObj = Object.assign({}, requestObj);
    delete _requestObj.payload;
    request.patch(queryUpdateUser)
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send(_requestObj)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update user data. Invalid payload");
          done();
        }
      )
  });

  it('should not update user data (invalid payload)', (done) => {
    let _requestObj = Object.assign({}, requestObj);
    _requestObj.payload = false;
    request.patch(queryUpdateUser)
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send(_requestObj)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update user data. Invalid payload");
          done();
        }
      )
  });

  it('should not update user data (no id)', (done) => {
    let _requestObj = Object.assign({}, requestObj);
    request.patch('/api/users/')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send(_requestObj)
      .end(
        (err, res) => {
          res.should.have.status(404);
          done();
        }
      )
  });

  it('should not update user data (user not found)', (done) => {
    let _requestObj = Object.assign({}, requestObj);
    request.patch('/api/users/INEXISTENT_USER!')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send(_requestObj)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update user data. No user found");
          done();
        }
      )
  });

  it('should not update user name (invalid name)', (done) => {
    let _requestObj = JSON.parse(JSON.stringify(requestObj));
    _requestObj.payload['name'] = false;
    request.patch(queryUpdateUser)
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send(_requestObj)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update user data. Invalid name");
          done();
        }
      )
  });

  it('should not update user language (invalid language)', (done) => {
    let _requestObj = JSON.parse(JSON.stringify(requestObj));
    _requestObj.payload['language'] = false;
    request.patch(queryUpdateUser)
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send(_requestObj)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update user data. Invalid language");
          done();
        }
      )
  });

  it('should not update user language (invalid language)', (done) => {
    let _requestObj = JSON.parse(JSON.stringify(requestObj));
    _requestObj.payload['language'] = 'russian';
    request.patch(queryUpdateUser)
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send(_requestObj)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update user data. Invalid language");
          done();
        }
      )
  });

  it('should not update user description (invalid description)', (done) => {
    let _requestObj = JSON.parse(JSON.stringify(requestObj));
    _requestObj.payload['description'] = false;
    request.patch(queryUpdateUser)
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send(_requestObj)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update user data. Invalid description");
          done();
        }
      )
  });

  it('should update user data', (done) => {
    request.patch(queryUpdateUser)
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send(requestObj)
      .end(
        (err, res) => {
          assert.equal(res.body.success, true);
          assert.equal(res.body.user.name, requestObj.payload.name);
          assert.equal(res.body.user.language, requestObj.payload.language);
          assert.equal(res.body.user.description, requestObj.payload.description);
          done();
        }
      )
  });

  it('should not update user data (short password)', (done) => {
    let _requestObj = JSON.parse(JSON.stringify(requestObj));
    _requestObj.payload['password'] = 'short';
    _requestObj.payload['confirmPassword'] = 'short';
    request.patch(queryUpdateUser)
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send(_requestObj)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.code, 500);
          assert.equal(res.body.message, "Can't update user data. Password is too short");
          done();
        }
      )
  });

  it('should not update user data (Invalid password)', (done) => {
    let _requestObj = JSON.parse(JSON.stringify(requestObj));
    _requestObj.payload['password'] = 123;
    _requestObj.payload['confirmPassword'] = 123;
    request.patch(queryUpdateUser)
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send(_requestObj)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.code, 500);
          assert.equal(res.body.message, "Can't update user data. Invalid password");
          done();
        }
      )
  });

  it('should not update user data (Password not confirmed)', (done) => {
    let _requestObj = JSON.parse(JSON.stringify(requestObj));
    _requestObj.payload['password'] = 'new_password';
    _requestObj.payload['confirmPassword'] = 'new_password____';
    request.patch(queryUpdateUser)
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send(_requestObj)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.code, 500);
          assert.equal(res.body.message, "Can't update user data. Password not confirmed");
          done();
        }
      )
  });

  it('should update user data (with new password)', (done) => {
    let _requestObj = JSON.parse(JSON.stringify(requestObj));
    _requestObj.payload['password'] = 'new_password';
    _requestObj.payload['confirmPassword'] = 'new_password';
    request.patch(queryUpdateUser)
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send(_requestObj)
      .end(
        (err, res) => {
          assert.equal(res.body.success, true);
          assert.equal(res.body.user.name, requestObj.payload.name);
          assert.equal(res.body.user.language, requestObj.payload.language);
          assert.equal(res.body.user.description, requestObj.payload.description);
          done();
        }
      )
  });

  shouldLogIn(Object.assign(testTranslator, {password: 'new_password'}));

  it('should not cleanup user name', (done) => {
    let _requestObj = JSON.parse(JSON.stringify(requestObj));
    _requestObj.payload['name'] = '  ';
    request.patch(queryUpdateUser)
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send(_requestObj)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update user data. Invalid name");
          done();
        }
      )
  });

  it('should cleanup user description', (done) => {
    let _requestObj = JSON.parse(JSON.stringify(requestObj));
    _requestObj.payload['description'] = '  ';
    request.patch(queryUpdateUser)
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send(_requestObj)
      .end(
        (err, res) => {
          assert.equal(res.body.success, true);
          assert.equal(res.body.user.description, '');
          done();
        }
      )
  });
});
