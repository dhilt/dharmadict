const assert = require('assert');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../prod/server.js');

process.env.NODE_ENV = 'test';

chai.use(chaiHttp);
const request = chai.request(server);

describe('Common', () => {

  it('should work', (done) => {
    request.get('/api/test?param=test')
      .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          assert.equal(res.body.success, true);
          assert.equal(res.body.param, 'test');
          done();
        }
      );
  });

});
