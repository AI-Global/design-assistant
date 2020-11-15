const express = require('express');
const router = express.Router();
const Analytic = require('../models/analytics.model');

// Get all Analytics
router.get('/', async (req,res) => {
    try{
        const analytics = await Analytic.find();
        res.json(analytics);
    }catch(err){
        res.json({message: err});
    }
});

// Add new Analytics
router.post('/', async (req, res) => {
    try {
        // Create new Analytic and insert into DB
        const analytic = new Analytic(
            req.body
        )

        const savedAnalytic = await analytic.save();
        res.json(savedAnalytic);
    } catch (err) {
        res.json({ message: err });
    }

});

module.exports = router;