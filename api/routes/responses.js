const express = require('express');
const router = express.Router();
const Response = require('../models/submission.model');

// Get all responses
router.get('/', async (req, res) => {
  try {
    const responses = await Response.find();
    res.json(responses);
  } catch (err) {
    res.json({ message: err });
  }
});

// Get responses by id
router.get('/:responseId', async (req, res) => {
  try {
    const response = await Response.findById(req.params.responseId);
    res.json(response);
  } catch (err) {
    res.json({ message: err });
  }
});

// Add new response
router.post('/', async (req, res) => {
  const response = new Response({
    userID: req.body.userID,
  });

  try {
    const savedResponse = await response.save();
    res.json(savedResponse);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
