const express = require('express');
const router = express.Router();
const Question = require('../models/question.model');
const fs = require('fs');
const { create } = require('../models/question.model');
const Response = require('../models/response.model');

router.get('/hello', async (req, res) => {
    // the front-end will upload the csv or tsv file?
    // It will get processed into a json format that we need
    // Here we access the json file of the questions to be added
    // and place into our database
    // i.e. transferQuestions.js will be handled in front-end
    try {
        // let json_temp = '[{"questionNumber":1,"trustIndexDimension":"Accountability","mandatory":true,"questionType":"Tombstone","responses":[{"responseNumber":0,"indicator":"Advance operational efficiencies","score":""},{"responseNumber":1,"indicator":"Improve quality","score":""},{"responseNumber":2,"indicator":"Lower transaction costs","score":""},{"responseNumber":3,"indicator":"Innovation","score":""},{"responseNumber":4,"indicator":"Augment human processes","score":""},{"responseNumber":5,"indicator":"Improve consistency","score":""},{"responseNumber":6,"indicator":"other","score":""}],"question":"Title of project","prompt":"free text","responseType":"text field","pointsAvailable":0,"reference":"","roles":"All","lifecycle":"All"},{"questionNumber":0,"responses":[{"responseNumber":0,"indicator":"Advance operational efficiencies","score":""},{"responseNumber":1,"indicator":"Improve quality","score":""},{"responseNumber":2,"indicator":"Lower transaction costs","score":""},{"responseNumber":3,"indicator":"Innovation","score":""},{"responseNumber":4,"indicator":"Augment human processes","score":""},{"responseNumber":5,"indicator":"Improve consistency","score":""},{"responseNumber":6,"indicator":"other","score":""}],"mandatory":true,"questionType":"Tombstone","question":"Project Description","prompt":"free text","responseType":"text field","pointsAvailable":0,"reference":"","roles":"All","lifecycle":"All"},{"questionNumber":2,"trustIndexDimension":"Accountability","mandatory":true,"questionType":"Tombstone","question":"Title of project","prompt":"free text","responseType":"text field","pointsAvailable":0,"reference":"","roles":"All","lifecycle":"All", "responses":[{"responseNumber":0,"indicator":"Advance operational efficiencies","score":""},{"responseNumber":1,"indicator":"Improve quality","score":""},{"responseNumber":2,"indicator":"Lower transaction costs","score":""},{"responseNumber":3,"indicator":"Innovation","score":""},{"responseNumber":4,"indicator":"Augment human processes","score":""},{"responseNumber":5,"indicator":"Improve consistency","score":""},{"responseNumber":6,"indicator":"other","score":""}]}]';
        let json_temp = fs.readFileSync("./questionsJSON.json", "utf-8");

        // console.log(req);

        // iterate through json and update questions that have been
        // changed but already exist


        // add new questions that don't exist

        // Person.update( { name : 'Ted' }, { name : 'Ted', age : 50 }, { upsert : true }, callback );

        let parsed_questions = JSON.parse(json_temp);
        for (let i = 0; i < parsed_questions.length; ++i) {
            console.log(parsed_questions[i]);

            // "responses":[{"_id":0,"indicator":"Advance operational efficiencies","score":""},{"_id":1,"indicator":"Improve quality","score":""},{"_id":2,"indicator":"Lower transaction costs","score":""},{"_id":3,"indicator":"Innovation","score":""},{"_id":4,"indicator":"Augment human processes","score":""},{"_id":5,"indicator":"Improve consistency","score":""},{"_id":6,"indicator":"other","score":""}]
            let q_responses = [];
            // console.log(parsed_questions[i].responses);
            if (parsed_questions[i].responses) {
                for (let j = 0; j < parsed_questions[i].responses.length; ++j) {
                    const q_response = new Response({
                        responseNumber: parsed_questions[i].responses[j].responseNumber,
                        indicator: parsed_questions[i].responses[j].indicator,
                        score: parsed_questions[i].responses[j].score || 0
                    });
                    await q_response.save();

                    q_responses.push(q_response);
                }
            }

            await Question.findOneAndUpdate({questionNumber: parsed_questions[i].questionNumber}, {
                trustIndexDimension: parsed_questions[i].trustIndexDimension || "NONE",
                domainApplicability: parsed_questions[i].domainApplicability || "NONE",
                regionalApplicability: parsed_questions[i].regionalApplicability || "NONE",
                mandatory: parsed_questions[i].mandatory || true,
                questionType: parsed_questions[i].questionType || "NONE",
                question: parsed_questions[i].question || "NONE",
                prompt: parsed_questions[i].prompt || "NONE",
                responses: q_responses,
                responseType: parsed_questions[i].responseType || ["NONE"],
                pointsAvailable: parsed_questions[i].pointsAvailable || 1,
                weighting: parsed_questions[i].weighting || 1,
                reference: parsed_questions[i].reference || "NONE",
                roles: parsed_questions[i].roles || "NONE",
                lifecycle: parsed_questions[i].lifecycle || "NONE",
                parent: parsed_questions[i].parent || 0
            }, {upsert:true});

            // const question = new Question({
            //     questionNumber: parsed_questions[i].questionNumber,
            //     trustIndexDimension: parsed_questions[i].trustIndexDimension || "NONE",
            //     domainApplicability: parsed_questions[i].domainApplicability || "NONE",
            //     regionalApplicability: parsed_questions[i].regionalApplicability || "NONE",
            //     mandatory: parsed_questions[i].mandatory || true,
            //     questionType: parsed_questions[i].questionType || "NONE",
            //     question: parsed_questions[i].question || "NONE",
            //     prompt: parsed_questions[i].prompt || "NONE",
            //     responses: parsed_questions[i].responses || [null],
            //     responseType: parsed_questions[i].responseType || ["NONE"],
            //     pointsAvailable: parsed_questions[i].pointsAvailable || 1,
            //     weighting: parsed_questions[i].weighting || 1,
            //     reference: parsed_questions[i].reference || "NONE",
            //     roles: parsed_questions[i].roles || "NONE",
            //     lifecycle: parsed_questions[i].lifecycle || "NONE",
            //     parent: parsed_questions[i].parent || 0
            // });

            // try {
            //     const created_question = await question.save();
            //     console.log(created_question);
            //     // res.json(savedQuestions);
            // } catch(err){
            //     // res.json({message: err});
            //     console.log(err);
            // }
        }

        res.json(parsed_questions);


        // fluffy.save(function (err, fluffy) {
        //     if (err) return console.error(err);
        //     fluffy.speak();
        // });
    } catch (err) {
        console.log(err);
    }
    


});

// Get all questions
router.get('/', async (req,res) => {
    try{
        const questions = await Question.find();
        res.json(questions);
        console.log("Incoming questions request");
    }catch(err){
        res.json({message: err});
    }
});

// Get question by id TODO: probably should change this to get question by question number
router.get('/:questionId', async (req,res) => {
    try{
        const question = await Question.findById(req.params.questionId);
        res.json(question);
    }catch(err){
        res.json({message: err});
    }
});



// Add new question
// TODO: Should be restricted to admin role
router.post('/', async (req, res) => {
    const question = new Question({
        questionNumber: req.body.questionNumber,
        question: req.body.question
    });

    try{
        const savedQuestions = await question.save();
        res.json(savedQuestions);
    }catch(err){
        res.json({message: err});
    }
    
});



// Import new questions

module.exports = router;