/*
require('dotenv').config();
process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../../app.js');

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

});*/