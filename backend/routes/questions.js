const express = require('express');
const router = express.Router();
const Question = require('../models/question.model');

function formatQuestion(q) {
    var question = {};
    question.title = {};
    question.title.default = q.question;
    question.title.fr = "";
    question.name = q.questionNumber; //Change this to UUID
    question.type = q.responseType;

    if (q.prompt) {
        question.description = {};
        question.description.default = q.prompt;
        question.description.fr = "";
    }

    if (q.reference) {
        question.recommendation = {};
        question.recommendation.default = q.reference;
        question.recommendation.fr = "";
    }

    if (question.type == "radiogroup") {
        question.hasOther = true; // Hardcoded this to true unless they want it changed
        question.choice = [];
    } else if (question.type == "dropdown") {
        question.hasOther = true;
        question.choice = [];
        //question.choiceOrder = "asc"
        question.otherText = { "default": "Other", "fr": "" };
    } else if (question.type == "checkbox") {
        if(q.pointsAvailable > 0){
            question.score = {};
            question.score.dimension = q.trustIndexDimension; // This should be a letter
            question.score.max = pointsAvailable; // Double check if this is correct
            question.score.choice = {}; // Loop add choices here "itemAA35A8": -1.5
        }
        question.choices = [];
        // Loop and add all choice 
        var choice = {};
        choice.value = "itemAA35A8";
        choice.text = {};
        choice.text.default = "All users equally";
        choice.text.fr = "";
        question.choices.push(choice);
    }//else if (question.type == slider){

    //}

    return question;
}

// Get all questions. Assemble SurveyJS JSON here
router.get('/', async (req, res) => {
    try {
        const questions = await Question.find();
        res.json(questions);
        console.log("Incoming questions request");
    } catch (err) {
        res.json({ message: err });
    }
});

// Get question by id TODO: probably should change this to get question by question number
router.get('/:questionId', async (req, res) => {
    try {
        const question = await Question.findOne({ questionNumber: req.params.questionId })
        console.log(question)
        res.json(formatQuestion(question));
    } catch (err) {
        res.json({ message: err });
    }
});

// Add new question
// TODO: Should be restricted to admin role
router.post('/', async (req, res) => {
    const question = new Question({
        questionNumber: req.body.questionNumber,
        question: req.body.question
    });

    try {
        const savedQuestions = await question.save();
        res.json(savedQuestions);
    } catch (err) {
        res.json({ message: err });
    }

});

module.exports = router;