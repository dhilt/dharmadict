const assert = require('assert');
const request = require('./_shared.js').request;
const shouldLogIn = require('./_shared.js').shouldLogIn;
const testAdmin = require('./_shared.js').testAdmin;
const testTranslator = require('./_shared.js').testTranslator;
const testUpdateTranslatorDescription = require('./_shared.js').testUpdateTranslatorDescription;

describe('Update user API', () => {

  shouldLogIn(testTranslator);

  it('should not update user description (Admin only)', (done) => {
    let userDescription = Object.assign({}, testUpdateTranslatorDescription);
    request.post('/api/updateUserDescription')
      .set('Authorization', 'Bearer ' + testTranslator.token)
      .send({userNewDescription: userDescription})
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
    let userDescription = Object.assign({}, testUpdateTranslatorDescription);
    delete userDescription['id'];
    request.post('/api/updateUserDescription')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send({userNewDescription: userDescription})
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update translator description. Invalid id");
          done();
        }
      )
  });

  it('should not update user description (no description)', (done) => {
    let userDescription = Object.assign({}, testUpdateTranslatorDescription);
    delete userDescription['description'];
    request.post('/api/updateUserDescription')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send({userNewDescription: userDescription})
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update translator description. Invalid description");
          done();
        }
      )
  });

  it('should not update user description (invalid id)', (done) => {
    let userDescription = Object.assign({}, testUpdateTranslatorDescription);
    userDescription['id'] = {obj: 'wrong_id'};
    request.post('/api/updateUserDescription')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send({userNewDescription: userDescription})
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update translator description. Invalid id");
          done();
        }
      )
  });

  it('should not update user description (invalid description)', (done) => {
    let userDescription = Object.assign({}, testUpdateTranslatorDescription);
    userDescription['description'] = {obj: 'wrong_description'};
    request.post('/api/updateUserDescription')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send({userNewDescription: userDescription})
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update translator description. Invalid description");
          done();
        }
      )
  });

  it('should update user description', (done) => {
    let userDescription = Object.assign({}, testUpdateTranslatorDescription);
    request.post('/api/updateUserDescription')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send({userNewDescription: userDescription})
      .end(
        (err, res) => {
          assert.equal(res.body.user.description, testUpdateTranslatorDescription.description);
          assert.equal(res.body.success, true);
          done();
        }
      )
  });
});
