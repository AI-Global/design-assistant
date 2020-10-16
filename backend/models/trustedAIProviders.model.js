const mongoose = require('mongoose');

const TrustedAIProviderSchema = mongoose.Schema({

    // name of the trusted AI resource
    resource: {
        type: String
    },

    // description of the trusted AI resource
    description: {
        type: String
    },

    // Download link or URL to the trusted AI resource
    source: {
        type: String
    }
});

module.exports = mongoose.model("TrustedAIProvider", TrustedAIProviderSchema);