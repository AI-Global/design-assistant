const express = require('express');
const router = express.Router();

// TASK-TODO: Remove this and use calls to the portal's api
// for getting/editing resources.
const TrustedAIResources = require('../models/trustedAIResource.model');

// Get all Trusted AI Providers
// TASK-TODO: Secure endpoint.
router.get('/', async (req, res) => {
  try {
    const trustedResources = await TrustedAIResources.find().sort('resource');
    res.json(trustedResources);
  } catch (err) {
    res.json({ message: err });
  }
});

// add a new resource
// TASK-TODO: Secure endpoint.
router.put('/', async (req, res) => {
  try {
    const resource = new TrustedAIResources(req.body);

    const savedResource = await resource.save();
    res.json(savedResource);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({
        source: {
          isInvalid: true,
          message: 'Trusted AI Resource with source already exists.',
        },
      });
    }
    res.json({ message: err });
  }
});

// delete a resource
// TASK-TODO: Secure endpoint.
router.delete('/:id', async (req, res) => {
  try {
    // Delete existing question in DB
    let doc = await TrustedAIResources.findByIdAndDelete(req.params.id);
    res.json(doc);
  } catch (err) {
    res.json({ message: err });
  }
});

// update a resource
// TASK-TODO: Secure endpoint.
router.put('/:id', async (req, res) => {
  try {
    const ret = await TrustedAIResources.findOneAndUpdate(
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
          message: 'Trusted AI Resource with source already exists.',
        },
      });
    }
    res.status(400).json({ message: err });
  }
});

module.exports = router;
