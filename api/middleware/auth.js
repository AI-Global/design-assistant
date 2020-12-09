const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtSecret = process.env.SECRET || 'devsecret';

function auth(req, res, next) {
  try {
    const token = req.header('x-auth-token');
    if (!token) {
      return res
        .status(401)
        .json({ msg: 'Authorization denied, token missing' });
    }

    const verified = jwt.verify(token, jwtSecret);

    req.user = verified;
    next();
  } catch (e) {
    res.status(400).json({ msg: 'Invalid Token' });
  }
}

module.exports = auth;
