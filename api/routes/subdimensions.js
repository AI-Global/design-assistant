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

// update a subdimension
// TASK-TODO: Secure endpoint.
router.put('/:id', async (req, res) => {
  try {
    const ret = await SubDimension.findOneAndUpdate(
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
          message: 'Subdimension with source already exists.',
        },
      });
    }
    res.status(400).json({ message: err });
  }
});

// delete a subdimension
// TASK-TODO: Secure endpoint.
router.delete('/:id', async (req, res) => {
  try {
    // Delete existing subdimension in DB
    let doc = await SubDimension.findByIdAndDelete(req.params.id);
    res.json(doc);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;