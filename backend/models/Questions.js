const mongoose = require('mongoose');

const QuestionSchema = mongoose.Schema({
    questionNumber: {
        type: Numbers,
        required: true,
        unique: true
    },
    trustIndexDimension: String,
    // TODO: Add test of schema to model
});

module.exports = mongoose.model("Questions", QuestionSchema);