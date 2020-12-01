const express = require('express');
const router = express.Router();
const Question = require('../models/question.model');

const Dimension = require('../models/dimension.model');
const Lifecycles = require('../models/lifecycle.model');
const Roles = require('../models/role.model');
const Domain = require('../models/domain.model');
const Region = require('../models/region.model');
const fs = require('fs');
const { create, findOne } = require('../models/question.model');
const mongoose = require('mongoose');

async function getDimensions() {
    // Get Lookup of Dimensions from DB
    let dimensions = await Dimension.find().sort({ dimensionID: 1 })

    let Dimensions = {}
    for (let d of dimensions) {
        Dimensions[d.dimensionID] = { label: d.label, name: d.name, page: d.name.replace(/\s+/g, '') }
    }
    return Dimensions
}

function formatTrigger(trigger) {
    // Formats the triggers into a string for SurveyJS
    triggerList = [];

    for (let t of trigger.responses) {
        triggerList.push("{" + trigger.parent + "} contains " + "'" + t + "'");
    }

    return triggerList.join(" or ");
}

async function getChildren() {
    // Get Lookup of child questions
    let questions = await Question.find({ "child": true })
    let children = {}
    for (let q of questions) {
        children[q.trigger.parent] = {};
        children[q.trigger.parent].question = q;

        children[q.trigger.parent].trigger = formatTrigger(q.trigger);
    }

    return children
}

function formatQuestion(q, Dimensions, Triggers = null) {
    // This function takes a question from mongoDB as input and formats it for surveyJS to use

    // All questions have a title, name, and type
    var question = {};

    question.title = {};
    question.title.default = q.question;
    question.title.fr = "";
    question.name = q.id;
    question.type = q.responseType;

    if (question.name.includes('other')) {
        question.hideNumber = true
    }

    if (!q.trustIndexDimension) {
        question.hideNumber = true
    }


    // Set conditions for when the question is visiable
    if (Triggers) {
        question.visibleIf = Triggers;
        question.hideNumber = true;
    }

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

    if (q.rec_links) {
        question.recommendedlinks = {};
        question.recommendedlinks.default = q.rec_links;
        question.recommendedlinks.fr = "";
    }

    if (question.type == "dropdown") {
        question.hasOther = true;
        question.choice = [];
        question.choiceOrder = "asc"
        question.otherText = { "default": "Other", "fr": "" };
        question.choices = [];
        for (let c of q.responses) {
            var choice = {};
            choice.value = c.id;
            choice.text = {};
            choice.text.default = c.indicator;
            choice.text.fr = "";
            question.choices.push(choice);
        }

    } else if (question.type == "radiogroup" || question.type == "checkbox") {
        // Score and Dimension
        question.score = {};
        if (q.trustIndexDimension) {
            question.score.dimension = Dimensions[q.trustIndexDimension].label
        }

        // Add choices to score
        question.score.choices = {};
        if (q.responses) {
            for (let c of q.responses) {
                question.score.choices[c.id] = c.score * q.weighting;

            }
        }

        // Calculate max score
        if (q.pointsAvailable) {
            question.score.max = q.pointsAvailable * q.weighting;
        } else {
            question.score.max = 0;
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

    } else if (question.type == "slider") {
        // Set type to nouislider 
        question.type = "nouislider"

        // Score and Dimension
        question.score = {};
        if (q.trustIndexDimension) {
            question.score.dimension = Dimensions[q.trustIndexDimension].label
        }
        question.choices = [-1,0,1];

        if (q.responses) {
            low = q.responses.filter(resp => resp.indicator == "low")[0].score;
            med = q.responses.filter(resp => resp.indicator == "med")[0].score;
            high = q.responses.filter(resp => resp.indicator == "high")[0].score;

            question.choices = [low,med,high];
        }

        // Calculate max score
        question.score.max = question.choices[2] * q.weighting;
        question.score.weight = q.weighting;

        // Low Medium and High
        question.pipsValues = [0, 100]
        question.pipsDensity = 100
        question.tooltips = false
    }

    return question;
}

function chainChildren(q, Children) {
    // Given a question this function will recursivly check for deeper chains of heirarchy questions
    var childChain = [];

    childChain.push(Children[q.id].question);

    // Recursivly get children of children
    if (Children[q.id].question.id in Children) {
        childChain = childChain.concat(chainChildren(Children[q.id].question, Children))
    }

    return childChain;
}

function createHierarchy(questions, Children) {
    // Given a list of questions, check for any child questions and build the heirarchy
    var heirarchy = [];

    questions.forEach(q => {
        heirarchy.push(q);

        // If the questions has children
        if (q.id in Children) {
            heirarchy = heirarchy.concat(chainChildren(q, Children));
        }
    })

    return heirarchy;
}

function createPage(questions, pageName, pageTitle, Dimensions, Children) {
    // Helper function for createPages
    // function takes in a list of question plus title and creates a page for it
    var page = {};

    // Build Heirachy

    var questionHeiarchy = createHierarchy(questions, Children)

    page.name = pageName;
    page.title = {};
    page.title.default = pageTitle;
    page.title.fr = "";

    // Map MongoDB questions to surveyJS format
    page.elements = questionHeiarchy.map(function (q) {
        if (q.child) {

            return formatQuestion(q, Dimensions, Children[q.trigger.parent].trigger);

        } else {
            return formatQuestion(q, Dimensions);

        }
    });

    return page
}

async function applyFilters(questions, filters) {
    // This function takes a list of questions and filter
    // The questions will be filtered out based filters passed in 

    // Query DB for the "All" roleID
    let allRoles = await Roles.find()
    allRoles = allRoles.filter(r => r.name == "All")[0]?.roleID

    // Query DB for the "All" lifecycleID
    let allLifecycles = await Lifecycles.find()
    allLifecycles = allLifecycles.filter(l => l.name == "All")[0]?.lifecycleID

    // Query DB for the "All" regionID
    let allRegions = await Region.find()
    allRegions = allRegions.filter(r => r.name == "All")[0]?.regionID

    // Query DB for the "All" domainID
    let allDomains = await Domain.find()
    allDomains = allDomains.filter(d => d.name == "All")[0]?.domainID

    // Filter roles if passed in
    if (filters.roles) {
        // Add "all" to role filters
        if (allRoles) {
            filters.roles.push(allRoles)
        }

        for (let dim of Object.keys(questions).filter(k => String(k) !== "1")) {
            questions[dim] = questions[dim].filter(q => filters.roles.some(role => q.roles?.includes(role)))
        }
    }

    // Filter regions if passed in
    if (filters.regions) {
        // Add "all" to regions filters
        if (allRegions) {
            filters.regions.push(allRegions)
        }

        for (let dim of Object.keys(questions).filter(k => String(k) !== "1")) {
            questions[dim] = questions[dim].filter(q => filters.regions.some(region => q.regionalApplicability?.includes(region)))
        }
    }

    // Filter lifecycles if passed in
    if (filters.lifecycles) {
        // Add "all" to lifecycles filters
        if (allLifecycles) {
            filters.lifecycles.push(allLifecycles)
        }

        for (let dim of Object.keys(questions).filter(k => String(k) !== "1")) {
            questions[dim] = questions[dim].filter(q => filters.lifecycles.some(lifecycle => q.lifecycle?.includes(lifecycle)))
        }
    }

    // Filter domains if passed in
    if (filters.domains) {
        // Add "all" to domains filters
        if (allDomains) {
            filters.domains.push(allDomains)
        }

        for (let dim of Object.keys(questions).filter(k => String(k) !== "1")) {
            questions[dim] = questions[dim].filter(q => filters.domains.some(domain => q.domainApplicability?.includes(domain)))
        }
    }

    return questions
}

async function createPages(q, filters) {
    // Get dimensions from DB
    let Dimensions = await getDimensions()
    // Get child questions from DB
    let Children = await getChildren()

    // This function takes in a list of questions from mongoDB and formats them into pages for surveyJS
    var page = {};
    page.pages = [];
    page.showQuestionNumbers = "on";
    page.showProgressBar = "top";
    page.firstPageIsStarted = "false";
    page.showNavigationButtons = "false";
    page.clearInvisibleValues = "onHidden";

    // Separate the questions by dimension 
    // TODO: we might want to make tombstone questions a dimension too for cleaner code
    var dimQuestions = {}
    for (let d in Dimensions) {
        dimQuestions[d] = [];
    }

    for (let question of q) {
        if (question.trustIndexDimension) {
            dimQuestions[question.trustIndexDimension].push(question)
        }
    }

    // Apply domain, region, role, lifecycle filter to questions
    dimQuestions = await applyFilters(dimQuestions, filters)

    // Add Other question to tombstone and create page 
    dimQuestions[1].push({ responseType: "comment", id: "otherTombstone", question: "Other:", alt_text: "If possible, support the feedback with specific recommendations \/ suggestions to improve the tool. Feedback can include:\n - Refinement to existing questions, like suggestions on how questions can be simplified or clarified further\n - Additions of new questions for specific scenarios that may be missed\n - Feedback on whether the listed AI risk domains are fulsome and complete\n - What types of response indicators should be included for your context?" });
    var projectDetails = createPage(dimQuestions[1], Dimensions[1].page, Dimensions[1].name, Dimensions, Children);
    page.pages.push(projectDetails);

    delete dimQuestions[1];

    // Create pages for the dimensions
    var pageCount = 1;
    var questions = [];

    // Loop through each dimension in this order
    for (let dimension of Object.keys(dimQuestions)) {
        // Create pages of 2 questions 
        for (let question of dimQuestions[dimension]) {
            questions.push(question);
            questions.push({responseType: "comment", id: "other" + question.id, question: "Other:", alt_text: "If possible, support the feedback with specific recommendations \/ suggestions to improve the tool. Feedback can include:\n - Refinement to existing questions, like suggestions on how questions can be simplified or clarified further\n - Additions of new questions for specific scenarios that may be missed\n - Feedback on whether the listed AI risk domains are fulsome and complete\n - What types of response indicators should be included for your context?" });
            if (questions.length == 4) {
                var dimPage = createPage(questions, Dimensions[question.trustIndexDimension].page + pageCount, Dimensions[question.trustIndexDimension].name, Dimensions, Children);
                page.pages.push(dimPage);
                pageCount++;
                questions = [];
            }
        }

        // Deal with odd number of pages
        if (questions.length > 0) {
            var dimPage = createPage(questions, Dimensions[questions[0].trustIndexDimension].page + pageCount, Dimensions[questions[0].trustIndexDimension].name, Dimensions, Children);
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

    // Optional filters in req body
    filters = req.query;
    //Only request parent questions from DB
    Question.find({ "child": false })
        .sort({ questionNumber: 1 })
        .then(async (questions) => {
            pages = await createPages(questions, filters);
            res.status(200).send(pages);
        })
        .catch((err) => res.status(400).send(err));

});

// Get all questions as JSON from DB. No Assembly for SurveyJS
router.get('/all', async (req, res) => {
    let Dimensions = await getDimensions()
    Question.find()
        .then((questions) => res.status(200).send({ questions, Dimensions }))
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

router.get('/all/export', async (req, res) => {
    Question.find()
        .then((questions) => res.status(200).send(questions))
        .catch((err) => res.status(400).send(err));
})

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
        res.status(400).send(err)
    }

});

router.delete('/:questionId', async (req, res) => {
    try {
        // Delete existing question in DB

        const session = await mongoose.startSession();
        session.withTransaction(async () => {
            var number;
            var question = await Question.findOne({ _id: req.params.questionId })
            var number = question.questionNumber
            await Question.deleteOne({ _id: req.params.questionId })
            var maxQ = await Question.find().sort({ questionNumber: -1 }).limit(1)
            var maxNumber = maxQ[0].questionNumber

            for (let i = number + 1; i <= maxNumber; i++) {
                await Question.findOneAndUpdate({ questionNumber: i }, { questionNumber: i - 1 });
            }

        })
        res.status(200).send(true);
    } catch (err) {
        res.status(400).send(err)
    }

});

router.put('/:questionId', async (req, res) => {
    try {
        // Update existing question in DB
        var response = await Question.findOneAndUpdate({ _id: req.params.questionId }, req.body);

        res.status(200).send(response);
    } catch (err) {
        res.status(400).send(err)
    }
});

router.put('/:startNumber/:endNumber', async (req, res) => {
    let startNum = parseInt(req.params.startNumber);
    let endNum = parseInt(req.params.endNumber);

    try {

        const session = await mongoose.startSession();
        session.withTransaction(async () => {

            startQuestion = await Question.findOne({ questionNumber: startNum }).exec();
            startQuestion.questionNumber = 0;
            await startQuestion.save();

            // shift questions down
            if (startNum < endNum) {
                for (let i = startNum + 1; i <= endNum; i++) {
                    await Question.findOneAndUpdate({ questionNumber: i }, { questionNumber: i - 1 });
                }
            } else {
                for (let i = startNum - 1; i >= endNum; i--) {
                    await Question.findOneAndUpdate({ questionNumber: i }, { questionNumber: i + 1 });
                }
            }
            startQuestion.questionNumber = endNum;
            await startQuestion.save();

        })

        // free up starting question number (unique)
        res.json({ message: "Transaction Complete" })

    } catch (err) {
        res.status(400).send(err)
    }

});






module.exports = router;