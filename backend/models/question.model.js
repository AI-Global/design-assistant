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
        enum: ['Bias and Fairness', 'Accountability', 'Explainability and Interpretability', 'Robustness', 'Data Quality']
    },

    // Free text or enum? Not enough info in spreadsheet
    domainApplicability: {
        type: String
    },

    // Free text or enum? Not enough info in spreadsheet
    regionalApplicability: {
        type: String,
    },

    mo: Boolean,

    // Any more categories?
    questionType: {
        type: String,
        required: true,
        enum: ['Tombstone', 'Risk', 'Mitigation']
    },

    // question text
    question: {
        type: String,
        required: true,
    },

    // Free text
    responseIndicators: String,

    // possible response for question
    responses: [{
        type: String,
        enum: []
    }],

    // ?
    responseType: {
        type: Number,
        required: true,
        enum: [1, 2, 3, 4, 5]
    },

    // What's the range
    pointsAvailable: {
        type: Number,
        required: true
    },

    // What's the range
    weighting: {
        type: Number,
        required: true
    },

    // Is this the reccommendation?
    reference: {
        type: String,
        required: true
    },

    // Which roles question should display for
    roles: [{
        type: Number,
        enum: [],
        required: true
    }],

    // Question can belong to multiple lifecycles
    lifecycle: [{
        type: Number,
        enum: [],
        required: true
    }],

    // Which Question and Response determine whether this question should be displayed
    parent: {
        type: Number
    }

    // TODO: Add test of schema to model
});

module.exports = mongoose.model("Question", QuestionSchema);