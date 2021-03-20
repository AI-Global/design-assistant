const express = require('express');
const router = express.Router();
const Settings = require('../models/settings.model');

// TASK-TODO: Secure endpoint.
router.get('/', async (req, res) => {
  Settings.find()
    .then((settings) => res.status(200).send(settings))
    .catch((err) => res.status(500).send(err));
});

module.exports = router;
