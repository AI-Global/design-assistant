require('dotenv').config();
process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../../app.js');

var resourceID = "";

describe('PUT /trustedairesources', () => {
    it('add new trusted ai resource', (done) => {
        request(app).put('/trustedairesources')
            .send({
                resource: "testresource",
                description: "",
                source: "test"
            })
            .then((res) => {
                const body = res.body;
                expect(body).to.contain.property('_id');
                expect(body).to.contain.property('resource');
                expect(body).to.contain.property('description');
                expect(body).to.contain.property('source');
                resourceID = body["_id"];
                done();
            })
            .catch((err) => done(err));
    });

    it('update trusted ai resource', (done) => {
        request(app).put('/trustedairesources/' + resourceID)
            .send({
                resource: "updatedTestresource",
                description: "",
                source: "test"
            })
            .then((res) => {
                const body = res.body;
                expect(body).to.contain.property('_id');
                expect(body).to.contain.property('resource');
                expect(body).to.contain.property('description');
                expect(body).to.contain.property('source');
                done();
            })
            .catch((err) =>  done(err));
    });
});

describe('GET /trustedairesources', () => {
    // Test getting surveyJS questions JSON
    it('Getting all trusted ai resources', (done) => {
        request(app).get('/trustedairesources')
            .then((res) => {
                const body = res.body;

                // checks that all resources are valid
                for (let i = 0; i < body.length; ++i) {
                    expect(body[i]).to.contain.property('_id');
                    expect(body[i]).to.contain.property('resource');
                    expect(body[i]).to.contain.property('description');
                    expect(body[i]).to.contain.property('source');
                }

                done();
            })
            .catch((err) => done(err));
    });

});

describe('DELETE /trustedairesources', () => {
    it('delete trusted ai resource by id', (done) => {
        request(app).delete('/trustedairesources/' + resourceID)
            .then((res) => {
                done();
            })
            .catch((err) => done(err));
    });
});