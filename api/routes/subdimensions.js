const express = require('express');
const router = express.Router();
const SubDimension = require('../models/subdimension.model');

// Get subdimensions
router.get('/', async (req, res) => {
  try {
    const subdimensions = await SubDimension.find().sort({ subdimensionID: 1 });
    //res.json(subdimensions);
    res.status(200).send(subdimensions);
  } catch (err) {
    res.status(400).send(err)
  }
});

module.exports = router;