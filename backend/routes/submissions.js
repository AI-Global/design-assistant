const express = require('express');
const router = express.Router();
const Submission = require('../models/submission.model');

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

router.post('/update/:projectName', async (req, res) => {
    try{
        const submissions = await Submission.findOneAndUpdate({'projectName' : req.params.projectName}, req.body, {upsert:true, runValidators: true});
        res.json(submissions);
    } catch(err){
        res.json({message: err});
    }
});


// Add new submission
router.post('/', async (req, res) => {
    const submission = new Submission({
        userId: req.body.userId,
        projectName: req.body.projectId,
        date: req.body.date,
        lifecycle: req.body.lifecycle,
        submission: req.body.submission,
        completed: req.body.completed ? req.body.completed : false

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