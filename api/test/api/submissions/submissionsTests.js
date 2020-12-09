process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../../app.js');

var userID = '';
var postID = '';

describe('POST /submissions', () => {
  it('Posting a submission', (done) => {
    request(app)
      .post('/submissions')
      .send({
        lifecycle: [1],
        domain: [1],
        region: [1],
        roles: [1],
        _id: '5fbf94ef87cf743a987966f0',
        userId: '5fbedcc151e3437dd437eb0a',
        projectName: '',
        date: '2020-11-26T11:43:43.650Z',
        completed: true,
        submission: {},
      })
      .then((res) => {
        const body = res.body;
        expect(body).to.contain.property('userId');
        expect(body).to.contain.property('projectName');
        expect(body).to.contain.property('date');
        expect(body).to.contain.property('lifecycle');
        expect(body).to.contain.property('completed');
        expect(body).to.contain.property('domain');
        expect(body).to.contain.property('region');
        expect(body).to.contain.property('roles');
        userID = body['userId'];
        postID = body['_id'];
        done();
      })
      .catch((err) => done(err));
  });
});

describe('GET /submissions', () => {
  it('Getting all submissions', (done) => {
    request(app)
      .get('/submissions')
      .then((res) => {
        const body = res.body;
        expect(body[0]).to.contain.property('userId');
        expect(body[0]).to.contain.property('projectName');
        expect(body[0]).to.contain.property('date');
        expect(body[0]).to.contain.property('lifecycle');
        expect(body[0]).to.contain.property('completed');

        done();
      })
      .catch((err) => done(err));
  });
});

describe('GET /submissions/user/{UID}', () => {
  it('Getting submission by user ID ', (done) => {
    request(app)
      .get('/submissions/user/' + userID)
      .then((res) => {
        const body = res.body.submissions;
        expect(body[0]).to.contain.property('userId');
        expect(body[0]).to.contain.property('projectName');
        expect(body[0]).to.contain.property('date');
        expect(body[0]).to.contain.property('lifecycle');
        expect(body[0]).to.contain.property('completed');
        done();
      })
      .catch((err) => done(err));
  });
});

describe('DELETE /submissions/{ID}', () => {
  it('Delete submission by submission ID ', (done) => {
    request(app)
      .delete('/submissions/delete/' + postID)
      .expect(200, done);
  });
});
