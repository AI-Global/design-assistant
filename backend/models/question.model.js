const mongoose = require('mongoose');
const Dimension = require('./dimension.model').schema;
const Domain = require('./domain.model').schema;
const Region = require('./region.model').schema;
const Role = require('./role.model').schema;
const Lifecycle = require('./lifecycle.model').schema;

const QuestionSchema = mongoose.Schema({
    uuid: {
        type: Number,
        required: true,
        unique: true
    },

    // numbered 0 to n-1
    questionNumber: {
        type: Number,
        required: true,
        unique: true
    },

    // 5 possible dimensions
    trustIndexDimension: Dimension,
    domainApplicability: Domain,
    regionalApplicability: Region,

    // mandatory or optional
    mandatory: Boolean,

    questionType: {
        type: String,
        enum: [null, 'Tombstone', 'Risk', 'Mitigation']
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
        enum: [0, 1, 2, 3]
    },

    // The recommendation?
    reference: {
        type: String
    },

    // Which roles question should display for
    roles: [Role],

    // Question can belong to multiple lifecycles
    lifecycle: Lifecycle,

    // Which Question and Response determine whether this question should be displayed
    parent: {
        questionNumber: {
            type: Number,
            required: true
        },
        responseNumber: {
            type: Number,
            required: true
        }
    }

    // TODO: Add test of schema to model
});

module.exports = mongoose.model("Question", QuestionSchema);