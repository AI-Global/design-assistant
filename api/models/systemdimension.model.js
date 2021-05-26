const mongoose = require('mongoose');

const SystemDimensionSchema = mongoose.Schema({
  systemID: {
    type: Number,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

});

module.exports = mongoose.model('SystemDimension', SystemDimensionSchema);
