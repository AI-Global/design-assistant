const mongoose = require('mongoose');

const SubmissionSchema = mongoose.Schema({

    // username that owns this submission
    username: {
        type: Number,
        required: true,
        unique: true
    },

    // unique ID for a project that owns this submission
    projectId: {
        type: Number,
        required: true,
        unique: true
    },

    // Question can belong to multiple lifecycles
    lifecycle: Number,

    // json file that gets output from survey.js
    submission: {
        type: Object,
        required: true
    }

    // TODO: Add test of schema to model
});

module.exports = mongoose.model("Submission", SubmissionSchema);