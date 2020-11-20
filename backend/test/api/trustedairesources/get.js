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

describe('GET /trustedairesources', () => {
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
    it('Getting list of all trustedairesources', (done) => {
        // TODO: Make post request once connected to mockdb
        request(app).get('/trustedairesources')
        .then((res) => {
            const body = res.body;
            expect(body[0]).to.contain.property('_id');
            expect(body[0]).to.contain.property('resource');
            expect(body[0]).to.contain.property('description');
            expect(body[0]).to.contain.property('source');
 
            done();
        })
        .catch((err) => done(err));
    });

});