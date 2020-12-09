const mongoose = require('mongoose');

const RoleSchema = mongoose.Schema({
  roleID: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    enum: [
      null,
      'Product Owner / Business Owner',
      'Risk Management',
      'Legal Lead',
      'IT Lead',
      'Technical Manager',
      'Software Engineer / Software Developer',
      'Product Design',
      'Data Scientist Lead',
      'Machine Learning Engineer',
      'Researcher',
      'Non Government Organization Volunteer',
      'Policy Analyst',
      'All',
    ],
    required: true,
  },

  // TODO: Add test of schema to model
});

module.exports = mongoose.model('Role', RoleSchema);
