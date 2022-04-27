const mongoose = require('mongoose');

const SubmissionSchema = mongoose.Schema({
  // user ID that owns this
  userId: {
    type: mongoose.Types.ObjectId,
  },

  projectName: {
    type: String,
  },

  system: {
    type: [String],
  },

  date: {
    type: Date,
    required: true,
  },

  // Possible life cycles
  // reference to the id of the lifecycle
  lifecycle: {
    type: [Number],
  },

  domain: {
    type: [Number],
  },

  region: {
    type: [Number],
  },

  domainData: {
    type: [String],
  },

  regionData: {
    type: [String],
  },

  roles: {
    type: [Number],
  },

  // json file that gets output from survey.js
  submission: {
    type: Object,
    required: true,
  },

  completed: {
    type: Boolean,
    required: true,
  },

  riskLevel: {
    type: String,
  },

  userType: {
    type: String,
  },

  recommendations: {
    type: [Object],
  },

  // TODO: Add test of schema to model
});

module.exports = mongoose.model('Submission', SubmissionSchema);
