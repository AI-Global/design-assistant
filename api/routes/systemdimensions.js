const express = require('express');
const router = express.Router();
const SystemDimension = require('../models/systemdimension.model');

// Get system dimensions
router.get('/', async (req, res) => {
  try {
    const systemDimensions = await SystemDimension.find().sort({ systemID: 1 });
    //res.json(subdimensions);
    res.status(200).send(systemDimensions);
  } catch (err) {
    res.status(400).send(err)
  }
});

module.exports = router;