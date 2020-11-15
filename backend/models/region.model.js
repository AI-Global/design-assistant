const mongoose = require('mongoose');

const RegionSchema = mongoose.Schema({
    regionID: {
        type: Number,
        required: true,
        unique: true
    },
    // load in region names
    name: {
        type: String,
        required: true
    }

    // TODO: Add test of schema to model
});

module.exports = mongoose.model("Region", RegionSchema);