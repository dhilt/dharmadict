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

  it('should not update user information (auth needed)', (done) => {
    request.patch(queryUpdateUser)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update translator description. Authorization needed");
          done();
        }
      )
  });

  shouldLogIn(testTranslator);

  it('should not update user information (admin only)', (done) => {
    request.patch(queryUpdateUser)
      .set('Authorization', 'Bearer ' + testTranslator.token)
      .send(requestObj)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update translator description. Admin only");
          done();
        }
      )
  });

  shouldLogIn(testAdmin);

  it('should not update user information (no payload)', (done) => {
    let _requestObj = Object.assign({}, requestObj);
    delete _requestObj.payload;
    request.patch(queryUpdateUser)
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send(_requestObj)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update translator description. Invalid payload");
          done();
        }
      )
  });

  it('should not update user information (invalid payload)', (done) => {
    let _requestObj = Object.assign({}, requestObj);
    _requestObj.payload = false;
    request.patch(queryUpdateUser)
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send(_requestObj)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update translator description. Invalid payload");
          done();
        }
      )
  });

  it('should not update user information (no id)', (done) => {
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

  it('should not update user information (user not found)', (done) => {
    let _requestObj = Object.assign({}, requestObj);
    request.patch('/api/users/INEXISTENT_USER!')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send(_requestObj)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update translator description. No user found");
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
          assert.equal(res.body.message, "Can't update translator description. Invalid name");
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
          assert.equal(res.body.message, "Can't update translator description. Invalid language");
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
          assert.equal(res.body.message, "Can't update translator description. Invalid language");
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
          assert.equal(res.body.message, "Can't update translator description. Invalid description");
          done();
        }
      )
  });

  it('should not update user if no name', (done) => {
    let _requestObj = JSON.parse(JSON.stringify(requestObj));
    delete _requestObj.payload['name'];
    request.patch(queryUpdateUser)
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send(_requestObj)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update translator description. Invalid name");
          done();
        }
      )
  });

  it('should not update user if no language', (done) => {
    let _requestObj = JSON.parse(JSON.stringify(requestObj));
    delete _requestObj.payload['language'];
    request.patch(queryUpdateUser)
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send(_requestObj)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update translator description. Invalid language");
          done();
        }
      )
  });

  it('should update user information', (done) => {
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

  it('should not cleanup user name', (done) => {
    let _requestObj = JSON.parse(JSON.stringify(requestObj));
    _requestObj.payload['name'] = '  ';
    request.patch(queryUpdateUser)
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send(_requestObj)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update translator description. Invalid name");
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
