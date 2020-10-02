const mongoose = require('mongoose');

const ResponseSchema = mongoose.Schema({
    userID: Number

    // TODO: Add test of schema to model
});

module.exports = mongoose.model("Responses", ResponseSchema);