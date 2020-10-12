const mongoose = require('mongoose');

const ResponseSchema = mongoose.Schema({
    responseNumber: {
        type: Number
    },

    indicator: {
        type: String
    },

    score: {
        type: Number
    },
});

module.exports = mongoose.model("Response", ResponseSchema);