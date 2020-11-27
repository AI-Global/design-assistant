require('dotenv').config();
process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../../app.js');

var userID = "5fc011112338b2f0d85aaae5"

//var postID = ""

//new User({email, username, password, organization})
/*describe('POST /users/create', () => {

    it('Posting a user', (done) => {
        request(app).post('/users/create')
        .send({
            "username": "user123123",
            "email": "mairala@email.com",
            "password": "Ridwan888/",
            "passwordConfirmation": "Ridwan888/",
        })
        .then((res) => {
            const body = res.body;
            expect(body).to.contain.property('token');
            expect(body).to.contain.property('user');
            done();
        })
        .catch((err) => done(err));
    });

});*/

// describe('GET /users', () => {

//     it('Getting all users', (done) => {
//         request(app).get('/users')
//         .then((res) => {
//             const body = res.body;
//             expect(body[0]).to.contain.property('role');
//             expect(body[0]).to.contain.property('username');
//             expect(body[0]).to.contain.property('email');
//             done();
//         })
//         .catch((err) => done(err));
//     });

// });

// Test for GET all users endpoint
describe('GET /users', () => {

    // test getting all users with invalid auth token
    it('get all users by invalid auth token returns error', (done) => {
        request(app).get('/users')
        .set('x-auth-token', 'test')
        .then((res) => {
            const body = res.body;
            expect(body).to.contain.property('msg');
            done();
        })
        .catch((err) => done(err));
    });

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

// describe('GET /questions', () => {

//     // Test getting surveyJS questions JSON
//     it('Getting all questions', (done) => {
//         // TODO: Make post request once connected to mockdb
//         request(app).get('/questions')
//             .then((res) => {
//                 const body = res.body;
//                 expect(body).to.contain.property('pages');
//                 expect(body).to.contain.property('showQuestionNumbers');
//                 expect(body).to.contain.property('showProgressBar');
//                 expect(body).to.contain.property('firstPageIsStarted');
//                 expect(body).to.contain.property('showNavigationButtons');
//                 expect(body.pages[0]).to.contain.property('name');
//                 expect(body.pages[0]).to.contain.property('title');
//                 expect(body.pages[0]).to.contain.property('elements');
//                 done();
//             })
//             .catch((err) => done(err));
//     });

// });


describe('POST /users/auth', () => {

    it('Authorizing users', (done) => {
        request(app).post('/users/auth')
        .send({
            "username": "greyhatburner989@gmail.com",
	        "password": "Adminadmin/8"
        })
        .then((res) => {
            const body = res.body;
            expect(body).to.contain.property('token');
            expect(body).to.contain.property('user');
            done();
        })
        .catch((err) => done(err));
    });

});

describe('DELETE /users/{ID}', () => {

    it('Delete user by user ID ', (done) => {
        request(app).delete('/users/'+userID)
        .expect(200, done)
    });

});

/*
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