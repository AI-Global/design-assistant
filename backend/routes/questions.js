const express = require('express');
const router = express.Router();
const Question = require('../models/question.model');

const Dimensions = {
    "accountability": {lable:"A", name:"Accountability"},
    "explainability and interpretability": {lable:"EI", name:"Explainability and Interpretability"},
    "data quality": {lable:"D", name:"Data Quality"},
    "bias and fairness": {lable:"B", name:"Bias and Fairness"},
    "robustness": {lable:"R", name:"Robustness"},
}

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
            question.score.dimension = Dimensions[q.trustIndexDimension].lable; 
            question.score.max = q.pointsAvailable * q.weighting;

            question.score.choices = {};
            for (let c of q.responses) {
                question.score.choices[c.id] = c.score * q.weighting;
            }
        }

        question.choices = [];
        for (let c of q.responses) {
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

function createPages(q) {
    // This function takes in a list of questions from mongoDB and formats them into pages for surveyJS
    page = {}
    // TODO: Confirm these parameters are correct
    page.showQuestionNumbers = false;
    page.showProgressBar = "top";
    page.firstPageIsStarted = false;
    page.showNavigationButtons = false;

    page.pages = [];

    // Create Project Details Page
    var projectDetails = {};
    projectDetails.name = "projectDetails1";
    projectDetails.navigationTitle = "Details";
    projectDetails.title = {};
    projectDetails.title.default = "Project Details";
    projectDetails.title.fr = "";
    projectDetails.elements = []

    for (let question of q) {
        if (question.questionType == "tombstone") {
            projectDetails.elements.push(formatQuestion(question));
        }
    }

    page.pages.push(projectDetails)

    // Categorize the rest of the questions
    questions = []
    for (let question of q) {
        if (trustIndexDimension) {
            if (questions.some(q => q.title === question)){

            }
            projectDetails.elements.push(formatQuestion(questions));
        }
    }
    return page

}

// Get all questions. Assemble SurveyJS JSON here
router.get('/', async (req, res) => {
    try {
        const questions = await Question.find();
        createPages(questions);
        res.json(questions);
        console.log("Incoming questions request");
    } catch (err) {
        res.json({ message: err });
    }
});


// Get question by id TODO: probably should change this to get question by question number
router.get('/:questionId', async (req, res) => {
    try {
        const question = await Question.findOne({ questionNumber: req.params.questionId });
        console.log(question);
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