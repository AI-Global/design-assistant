const mongoose = require('mongoose');

const AnalyticsSchema = mongoose.Schema({
  analyticName: {
    type: String,
  },
  embed: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Analytics', AnalyticsSchema);
