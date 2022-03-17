const express = require('express');
const router = express.Router();
const Dimension = require('../models/dimension.model');

// Get dimensions
router.get('/', async (req, res) => {
  try {
    const dimensions = await Dimension.find().sort({ dimensionID: 1 });
    res.json(dimensions);
  } catch (err) {
    res.json({ message: err });
  }
});

// Get Dimension names
router.get('/names', async (req, res) => {
  try {
    const dimensions = await Dimension.find({}, 'name').sort({
      dimensionID: 1,
    });
    let dimensionNames = [];
    dimensions.forEach(function (item, index) {
      dimensionNames.push(item.name);
    });
    res.json({ dimensions: dimensionNames });
  } catch (err) {
    res.json({ message: err });
  }
});

// update a dimension
// TASK-TODO: Secure endpoint.
router.put('/:id', async (req, res) => {
  try {
    const ret = await Dimension.findOneAndUpdate(
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
          message: 'Dimension with source already exists.',
        },
      });
    }
    res.status(400).json({ message: err });
  }
});

// delete a dimension
// TASK-TODO: Secure endpoint.
router.delete('/:id', async (req, res) => {
  try {
    // Delete existing dimension in DB
    let doc = await Dimension.findByIdAndDelete(req.params.id);
    res.json(doc);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
