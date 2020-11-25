const express = require('express');
const router = express.Router();
const Dimension = require('../models/dimension.model');

// Get dimensions
router.get('/', async (req,res) => {
    try{
        const dimensions = await Dimension.find().sort({ dimensionID: 1 });
        res.json(dimensions);
        // print debug message
        console.log("Incoming dimensions request");
    } catch(err){
        res.json({message: err});

    }
});

router.get('/names', async (req,res) => {
    try{
        const dimensions = await Dimension.find({}, 'name').sort({ dimensionID: 1 });
        let dimensionNames = [];
        dimensions.forEach(function (item, index) {
            dimensionNames.push(item.name);
        })
        res.json({ dimensions: dimensionNames });
        // print debug message
        console.log("Incoming dimensions request");
    } catch(err){
        res.json({message: err});

    }
});

module.exports = router;