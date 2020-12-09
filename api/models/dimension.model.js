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
      'Accountability',
      'Explainability and Interpretability',
      'Data Quality',
      'Bias and Fairness',
      'Robustness',
    ],
    required: true,
  },
  label: {
    type: String,
    enum: ['A', 'EI', 'D', 'B', 'R'],
    required: true,
  },

  // TODO: Add test of schema to model
});

module.exports = mongoose.model('Dimension', DimensionSchema);
