const mongoose = require('mongoose');

const TrustedAIResourceSchema = mongoose.Schema({
  // name of the trusted AI resource
  resource: {
    type: String,
  },

  // description of the trusted AI resource
  description: {
    type: String,
  },

  // Download link or URL to the trusted AI resource
  source: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model('TrustedAIResource', TrustedAIResourceSchema);
