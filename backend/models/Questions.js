const mongoose = require('mongoose');

const QuestionSchema = mongoose.Schema({
    questionNumber: {
        type: Number,
        required: true,
        unique: true
    },
    trustIndexDimension: String,
    question: {
        type: String,
        required: true,
    }
    // TODO: Add test of schema to model
});

module.exports = mongoose.model("Questions", QuestionSchema);