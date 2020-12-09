const mongoose = require('mongoose');

const DomainSchema = mongoose.Schema({
  domainID: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    enum: ['Health', 'Insurance', 'Banking', 'Media', 'Retail', 'Other'],
    required: true,
  },

  // TODO: Add test of schema to model
});

module.exports = mongoose.model('Domain', DomainSchema);
