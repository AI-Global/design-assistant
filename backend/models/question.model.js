const mongoose = require('mongoose');

const QuestionSchema = mongoose.Schema({
    // numbered 0 to n-1
    questionNumber: {
        type: Number,
        required: true,
        unique: true
    },

    // 5 possible dimensions
    trustIndexDimension: {
        type: String,
        enum: [null, 'bias and fairness', 'accountability', 'explainability and interpretability', 'robustness', 'data quality']
    },

    // Free text or enum? Not enough info in spreadsheet
    domainApplicability: {
        type: String,
        // SHOULD be activated, right now data isn't uniform, needs to be off
        // enum: [null, 'Health', 'Insurance', 'Banking', 'Media', 'Retail', 'Other']
    },

    // Free text or enum? Not enough info in spreadsheet
    regionalApplicability: {
        type: String,

        // SHOULD be activated, right now data isn't uniform, needs to be off
        // enum: [null, 'Africa', 'Antarctica', 'Asia', 'Europe', 'North America', 'South America', 'Oceania', 'Other']
    },

    // mandatory or optional
    mandatory: Boolean,

    // Any more categories?
    questionType: {
        type: String,
        // SHOULD BE TRUE, will activate when spreadsheet is complete
        // required: true,
        enum: [null, 'tombstone', 'risk', 'mitigation']
    },

    // question text
    question: {
        type: String,
        required: true
    },

    alt_text: {
        type: String
    },

    prompt: {
        type: String
        // SHOULD BE TRUE, will activate when spreadsheet is complete
        // required: true,
    },

    // possible responses for question, could also be free text
    responses: [{
        responseNumber: {
            type: Number,
            required: true
        },
        indicator: String,
        score: Number
    }],

    // how the responses will be surfaced
    responseType: {
        type: String,
        required: true,
        enum: [null, 'text', 'comment', 'checkbox', 'radiogroup', 'dropdown']
    },

    // -1 to 1
    pointsAvailable: {
        type: Number,
        required: true
    },

    // Low = 1, Medium = 2, High = 3
    weighting: {
        type: Number,
        required: true,
        enum: [0,1, 2, 3]
    },

    // The recommendation?
    reference: {
        type: String
        // SHOULD BE TRUE, will activate when spreadsheet is complete
        // required: true
    },

    // Which roles question should display for
    roles: [{
        type: String,
        enum: [null, 'Product Owner / Business Owner', 'Risk Management', 'Legal Lead', 'IT Lead', 'Technical Manager', 'Software Engineer / Software Developer', 'Product Design', 'Data Scientist Lead', 'Machine Learning Engineer', 'Researcher', 'Non Government Organization Volunteer', 'Policy Analyst', 'All'],
        required: true
    }],

    // Question can belong to multiple lifecycles
    lifecycle: [{
        type: String,
        enum: [null, 'Plan and Design', 'Data and Model', 'Verify and Validate', 'Deploy', 'Operate and Monitor', 'All'],
        required: true
    }],

    // Which Question and Response determine whether this question should be displayed
    parent: {
        type: Number
    }

    // TODO: Add test of schema to model
});

module.exports = mongoose.model("Question", QuestionSchema);