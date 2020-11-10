const express = require('express');
const router = express.Router();
const Submission = require('../models/submission.model');
const Response = require('../models/submission.model');


// Get all submissions
router.get('/', async (req,res) => {
    try{
        const submissions = await Submission.find();
        res.json(submissions);
        // print debug message
        console.log("Incoming submissions request");
    } catch(err){
        res.json({message: err});

    }
});

// Get submissions by user id

router.get('/:userId', async (req,res) => {
    try{
        const submissions = await Submission.find({'userId' : req.params.userId});
        res.json(submissions);
        // debug
        console.log("Incoming sumissions request by userId");

    } catch(err){
        res.json({message: err});
    }   
});


// Add new submission
router.post('/', async (req, res) => {
    const submission = new Submission({
        userId: req.body.userId,
        projectId: req.body.projectId,
        date: req.body.date,
        predeployment: req.body.predeployment,
        deployemnt: req.body.deployment,
        submission: req.body.submission
    });

    try{
        const savedSubmission = await submission.save();
        res.json(savedSubmission);
        // debug
        console.log("Post submissions request");
    } catch(err){
        res.json({message: err});
    }

});

module.exports = router;