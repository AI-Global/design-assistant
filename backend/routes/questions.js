const express = require('express');
const router = express.Router();
const Question = require('../models/question.model');

// Mapping of dimensions to Labels and Names
const Dimensions = {
    "accountability": { label: "A", name: "Accountability", page: "accountability" },
    "explainability and interpretability": { label: "EI", name: "Explainability and Interpretability", page: "explainabilityInterpretability" },
    "data quality": { label: "D", name: "Data Quality", page: "dataQuality" },
    "bias and fairness": { label: "B", name: "Bias and Fairness", page: "biasFairness" },
    "robustness": { label: "R", name: "Robustness", page: "robustness" },
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

    // The rest of these properties are dependant on the question
    if (q.alttext) {
        question.alttext = {};
        question.alttext.default = q.alttext;
        question.alttext.fr = "";
    }

    // Not sure how they determine which prompts they want displayed
    if (q.prompt == "select all that have been completed" || q.prompt == "select all that apply") {
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
            question.score.dimension = Dimensions[q.trustIndexDimension].label;
            question.score.max = q.pointsAvailable * q.weighting;

            // Add score to the choices
            question.score.choices = {};
            for (let c of q.responses) {
                question.score.choices[c.id] = c.score * q.weighting;
            }
        }

        // Add choices to question
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

function createPage(questions, pageName, pageTitle) {
    // Helper function for createPages
    // function takes in a list of question plus title and creates a page for it
    var page = {};
    if (pageTitle == "Project Details") {
        page.navigationTitle = "Details";
    }
    page.name = pageName;
    page.title = {};
    page.title.default = pageTitle;
    page.title.fr = "";
    // Map MongoDB questions to surveyJS format
    page.elements = questions.map(function (q) {
        return formatQuestion(q)
    });

    return page
}

function createPages(q) {
    // This function takes in a list of questions from mongoDB and formats them into pages for surveyJS
    page = {}
    page.pages = [];
    page.showQuestionNumbers = false;
    page.showProgressBar = "top";
    page.firstPageIsStarted = false;
    page.showNavigationButtons = false;

    // separate the questions by dimension
    var A = [];
    var EI = [];
    var D = [];
    var B = [];
    var R = [];
    var tombstone = []

    for (let question of q) {
        if (question.trustIndexDimension == "accountability") {
            A.push(question);
        } else if (question.trustIndexDimension == "explainability and interpretability") {
            EI.push(question);
        } else if (question.trustIndexDimension == "data quality") {
            D.push(question);
        } else if (question.trustIndexDimension == "bias and fairness") {
            B.push(question);
        } else if (question.trustIndexDimension == "robustness") {
            R.push(question);
        } else if (question.questionType == "tombstone") {
            tombstone.push(question);
        }
    }

    // Create project details page
    projectDetails = createPage(tombstone, "projectDetails1", "Project Details");
    page.pages.push(projectDetails);

    // Create pages for the dimensions
    var pageCount = 1;
    var questions = [];

    // Loop through each dimension in this order
    for (let dimension of [A,B,EI,R,D]) {
        // Create pages of 2 questions 
        for (let question of dimension) {
            questions.push(question)        
            if (questions.length == 2) {
                
                var dimPage = createPage(questions, Dimensions[question.trustIndexDimension].page + pageCount, Dimensions[question.trustIndexDimension].name);
                page.pages.push(dimPage);
                pageCount++;
                questions = [];
            }
        }
        
        // Deal with odd number of pages
        if (questions.length > 0) {
            var dimPage = createPage(questions, Dimensions[questions[0].trustIndexDimension].page + pageCount, Dimensions[questions[0].trustIndexDimension].name);
            page.pages.push(dimPage);
        }

        // reset Params for next dimension
        questions = [];
        pageCount = 1;
    }
    
    return page

}

// Get all questions. Assemble SurveyJS JSON here
router.get('/', async (req, res) => {
    try {
        const questions = await Question.find();
        res.json(createPages(questions));
        console.log("Incoming questions request");
    } catch (err) {
        res.json({ message: err });
    }
});


// Get question by id
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