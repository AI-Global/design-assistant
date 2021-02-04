const express = require('express');
const router = express.Router();
const TrustedAIProviders = require('../models/trustedAIProvider.model');

// Get all Trusted AI Providers
// TASK-TODO: Secure endpoint.
router.get('/', async (req, res) => {
  try {
    const trustedProviders = await TrustedAIProviders.find().sort('resource');
    res.json(trustedProviders);
  } catch (err) {
    res.json({ message: err });
  }
});

// add a new provider
// TASK-TODO: Secure endpoint.
router.put('/', async (req, res) => {
  try {
    const provider = new TrustedAIProviders(req.body);

    const savedProvider = await provider.save();
    res.json(savedProvider);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({
        source: {
          isInvalid: true,
          message: 'Trusted AI Provider with source already exists.',
        },
      });
    }
    res.json({ message: err });
  }
});

// delete a provider
// TASK-TODO: Secure endpoint.
router.delete('/:id', async (req, res) => {
  try {
    // Delete existing provider in DB
    let doc = await TrustedAIProviders.findByIdAndDelete(req.params.id);
    res.json(doc);
  } catch (err) {
    res.json({ message: err });
  }
});

// update a provider
// TASK-TODO: Secure endpoint.
router.put('/:id', async (req, res) => {
  try {
    const ret = await TrustedAIProviders.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { upsert: true, runValidators: true, new: true }
    );
    res.json(ret);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({
        source: {
          isInvalid: true,
          message: 'Trusted AI Provider with source already exists.',
        },
      });
    }
    res.status(400).json({ message: err });
  }
});
module.exports = router;
