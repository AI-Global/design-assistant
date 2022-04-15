const mongoose = require('mongoose');

const DimensionSchema = mongoose.Schema({
  dimensionID: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    // Removed this to allow any dimension name
    // enum: [
    //   'Project Details',
    //   'Organization Maturity',
    //   'Accountability',
    //   'Data',
    //   'Fairness',
    //   'Interpretability',
    //   'Robustness',
    // ],
    required: true,
  },
  label: {
    type: String,
    enum: ['T', 'O', 'A', 'D', 'F', 'I', 'R'],
    required: true,
  },
  description: {
    type: String,
    required: false,
  },

  weight: {
    type: Number,
  },
});

module.exports = mongoose.model('Dimension', DimensionSchema);
