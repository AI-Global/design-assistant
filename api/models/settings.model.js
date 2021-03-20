const mongoose = require('mongoose');

const SettingsSchema = mongoose.Schema({
  settingsName: {
    type: String,
  },
  data: {
    type: Object,
  },
});

module.exports = mongoose.model('Settings', SettingsSchema);
