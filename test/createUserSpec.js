const assert = require('assert');
const testAdmin = require('./_shared.js').testAdmin;
const testTranslator = require('./_shared.js').testTranslator;
const testTranslator_2 = require('./_shared.js').testTranslator_2;

const usersController = require('../prod/controllers/users.js');

describe('Create user ctrl method', () => {

  it('should not create user (no data)', (done) => {
    usersController.create()
      .then(result => done(new Error('User was created')))
      .catch(error => {
        assert.equal(error.text, 'Invalid data');
        done();
      })
  });

  const shouldNotCreateUser = (invalidKey) => {
    it('should not create user (no ' + invalidKey + ')', (done) => {
      let user = Object.assign({}, testAdmin);
      delete user[invalidKey];
      usersController.create(user)
        .then(result => done(new Error('User was created')))
        .catch(error => {
          assert.equal(error.text, 'Invalid ' + invalidKey);
          done();
        })
    });
  };

  shouldNotCreateUser('id');
  shouldNotCreateUser('name');
  shouldNotCreateUser('role');
  shouldNotCreateUser('login');
  shouldNotCreateUser('password');

  it('should create admin user', (done) => {
    usersController.create(testAdmin)
      .then(result => {
        assert.equal(result.success, true);
        done();
      })
      .catch(error => done(error))
  });

  it('should create translator user', (done) => {
    usersController.create(testTranslator)
      .then(result => {
        assert.equal(result.success, true);
        done();
      })
      .catch(error => done(error))
  });

  it('should create translator-2 user', (done) => {
    usersController.create(testTranslator_2)
      .then(result => {
        assert.equal(result.success, true);
        done();
      })
      .catch(error => done(error))
  });

  it('should not create the same (by login) user', (done) => {
    usersController.create(testAdmin)
      .then(result => done(new Error('User was created')))
      .catch(error => {
        assert.equal(error.text, 'Login not unique');
        done();
      })
  });

  it('should not create the same (by id) user', (done) => {
    let user = Object.assign({}, testAdmin);
    user.login = user.login + 'NEW';
    usersController.create(user)
      .then(result => done(new Error('User was created')))
      .catch(error => {
        assert.equal(error.text, 'Id not unique');
        done();
      })
  });

});
