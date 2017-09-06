const request = require('./_shared.js').request;
const assert = require('./_shared.js').assert;
const usersController = require('../prod/controllers/users.js');

const testAdmin = {
  "id": "TEST-ADMIN",
  "role": "admin",
  "roleId": 2,
  "login": "test-admin",
  "name": "Test Admin",
  "description": "...",
  "password": "test-admin-pass"
};

describe('Login API', () => {

  it('should work', (done) => {
    request.post('/api/login').end(
      (err, res) => {
        res.should.have.status(200);
        done();
      }
    )
  });

  it('should not log in (no params)', (done) => {
    request.post('/api/login').end(
      (err, res) => {
        assert.notEqual(res.body.success, true);
        assert.equal(res.body.message, "Can't login. Invalid params");
        done();
      }
    )
  });

  it('should not log in (wrong login)', (done) => {
    request.post('/api/login').send({
      login: 'test',
      password: 'test'
    }).end(
      (err, res) => {
        assert.notEqual(res.body.success, true);
        assert.equal(res.body.message, "Can't login. No user found");
        done();
      }
    )
  });

  it('should create user (via controller)', (done) => {
    usersController.create(testAdmin)
      .then(result => {
        assert.equal(result.success, true);
        done();
      })
      .catch(error => done(error))
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