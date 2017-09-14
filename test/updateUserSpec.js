const assert = require('assert');
const request = require('./_shared.js').request;
const shouldLogIn = require('./_shared.js').shouldLogIn;
const testAdmin = require('./_shared.js').testAdmin;
const testTranslator = require('./_shared.js').testTranslator;

const payload = {
  id: testTranslator.id,
  description: "New description written by admin"
};

describe('Update user API', () => {

  it('should work', (done) => {
    request.post('/api/updateUserDescription').end(
      (err, res) => {
        res.should.have.status(200);
        done();
      }
    )
  });

  it('should not create new term (auth needed)', (done) => {
    request.post('/api/updateUserDescription')
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update translator description. Authorization needed");
          done();
        }
      )
  });

  shouldLogIn(testTranslator);

  it('should not update user description (admin only)', (done) => {
    request.post('/api/updateUserDescription')
      .set('Authorization', 'Bearer ' + testTranslator.token)
      .send({userNewDescription: payload})
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update translator description. Admin only");
          done();
        }
      )
  });

  shouldLogIn(testAdmin);

  it('should not update user description (no data)', (done) => {
    request.post('/api/updateUserDescription')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send('123')
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update translator description. Invalid data");
          done();
        }
      )
  });

  it('should not update user description (no id)', (done) => {
    let _payload = Object.assign({}, payload);
    delete _payload['id'];
    request.post('/api/updateUserDescription')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send({userNewDescription: _payload})
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update translator description. Invalid id");
          done();
        }
      )
  });

  it('should not update user description (no description)', (done) => {
    let _payload = Object.assign({}, payload);
    delete _payload['description'];
    request.post('/api/updateUserDescription')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send({userNewDescription: _payload})
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update translator description. Invalid description");
          done();
        }
      )
  });

  it('should not update user description (invalid id)', (done) => {
    let _payload = Object.assign({}, payload);
    _payload['id'] = {};
    request.post('/api/updateUserDescription')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send({userNewDescription: _payload})
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update translator description. Invalid id");
          done();
        }
      )
  });

  it('should not update user description (invalid description)', (done) => {
    let _payload = Object.assign({}, payload);
    _payload['description'] = {};
    request.post('/api/updateUserDescription')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send({userNewDescription: _payload})
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update translator description. Invalid description");
          done();
        }
      )
  });

  it('should not update user description (user with this id doesn\'t exist)', (done) => {
    let _payload = Object.assign({}, payload);
    _payload['id'] = 'UNEXISTENT-TRANSLATOR!';
    request.post('/api/updateUserDescription')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send({userNewDescription: _payload})
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update translator description. No user found");
          done();
        }
      )
  });

  it('should update user description', (done) => {
    request.post('/api/updateUserDescription')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send({userNewDescription: payload})
      .end(
        (err, res) => {
          assert.equal(res.body.user.description, payload.description);
          assert.equal(res.body.success, true);
          done();
        }
      )
  });
});
