const express = require('express');
const router = express.Router();
const Question = require('../models/question.model');
const fs = require('fs');
const { create } = require('../models/question.model');

// not going to be an endpoint in production
router.get('/populatedb', async (req, res) => {
    try {
        let json_temp = fs.readFileSync("./questionsJSON.json", "utf-8");
        let parsed_questions = JSON.parse(json_temp);
        for (let i = 0; i < parsed_questions.length; ++i) {
            let q_responses = [];
            if (parsed_questions[i].responses) {
                for (let j = 0; j < parsed_questions[i].responses.length; ++j) {
                    const q_response = {
                        responseNumber: parsed_questions[i].responses[j].responseNumber || j,
                        indicator: parsed_questions[i].responses[j].indicator || null,
                        score: parsed_questions[i].responses[j].score || null
                    };
                    q_responses.push(q_response);
                }
            }

            // let trustIndexDimensionString = parsed_questions[i].trustIndexDimension;
            // if trustIndexDimension

            await Question.findOneAndUpdate({questionNumber: parsed_questions[i].questionNumber}, {
                uuid: parsed_questions[i].uuid || parsed_questions[i].questionNumber,
                trustIndexDimension: ((typeof parsed_questions[i].trustIndexDimension === 'string') ? parsed_questions[i].trustIndexDimension.toLowerCase() : null),
                domainApplicability: parsed_questions[i].domainApplicability || null,
                regionalApplicability: parsed_questions[i].regionalApplicability || null,
                mandatory: parsed_questions[i].mandatory || true,
                questionType: ((parsed_questions[i].questionType) ? (parsed_questions[i].questionType.toLowerCase().trim()) : null),
                question: parsed_questions[i].question || null,
                prompt: parsed_questions[i].prompt || null,
                responses: q_responses,
                responseType: parsed_questions[i].responseType || null,
                pointsAvailable: parsed_questions[i].pointsAvailable || 0,
                weighting: parsed_questions[i].weighting || 0,
                reference: parsed_questions[i].reference || null,
                roles: parsed_questions[i].roles || null,
                lifecycle: parsed_questions[i].lifecycle || null,
                parent: parsed_questions[i].parent || null
            }, {upsert:true, runValidators: true});
        }

        res.json(parsed_questions);
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