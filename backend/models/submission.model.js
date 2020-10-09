const mongoose = require('mongoose');

const ResponseSchema = mongoose.Schema({

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

    // Possible life cycles
    lifecycle: [{
        type: String,
        enum: ['Plan and Design', 'Data and Model', 'Verify and Validate', 'Deploy', 'Operate and Monitor'],
        required: true
    }],

    // json file that gets output from survey.js
    submission: {
        type: Object,
        required: true
    }

    // TODO: Add test of schema to model
});

module.exports = mongoose.model("Response", ResponseSchema);