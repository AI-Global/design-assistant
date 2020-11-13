const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
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

router.get('/user/:userId',  async (req,res) => {
    try{
        await Submission.find({userId : req.params.userId}).then(submissions => {
            res.json({submissions: submissions});
        });
    } catch(err){
        res.json({message: err});
    }   
});

router.post('/update/:submissionId', async (req, res) => {
    try{
        const submissions = await Submission.findOneAndUpdate({'_id' : req.params.submissionId}, {
            userId: req.body.userId,
            date: req.body.date,
            lifecycle: req.body.lifecycle,
            submission: req.body.submission,
            completed: req.body.completed
        }, {upsert:true, runValidators: true});
        res.json(submissions);
    } catch(err){
        res.json({message: err});
    }
});


// Add new submission
router.post('/', async (req, res) => {
    const submission = new Submission({
        userId: req.body.userId,
        projectName: req.body.projectName,
        date: req.body.date,
        lifecycle: req.body.lifecycle,
        submission: req.body.submission,
        completed: req.body.completed
    });

    try{
        const savedSubmission = await submission.save();
        res.json(savedSubmission);
    } catch(err){
        res.json({message: err});
    }

});

module.exports = router;