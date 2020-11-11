const mongoose = require('mongoose');

const SubmissionSchema = mongoose.Schema({

    // user ID that owns this 
    userId: {
        type: Number,
        unique: true
    },

    // unique ID for a project that owns this submission
    projectId: {
        type: Number,
        unique: true
    },

    date: {
        type: Date,
        required: true
    },

    // Possible life cycles
    // reference to the id of the lifecycle
    lifecycle: {
        type: Number
    },


    // json file that gets output from survey.js
    submission: {
        type: Object,
        required: true
    }

    // TODO: Add test of schema to model
});

module.exports = mongoose.model("Submission", SubmissionSchema);