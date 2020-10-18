const mongoose = require('mongoose');

const TrustedAIProviderSchema = mongoose.Schema({

    // name of the trusted AI provider
    resource: {
        type: String
    },

    // description of the trusted AI provider
    description: {
        type: String
    },

    // Download link or URL to the trusted AI provider
    source: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model("TrustedAIProvider", TrustedAIProviderSchema);