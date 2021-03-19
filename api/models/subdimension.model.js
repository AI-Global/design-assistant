const mongoose = require('mongoose');

const SubDimensionSchema = mongoose.Schema({
  subDimensionID: {
    type: Number,
    required: true,
    unique: true,
  },

  dimensionID: {
    type: Number,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  maxRisk: {
    type: Number,
    required: true,
  },

  maxMitigation: {
    type: Number,
    required: true,
  },

});

module.exports = mongoose.model('SubDimension', SubDimensionSchema);
