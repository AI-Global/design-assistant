require('dotenv').config();
process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../../app.js');

var userID = "";
var authToken = "";

describe('POST /users', () => {
    const user = {
        "email": "test@backend",
        "username": "test@backend",
        "password": "Test123!",
        "passwordConfirmation": "Test123!"
    }

    it('Creating a new user', (done) => {
        request(app).post('/users/create')
            .send(user)
            .then((res) => {
                const body = res.body;
                expect(body).to.contain.property('token');
                expect(body.user).to.contain.property('id');
                expect(body.user).to.contain.property('email');
                userID = body["user"]["id"];
                authToken = body["token"];
                done();
            })
            .catch((err) => done(err));
    });

    it('Creating an invalid user', (done) => {
        request(app).post('/users/create')
            .send(user)
            .expect(422, done);
    });

});

// Test for GET all users endpoint
describe('GET /users', () => {

    // test getting all users with valid auth token
    it('get all users by auth token returns all valid users', (done) => {
        request(app).get('/users')
        .then((res) => {
            const users = res.body;

            // iterate through all returned users and assert they contain valid fields
            for (let i = 0; i < users.length; ++i) {
                expect(users[i]).to.contain.property('role');
                expect(users[i]).to.contain.property('_id');
                expect(users[i]).to.contain.property('email');
                expect(users[i]).to.contain.property('username');
            }
            done();
        })
        .catch((err) => done(err));
    });
});

describe('GET /users/{USER_ID}', () => {
    it('Getting user by user ID', (done) => {
        request(app).get('/users/' + userID)
            .then((res) => {
                const body = res.body;
                expect(body).to.contain.property('role');
                expect(body).to.contain.property('username');
                expect(body).to.contain.property('email');
                done();
            })
            .catch((err) => done(err));
    });
});

describe('POST /users/auth', () => {
    it('Authorize user', (done) => {
        request(app).post('/users/auth')
            .send({
                "username": "test@backend",
                "password": "Test123!"
            })
            .then((res) => {
                const body = res.body;
                expect(body).to.contain.property('token');
                expect(body).to.contain.property('user');
                done();
            })
            .catch((err) => done(err));
    });

    it('Authorize user with invalid credentials', (done) => {
        request(app).post('/users/auth')
            .send({
                "username": "test@backend",
                "password": "Test123!!"
            }).expect(400, done);
    });

    it('Getting user by invalid authorization token', (done) => {
        request(app).get('/users/user')
            .set('x-auth-token', "")
            // denied authorization 
            .expect(401, done);
    });

});

describe('DELETE /users/{ID}', () => {
    it('Delete user by user ID ', (done) => {
        request(app).delete('/users/' + userID)
            .then((res) => {
                done();
            })
            .catch((err) => done(err));
    });
});
