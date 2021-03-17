const mongoose = require('mongoose');

const DimensionSchema = mongoose.Schema({
  dimensionID: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    enum: [
      'Organization Maturity',
      'Accountability',
      'Data',
      'Fairness',
      'Interpretability',
      'Robustness',
    ],
    required: true,
  },
  label: {
    type: String,
    enum: ['O', 'A', 'D', 'F', 'I', 'R'],
    required: true,
  },

  // TODO: Add test of schema to model
});

module.exports = mongoose.model('Dimension', DimensionSchema);
