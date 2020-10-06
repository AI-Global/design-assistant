const mongoose = require('mongoose');

const ProjectSchema = mongoose.Schema({
    // user ID that owns this 
    userId: {
        type: Number,
        required: true,
        unique: true
    },

    // unique ID
    projectId: {
        type: Number,
        unique: true
    },

    // What are the different life cycles
    lifecycle: {
        type: Number,
        enum: []
    },
});


module.exports = mongoose.model("Project", ProjectSchema);