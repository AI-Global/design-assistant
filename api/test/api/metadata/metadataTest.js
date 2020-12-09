process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../../app.js');

describe('GET /metadata', () => {
  it('Getting metadata', (done) => {
    request(app)
      .get('/metadata')
      .then((res) => {
        const body = res.body;
        expect(body).to.contain.property('domain');
        expect(body).to.contain.property('lifecycle');
        expect(body).to.contain.property('region');
        expect(body).to.contain.property('roles');

        done();
      })
      .catch((err) => done(err));
  });
});
