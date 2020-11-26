require('dotenv').config();
process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../../app.js');

var postID = ""
var post2ID = ""

describe('POST /questions', () => {

    it('Posting a question', (done) => {
        request(app).post('/questions')
            .send({
                "trigger": null,
                "domainApplicability": [],
                "regionalApplicability": [],
                "roles": [],
                "lifecycle": [],
                "rec_links": [],
                "questionNumber": 42,
                "alt_text": null,
                "child": false,
                "mandatory": true,
                "pointsAvailable": 1,
                "prompt": null,
                "question": "Test Question",
                "questionType": "mitigation",
                "reference": "",
                "responseType": "slider",
                "responses": [
                    {
                        "responseNumber": 0,
                        "indicator": "low",
                        "score": 1
                    },
                    {
                        "responseNumber": 1,
                        "indicator": "med",
                        "score": 2
                    },
                    {
                        "responseNumber": 2,
                        "indicator": "high",
                        "score": 3
                    }
                ],
                "trustIndexDimension": 1,
                "weighting": 1
            })
            .then((res) => {
                const body = res.body;
                expect(body).to.contain.property('trigger');
                expect(body.trigger).to.contain.property('responses');
                expect(body).to.contain.property('domainApplicability');
                expect(body).to.contain.property('regionalApplicability');
                expect(body).to.contain.property('roles');
                expect(body).to.contain.property('lifecycle');
                expect(body).to.contain.property('rec_links');
                expect(body).to.contain.property('questionNumber');
                expect(body.questionNumber).to.equal(42);
                expect(body).to.contain.property('alt_text');
                expect(body).to.contain.property('child');
                expect(body).to.contain.property('mandatory');
                expect(body).to.contain.property('pointsAvailable');
                expect(body).to.contain.property('prompt');
                expect(body).to.contain.property('question');
                expect(body).to.contain.property('questionType');
                expect(body).to.contain.property('reference');
                expect(body).to.contain.property('responseType');
                expect(body).to.contain.property('responses');

                expect(body.responses.length).to.equal(3);
                expect(body.responses[0]).to.contain.property('responseNumber');
                expect(body.responses[0]).to.contain.property('indicator');
                expect(body.responses[0]).to.contain.property('score');

                expect(body).to.contain.property('trustIndexDimension');
                expect(body).to.contain.property('weighting');

                expect(body).to.contain.property('_id');
                postID = body['_id'];

                done();
            })
            .catch((err) => done(err));
    });

});


describe('GET /questions', () => {

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

    it('Getting question by question ID', (done) => {
        //Get posted slider question
        request(app).get('/questions/' + postID)
            .then((res) => {
                const body = res.body;
                expect(body).to.contain.property('title');
                expect(body).to.contain.property('name');
                expect(body).to.contain.property('type');
                expect(body).to.contain.property('recommendedlinks');
                expect(body).to.contain.property('score');
                expect(body).to.contain.property('choices');
                expect(body).to.contain.property('pipsValues');
                expect(body).to.contain.property('pipsDensity');
                expect(body).to.contain.property('tooltips');

                done();
            })
            .catch((err) => done(err));

        request(app).post('/questions')
            .send({
                "trigger": null,
                "domainApplicability": [],
                "regionalApplicability": [],
                "roles": [13],
                "lifecycle": [6],
                "rec_links": [""],
                "questionNumber": 10,
                "alt_text": "",
                "child": false,
                "mandatory": true,
                "pointsAvailable": 1,
                "prompt": null,
                "question": "Test Radiogroup",
                "questionType": "risk",
                "reference": "",
                "responseType": "radiogroup",
                "responses": [
                    {
                        "responseNumber": 0,
                        "indicator": "Resp 1",
                        "score": -1
                    },
                    {
                        "responseNumber": 1,
                        "indicator": "Resp 2",
                        "score": 0
                    },
                    {
                        "responseNumber": 2,
                        "indicator": "Resp 3",
                        "score": 1
                    }
                ],
                "trustIndexDimension": 2,
                "weighting": 3
            }).expect(200).then((res) => {
                const body = res.body;
                post2ID = body['_id'];
            })

        // radio question
        request(app).get('/questions/' + post2ID)
            .then((res) => {
                const body = res.body;
                expect(body).to.contain.property('title');
                expect(body).to.contain.property('name');
                expect(body).to.contain.property('type');
                expect(body).to.contain.property('recommendation');
                expect(body).to.contain.property('score');
                expect(body.score).to.contain.property('dimension');
                expect(body.score).to.contain.property('choices');
                expect(body.score).to.contain.property('max');
                expect(body).to.contain.property('choices');
                expect(body.choices[0]).to.contain.property('value');
                expect(body.choices[0]).to.contain.property('text');

                done();
            })
            .catch((err) => done(err));

    });

});


describe('POST /questions', () => {

    it('Posting an invalid question', (done) => {
        request(app).post('/questions')
            .send({
                "question": "Test Question"
            }).expect(400, done)

    });
});



describe('DELETE /questions/{QID}', () => {

    it('Delete first post', (done) => {
        request(app).delete('/questions/' + postID)
            .expect(400, done)
    });

    it('Delete second post', (done) => {
        request(app).delete('/questions/' + post2ID)
            .expect(400, done)
    });
});
