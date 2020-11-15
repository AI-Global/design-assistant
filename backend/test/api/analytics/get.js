const expect = require('chai').expect;
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../../app.js');
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);
require('dotenv').config();

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

describe('GET /analytics', () => {
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
    it('Getting all analytics', (done) => {
        request(app).get('/analytics')
        .then((res) => {
            const body = res.body;
            expect(body[0]).to.contain.property('analyticName');
            expect(body[0]).to.contain.property('embed');

            done();
        })
        .catch((err) => done(err));
    });

});