require('dotenv').config();
process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../../app.js');

describe('GET /dimensions', () => {

    it('Getting all survey dimensions', (done) => {

        request(app).get('/dimensions')
            .then((res) => {
                const body = res.body;
                expect(body[0]).to.contain.property('dimensionID');
                expect(body[0]).to.contain.property('label');
                expect(body[0]).to.contain.property('name');
                done();
            })
            .catch((err) => done(err));
    });

});

describe('GET /dimensions/names', () => {

    it('Getting all dimension names', (done) => {
        request(app).get('/dimensions/names')
            .then((res) => {
                const body = res.body;
                expect(body).to.contain.property('dimensions');
                done();
            })
            .catch((err) => done(err));
    });

});