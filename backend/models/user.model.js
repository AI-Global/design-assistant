const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        lowercase: true,
        required: true,
        // required: [true, "can't be blank"],
        unique: true,
        // match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true}
    },
    email: {
        type: String, 
        lowercase: true,
        required: true,
        // required: [true, "can't be blank"],
        unique: true,
        // match: [/\S+@\S+\.\S+/, 'is invalid'], index: true}
    },
    // company: {

    // },
    orgs: [{
        type: String
    }],
    name: {
        type: String
    },
    hashedPassword: {
        type: String
    },
    salt: {
        type: String
    }
});

module.exports = mongoose.model("User", UserSchema);