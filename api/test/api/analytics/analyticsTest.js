process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../../app.js');

describe('POST /analytics', () => {
  it('Posting an analytic', (done) => {
    request(app)
      .post('/analytics')
      .send({
        analyticName: 'New Analytic',
        embed:
          "<iframe width='50' height='50' seamless frameborder='0' scrolling='no' src='...'></iframe>",
      })
      .then((res) => {
        const body = res.body;

        expect(body).to.contain.property('analyticName');
        expect(body).to.contain.property('embed');

        done();
      })
      .catch((err) => done(err));
  });
});

describe('POST /analytics', () => {
  it('Posting an invalid analytic', (done) => {
    request(app)
      .post('/analytics')
      .send({ badRequest: [1] })
      .expect(400, done);
  });
});

describe('GET /analytics', () => {
  it('Getting all analytics', (done) => {
    request(app)
      .get('/analytics')
      .then((res) => {
        const body = res.body;
        // Check analytic we added is here
        expect(body.analytics.length).to.be.above(0);
        expect(body.analytics[0]).to.contain.property('analyticName');
        expect(body.analytics[0]).to.contain.property('embed');

        done();
      })
      .catch((err) => done(err));
  });
});
