const mongoose = require('mongoose');

const SubmissionSchema = mongoose.Schema({

    // user ID that owns this 
    userId: {
        type: Number,
        required: true,
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
    predeployment: {
        type: String,
        enum: ['Plan and Design', 'Data and Model']
    },

    deployment: {
        type: String,
        enum: ['Verify and Validate', 'Deploy', 'Operate and Monitor'],
    },


    // json file that gets output from survey.js
    submission: {
        type: Object,
        required: true
    }

    // TODO: Add test of schema to model
});

module.exports = mongoose.model("Submission", SubmissionSchema);