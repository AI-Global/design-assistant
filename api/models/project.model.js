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

    // possible life cycles
    lifecycle: [{
        type: String,
        enum: ['Plan and Design', 'Data and Model', 'Verify and Validate', 'Deploy', 'Operate and Monitor']
    }],
});


module.exports = mongoose.model("Project", ProjectSchema);