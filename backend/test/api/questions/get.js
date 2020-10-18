const expect = require('chai').expect;
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../../app.js');
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);
require('dotenv').config();

// Conenct to DB. 
// TODO: Connect to mockgoose DB once POST endpoints test created. GET nothing then post then get again
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

describe('GET /questions', () => {
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

    // Test getting surveyJS questions JSON
    it('Getting all questions', (done) => {
        // TODO: Make post request once connected to mockdb
        request(app).get('/questions')
        .then((res) => {
            const body = res.body;
            expect(body).to.contain.property('pages');
            expect(body).to.contain.property('showQuestionNumbers');
            expect(body).to.contain.property('showProgressBar');
            expect(body).to.contain.property('firstPageIsStarted');
            expect(body).to.contain.property('showNavigationButtons');
            expect(body.pages[0]).to.contain.property('name');
            expect(body.pages[0]).to.contain.property('title');
            expect(body.pages[0]).to.contain.property('elements');
            done();
        })
        .catch((err) => done(err));
    });

});


describe('GET /questions/{QID}', () => {
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

    // TODO: make post. Dont hardcode qID
    it('Getting question by question ID ', (done) => {
        request(app).get('/questions/5f85d5e4157a3b15fcc8e18d')
        .then((res) => {
            const body = res.body;
            expect(body).to.contain.property('title');
            expect(body).to.contain.property('name');
            expect(body).to.contain.property('type');
        })
        .catch((err) => done(err));

        request(app).get('/questions/5f85d5e6157a3b15fcc8e33c')
        .then((res) => {
            const body = res.body;
            expect(body).to.contain.property('title');
            expect(body).to.contain.property('name');
            expect(body).to.contain.property('type');
            expect(body).to.contain.property('description');
            expect(body).to.contain.property('recommendation');
            expect(body).to.contain.property('score');
            expect(body).to.contain.property('choices');
            expect(body.choices[0]).to.contain.property('value');
            expect(body.choices[0]).to.contain.property('text');
            expect(body.score).to.contain.property('dimension');
            expect(body.score).to.contain.property('max');
            expect(body.score).to.contain.property('choices');
            done();
        })
        .catch((err) => done(err));
    });

});