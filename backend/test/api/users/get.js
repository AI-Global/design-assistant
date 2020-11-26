
const expect = require('chai').expect;
const request = require('supertest');
const { mongo } = require('mongoose');
const app = require('../../../app.js');

var Mongoose = require('mongoose').Mongoose;
var mongoose = new Mongoose();

var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

require('dotenv').config();

const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmYjA5YjRlMjFmODVkOGI0YzcwYzhiYSIsImlhdCI6MTYwNTQwOTk4NiwiZXhwIjoxNjA4MDAxOTg2fQ.MEC2Jm1VB3ai07__NPeTeFaNexh-VjdTdlxz6vaB5mM";

// Conenct to DB. 
function connect() {
    return new Promise((resolve, reject) => {
        mongoose.connect(process.env.DB_CONNECTION,
            { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
            .then((res, err) => {
                if (err) return reject(err);
                resolve();
            });
    });
}

// Test for GET all users endpoint
describe('GET /users', () => {
    
});

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

