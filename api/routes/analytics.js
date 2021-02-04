const express = require('express');
const router = express.Router();
const Analytic = require('../models/analytics.model');

// Get all Analytics
// TASK-TODO: Secure endpoint.
router.get('/', async (req, res) => {
  Analytic.find()
    .then((analytics) => res.status(200).send({ analytics: analytics }))
    .catch((err) => res.status(500).send(err));
});

// Add new Analytics
// TASK-TODO: Secure endpoint.
router.post('/', async (req, res) => {
  try {
    // Create new Analytic and insert into DB
    const analytic = new Analytic(req.body);

    const savedAnalytic = await analytic.save();
    res.json(savedAnalytic);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
