const expect = require('chai').expect;
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../../app.js');
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);
require('dotenv').config();

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

describe('GET /submissions', () => {
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

    it('Getting all submissions', (done) => {
        request(app).get('/submissions')
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


describe('GET /submissions/{UID}', () => {
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

    it('Getting submission by user ID ', (done) => {
        request(app).get('/submissions/5f9fb622a18e399f03dafc73')
        .then((res) => {
            const body = res.body;
            expect(body[0]).to.contain.property('userId');
            expect(body[0]).to.contain.property('projectName');
            expect(body[0]).to.contain.property('date');
            expect(body[0]).to.contain.property('lifecycle');
            expect(body[0]).to.contain.property('submission');
            expect(body[0]).to.contain.property('completed');
            done()
        })
        .catch((err) => done(err));
    });

});