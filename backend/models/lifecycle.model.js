const mongoose = require('mongoose');

const LifecycleSchema = mongoose.Schema({
    lifecycleID: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        enum: [null, 'Plan and Design', 'Data and Model', 'Verify and Validate', 'Deploy', 'Operate and Monitor'],
        required: true
    }

    // TODO: Add test of schema to model
});

module.exports = mongoose.model("Lifecycle", LifecycleSchema);