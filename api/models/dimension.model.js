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
      'Project Details',
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
    enum: ['T', 'O', 'A', 'D', 'F', 'I', 'R'],
    required: true,
  },

});

module.exports = mongoose.model('Dimension', DimensionSchema);
