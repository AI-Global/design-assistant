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

  description: {
    type: String,
    required: false,
  },

  maxRisk: {
    type: Number,
    required: true,
  },

  maxMitigation: {
    type: Number,
    required: true,
  },

  weight: {
    type: Number,
  },
});

module.exports = mongoose.model('SubDimension', SubDimensionSchema);
