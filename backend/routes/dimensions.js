const express = require('express');
const router = express.Router();
const Dimension = require('../models/dimension.model');

// Get dimensions
router.get('/', async (req,res) => {
    try{
        const dimensions = await Dimension.find();
        res.json(submissions);
        // print debug message
        console.log("Incoming dimensions request");
    } catch(err){
        res.json({message: err});

    }
});

module.exports = router;