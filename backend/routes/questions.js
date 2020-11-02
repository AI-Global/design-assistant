const express = require('express');
const router = express.Router();
const Question = require('../models/question.model');
const Dimension = require('../models/dimension.model');
const fs = require('fs');
const { create } = require('../models/question.model');

async function getDimensions() {
    let dimensions = await Dimension.find()

    // Format questions into format
    let Dimensions = {}
    for (let d of dimensions) {
        Dimensions[d.dimensionID] = { label: d.label, name: d.name, page: d.name.replace(/\s+/g, '') }
    }

    return Dimensions
}

function formatQuestion(q, Dimensions) {
    // This function takes a question from mongoDB as input and formats it for surveyJS to use

    // All questions have a title, name, and type
    var question = {};
    question.title = {};
    question.title.default = q.question;
    question.title.fr = "";
    question.name = q.id;
    question.type = q.responseType;

    // The rest of these properties are dependant on the question
    if (q.alt_text) {
        question.alttext = {};
        question.alttext.default = q.alt_text;
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
        question.hasOther = true;
        question.choice = [];
        question.choiceOrder = "asc"
        question.otherText = { "default": "Other", "fr": "" };
        question.choices = [];
        for (let c of q.responses) {
            var choice = {};
            choice.value = c.responseNumber;
            choice.text = {};
            choice.text.default = c.indicator;
            choice.text.fr = "";
            question.choices.push(choice);
        }

    } else if (question.type == "radiogroup" || question.type == "checkbox") {
        if (q.pointsAvailable) {

            question.score = {};
            question.score.dimension = Dimensions[q.trustIndexDimension].name;
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

function createPage(questions, pageName, pageTitle, Dimensions) {
    // Helper function for createPages
    // function takes in a list of question plus title and creates a page for it
    var page = {};

    page.name = pageName;
    page.title = {};
    page.title.default = pageTitle;
    page.title.fr = "";
    // Map MongoDB questions to surveyJS format
    page.elements = questions.map(function (q) {
        return formatQuestion(q, Dimensions);
    });

    return page
}

function createPages(q, Dimensions) {
    // This function takes in a list of questions from mongoDB and formats them into pages for surveyJS
    page = {};
    page.pages = [];
    page.showQuestionNumbers = "false";
    page.showProgressBar = "top";
    page.firstPageIsStarted = "false";
    page.showNavigationButtons = "false";

    // Separate the questions by dimension 
    // TODO: we might want to make tombstone questions a dimension too
    var dimQuestions = {}
    for (let d in Dimensions) {
        dimQuestions[d] = [];
    }

    var tombQuestions = {}
    tombQuestions["tombstone"] = [];

    for (let question of q) {
        if (question.questionType == "tombstone") {
            tombQuestions["tombstone"].push(question);
        } else if (question.trustIndexDimension) {
            dimQuestions[question.trustIndexDimension].push(question)
        }
    }

    // Add Other question to tombstone and create page 
    tombQuestions["tombstone"].push({ responseType: "comment", id: "otherTombstone", question: "Other:", alt_text: "If possible, support the feedback with specific recommendations \/ suggestions to improve the tool. Feedback can include:\n - Refinement to existing questions, like suggestions on how questions can be simplified or clarified further\n - Additions of new questions for specific scenarios that may be missed\n - Feedback on whether the listed AI risk domains are fulsome and complete\n - What types of response indicators should be included for your context?" });
    projectDetails = createPage(tombQuestions["tombstone"], "projectDetails1", "Project Details", Dimensions);
    page.pages.push(projectDetails);

    // Create pages for the dimensions
    var pageCount = 1;
    var questions = [];

    // Loop through each dimension in this order
    for (let dimension of Object.keys(dimQuestions)) {
        // Create pages of 2 questions 
        for (let question of dimQuestions[dimension]) {
            questions.push(question);
            questions.push({ responseType: "comment", id: "other" + question.id, question: "Other:", alt_text: "If possible, support the feedback with specific recommendations \/ suggestions to improve the tool. Feedback can include:\n - Refinement to existing questions, like suggestions on how questions can be simplified or clarified further\n - Additions of new questions for specific scenarios that may be missed\n - Feedback on whether the listed AI risk domains are fulsome and complete\n - What types of response indicators should be included for your context?" });
            if (questions.length == 4) {
                var dimPage = createPage(questions, Dimensions[question.trustIndexDimension].page + pageCount, Dimensions[question.trustIndexDimension].name, Dimensions);
                page.pages.push(dimPage);
                pageCount++;
                questions = [];
            }
        }

        // Deal with odd number of pages
        if (questions.length > 0) {
            var dimPage = createPage(questions, Dimensions[questions[0].trustIndexDimension].page + pageCount, Dimensions[questions[0].trustIndexDimension].name, Dimensions);
            page.pages.push(dimPage);
        }

        // reset Params for next dimension
        questions = [];
        pageCount = 1;
    }

    return page;
}

// Get all questions. Assemble SurveyJS JSON here
router.get('/', async (req, res) => {
    // Get dimensions from DB
    let Dimensions = await getDimensions()
    Question.find()
        .then((questions) => res.status(200).send(createPages(questions, Dimensions)))
        .catch((err) => res.status(400).send(err));

});

// Get all questions as JSON from DB. No Assembly for SurveyJS
router.get('/all', async (req, res)=> {
    let Dimensions = await getDimensions()
    Question.find()
        .then((questions) => res.status(200).send({questions, Dimensions}))
        .catch((err) => res.status(400).send(err));
})


// Get question by id
router.get('/:questionId', async (req, res) => {
    // Get dimensions from DB
    let Dimensions = await getDimensions()
    Question.findOne({ _id: req.params.questionId })
        .then((question) => res.status(200).send(formatQuestion(question, Dimensions)))
        .catch((err) => res.status(400).send(err));
});


// Add new question
// TODO: Should be restricted to admin role
router.post('/', async (req, res) => {
    try {
        // Create new questions and insert into DB
        const question = new Question(
            req.body
        )

        const savedQuestions = await question.save();
        res.json(savedQuestions);
    } catch (err) {
        res.json({ message: err });
    }

});

router.delete('/:questionId', async (req, res) => {
    try {
        // Delete existing question in DB
        var response = await Question.remove({ _id: req.params.questionId }, req.body);

        res.json(response);
    } catch (err) {
        res.json({ message: err });
    }
});

router.put('/:questionId', async (req, res) => {
    try {
        // Update existing question in DB
        var response = await Question.findOneAndUpdate({ _id: req.params.questionId }, req.body);

        res.json(response);
    } catch (err) {
        res.json({ message: err });
    }
});

// // not going to be an endpoint in production
// router.get('/populatedb', async (req, res) => {
//     try {
//         let json_temp = fs.readFileSync("./questionsJSON.json", "utf-8");
//         let parsed_questions = JSON.parse(json_temp);
//         for (let i = 0; i < parsed_questions.length; ++i) {
//             let q_responses = [];
//             if (parsed_questions[i].responses) {
//                 for (let j = 0; j < parsed_questions[i].responses.length; ++j) {
//                     const q_response = {
//                         responseNumber: j,
//                         indicator: parsed_questions[i].responses[j].indicator || null,
//                         score: parsed_questions[i].responses[j].score || null
//                     };
//                     q_responses.push(q_response);
//                 }
//             }

//             // let trustIndexDimensionString = parsed_questions[i].trustIndexDimension;
//             // if trustIndexDimension

//             await Question.findOneAndUpdate({questionNumber: i}, {
//                 trustIndexDimension: ((typeof parsed_questions[i].trustIndexDimension === 'string') ? parsed_questions[i].trustIndexDimension.toLowerCase() : null),
//                 domainApplicability: parsed_questions[i].domainApplicability || null,
//                 regionalApplicability: parsed_questions[i].regionalApplicability || null,
//                 mandatory: parsed_questions[i].mandatory || true,
//                 questionType: ((parsed_questions[i].questionType) ? (parsed_questions[i].questionType.toLowerCase().trim()) : null),
//                 question: parsed_questions[i].question || "",
//                 alt_text: parsed_questions[i].alt_text || null,
//                 prompt: parsed_questions[i].prompt || null,
//                 responses: q_responses,
//                 responseType: parsed_questions[i].responseType || null,
//                 pointsAvailable: parsed_questions[i].pointsAvailable || 0,
//                 weighting: parsed_questions[i].weighting || 0,
//                 reference: parsed_questions[i].reference || null,
//                 roles: parsed_questions[i].roles || null,
//                 lifecycle: parsed_questions[i].lifecycle || null,
//                 parent: parsed_questions[i].parent || null
//             }, {upsert:true, runValidators: true});
//         }

//         res.json(parsed_questions);
//     } catch (err) {
//         console.log(err);
//     }
// });





// Import new questions

module.exports = router;