const assert = require('assert');
const request = require('./_shared.js').request;
const shouldLogIn = require('./_shared.js').shouldLogIn;
const testAdmin = require('./_shared.js').testAdmin;
const testTranslator = require('./_shared.js').testTranslator;

const requestObj = {
  userId: testTranslator.id,
  payload: {
    name: 'Name of test-translator',
    language: 'eng',
    description: 'New description written by admin'
  }
};

describe('Update user API', () => {

  it('should work', (done) => {
    request.post('/api/updateUser').end(
      (err, res) => {
        res.should.have.status(200);
        done();
      }
    )
  });

  it('should not update user information (auth needed)', (done) => {
    request.post('/api/updateUser')
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
    request.post('/api/updateUser')
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
    request.post('/api/updateUser')
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
    request.post('/api/updateUser')
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
    delete _requestObj['userId'];
    request.post('/api/updateUser')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send(_requestObj)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update translator description. Invalid id");
          done();
        }
      )
  });

  it('should not update user information (invalid id)', (done) => {
    let _requestObj = Object.assign({}, requestObj);
    _requestObj['userId'] = false;
    request.post('/api/updateUser')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send(_requestObj)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update translator description. Invalid id");
          done();
        }
      )
  });

  it('should not update user information (user not found)', (done) => {
    let _requestObj = Object.assign({}, requestObj);
    _requestObj['userId'] += '-UNEXISTED!';
    request.post('/api/updateUser')
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
    request.post('/api/updateUser')
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
    request.post('/api/updateUser')
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
    request.post('/api/updateUser')
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
    request.post('/api/updateUser')
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

  it('should update user information', (done) => {
    request.post('/api/updateUser')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send(requestObj)
      .end(
        (err, res) => {
          assert.equal(res.body.success, true);
          assert.equal(res.body.user.description, requestObj.payload.description);
          done();
        }
      )
  });

  it('should cleanup user name', (done) => {
    let _requestObj = JSON.parse(JSON.stringify(requestObj));
    _requestObj.payload['name'] = '  ';
    request.post('/api/updateUser')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send(_requestObj)
      .end(
        (err, res) => {
          assert.equal(res.body.success, true);
          assert.equal(res.body.user.name, '');
          done();
        }
      )
  });

  it('should cleanup user language', (done) => {
    let _requestObj = JSON.parse(JSON.stringify(requestObj));
    _requestObj.payload['language'] = '  ';
    request.post('/api/updateUser')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send(_requestObj)
      .end(
        (err, res) => {
          assert.equal(res.body.success, true);
          assert.equal(res.body.user.language, '');
          done();
        }
      )
  });

  it('should cleanup user description', (done) => {
    let _requestObj = JSON.parse(JSON.stringify(requestObj));
    _requestObj.payload['description'] = '  ';
    request.post('/api/updateUser')
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
