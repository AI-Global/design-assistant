const mongoose = require('mongoose');

const USER_ROLES = ['superadmin', 'admin', 'mod', 'member'];

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  role: {
    type: String,
    default: 'member',
    enum: USER_ROLES,
  },
  organization: {
    type: String,
  },
});

module.exports = mongoose.model('User', UserSchema);
