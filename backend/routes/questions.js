const express = require('express');
const router = express.Router();
const Question = require('../models/question.model');

function formatQuestion(q) {
    // This function takes a question from mongoDB as input and formats it for surveyJS to use

    // All questions have a title, name, and type
    var question = {};
    question.title = {};
    question.title.default = q.question;
    question.title.fr = "";
    question.name = q.id;
    question.type = q.responseType;

    if (q.alttext) {
        question.alttext = {};
        question.alttext.default = q.alttext;
        question.alttext.fr = "";
    }

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

    if (question.type == "dropdown") {
        // TODO: Add choices for dropdown questions
        question.hasOther = true;
        question.choice = [];
        question.choiceOrder = "asc"
        question.otherText = { "default": "Other", "fr": "" };

    } else if (question.type == "radiogroup" || question.type == "checkbox") {
        if (q.pointsAvailable) {
            question.score = {};
            question.score.dimension = q.trustIndexDimension; // This should be mapped to a letter
            question.score.max = q.pointsAvailable * q.weighting; 
            
            question.score.choices = {};
            for(let c of q.responses){
                question.score.choices[c.id] = c.score * q.weighting;
            }
        }

        question.choices = [];
        for(let c of q.responses){
            var choice = {};
            choice.value = c.id;
            choice.text = {};
            choice.text.default = c.indicator;
            choice.text.fr = "";
            question.choices.push(choice);
        }
        
    }//TODO: else if (question.type == slider)

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