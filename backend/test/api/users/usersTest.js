/*
require('dotenv').config();
process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../../app.js');

describe('GET /users/user', () => {
    before((done) => {
        connect()
            .then(() => done())
            .catch((err) => done(err));

    });

    after((done) => {
        connect()
            .then(() => done())
            .catch((err) => done(err));

    });

    // test invalid auth token 
    it('get user by invalid auth token returns error', (done) => {
        request(app).get('/users/user')
        .set('x-auth-token', 'test')
        .then((res) => {
            const body = res.body;
            expect(body).to.contain.property('msg');
            done();
        })
        .catch((err) => done(err));
    });
    
    // test valid auth token
    it('get user by auth token returns user', (done) => {
        request(app).get('/users/user')
        .set('x-auth-token', testToken)
        .then((res) => {
            const body = res.body;
            expect(body).to.contain.property('role');
            expect(body).to.contain.property('_id');
            expect(body).to.contain.property('email');
            expect(body).to.contain.property('username');
            done();
        })
        .catch((err) => done(err));
    });
});

describe('GET /users/isLoggedIn', () => {
    before((done) => {
        connect()
            .then(() => done())
            .catch((err) => done(err));

    });

    after((done) => {
        connect()
            .then(() => done())
            .catch((err) => done(err));

    });

    // test invalid auth token
    it('get user by invalid auth token returns error', (done) => {
        request(app).get('/users/isLoggedIn')
        .set('x-auth-token', 'test')
        .then((res) => {
            const body = res.body;
            expect(body).to.contain.property('msg');
            done();
        })
        .catch((err) => done(err));
    });

    // test valid auth token
    it('get user by valid auth token returns status', (done) => {
        request(app).get('/users/isLoggedIn')
        .set('x-auth-token', testToken)
        .then((res) => {
            const body = res.body;
            expect(body).to.contain.property('isLoggedIn');
            done();
        })
        .catch((err) => done(err));
    });
});

*/