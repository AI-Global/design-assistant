const mongoose = require('mongoose');

const QuestionSchema = mongoose.Schema({
    // numbered 1-n
    questionNumber: {
        type: Number,
        required: true,
        unique: true
    },

    // 5 possible dimensions
    trustIndexDimension: {
        type: String,
        enum: ['NONE', 'Bias and Fairness', 'Accountability', 'Explainability and Interpretability', 'Robustness', 'Data Quality']
    },

    // Free text or enum? Not enough info in spreadsheet
    domainApplicability: {
        type: String,
        enum: ['NONE', 'Health', 'Insurance', 'Banking', 'Media', 'Retail', 'Other']
    },

    // Free text or enum? Not enough info in spreadsheet
    regionalApplicability: {
        type: String,
        enum: ['NONE', 'Africa', 'Antarctica', 'Asia', 'Europe', 'North America', 'South America', 'Oceania', 'Other']
    },

    // mandatory or optional
    mandatory: Boolean,

    // Any more categories?
    questionType: {
        type: String,
        required: true,
        enum: ['NONE', 'Tombstone', 'Risk', 'Mitigation']
    },

    // question text
    question: {
        type: String,
        required: true
    },

    prompt: {
        type: String,
        required: true
    },

    // possible responses for question, could also be free text
    responses: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Response'
    }],

    // how the responses will be surfaced
    responseType: {
        type: String,
        required: true,
        enum: ['NONE', 'text field', 'slider', 'radio box']
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
        enum: [1, 2, 3]
    },

    // The recommendation?
    reference: {
        type: String,
        required: true
    },

    // Which roles question should display for
    roles: [{
        type: String,
        enum: ['NONE', 'Product Owner / Business Owner', 'Risk Management', 'Legal Lead', 'IT Lead', 'Technical Manager', 'Software Engineer / Software Developer', 'Product Design', 'Data Scientist Lead', 'Machine Learning Engineer', 'Researcher', 'Non Government Organization Volunteer', 'Policy Analyst', 'All'],
        required: true
    }],

    // Question can belong to multiple lifecycles
    lifecycle: [{
        type: String,
        enum: ['NONE', 'Plan and Design', 'Data and Model', 'Verify and Validate', 'Deploy', 'Operate and Monitor', 'All'],
        required: true
    }],

    // Which Question and Response determine whether this question should be displayed
    parent: {
        type: Number
    }

    // TODO: Add test of schema to model
});

module.exports = mongoose.model("Question", QuestionSchema);