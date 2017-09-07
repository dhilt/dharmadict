const assert = require('assert');
const testAdmin = require('./_shared.js').testAdmin;

const usersController = require('../prod/controllers/users.js');

describe('Delete user ctrl method', () => {

  it('should not delete user (no id)', (done) => {
    usersController.removeById()
      .then(result => done(new Error('User was deleted')))
      .catch(error => {
        assert.equal(error.text, 'Invalid id');
        done();
      })
  });

  it('should not delete user (wrong id)', (done) => {
    usersController.removeById('unexisted_user_id')
      .then(result => done(new Error('User was deleted')))
      .catch(error => {
        assert.equal(error.text, 'No user found');
        done();
      })
  });

  it('should delete user (via controller)', (done) => {
    usersController.removeById(testAdmin.id)
      .then(result => {
        assert.equal(result.success, true);
        done();
      })
      .catch(error => done(error))
  });

});