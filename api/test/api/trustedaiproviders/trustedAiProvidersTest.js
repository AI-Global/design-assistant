process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../../app.js');

var providerID = '';

describe('PUT /trustedaiproviders', () => {
  it('add new trusted ai provider', (done) => {
    request(app)
      .put('/trustedaiproviders')
      .send({
        resource: 'testprovider',
        description: '',
        source: 'test',
      })
      .then((res) => {
        const body = res.body;
        expect(body).to.contain.property('_id');
        expect(body).to.contain.property('resource');
        expect(body).to.contain.property('description');
        expect(body).to.contain.property('source');
        providerID = body['_id'];
        done();
      })
      .catch((err) => done(err));
  });

  it('update trusted ai provider', (done) => {
    request(app)
      .put('/trustedaiproviders/' + providerID)
      .send({
        resource: 'updatedTestprovider',
        description: '',
        source: 'test',
      })
      .then((res) => {
        const body = res.body;
        expect(body).to.contain.property('_id');
        expect(body).to.contain.property('resource');
        expect(body).to.contain.property('description');
        expect(body).to.contain.property('source');
        done();
      })
      .catch((err) => done(err));
  });
});

describe('GET /trustedaiproviders', () => {
  // Test getting surveyJS questions JSON
  it('Getting all trusted ai providers', (done) => {
    request(app)
      .get('/trustedaiproviders')
      .then((res) => {
        const body = res.body;

        // checks that all providers are valid
        for (let i = 0; i < body.length; ++i) {
          expect(body[i]).to.contain.property('_id');
          expect(body[i]).to.contain.property('resource');
          expect(body[i]).to.contain.property('description');
          expect(body[i]).to.contain.property('source');
        }

        done();
      })
      .catch((err) => done(err));
  });
});

describe('DELETE /trustedaiproviders', () => {
  it('delete trusted ai provider by id', (done) => {
    request(app)
      .delete('/trustedaiproviders/' + providerID)
      .then((res) => {
        done();
      })
      .catch((err) => done(err));
  });
});
