const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Submission = require('../models/submission.model');

// Get all submissions
router.get('/', async (req, res) => {
    try {
        const submissions = await Submission.find();
        res.json(submissions);
        // print debug message
        console.log("Incoming submissions request");
    } catch (err) {
        res.json({ message: err });

    }
});

// Get submissions by user id

router.get('/user/:userId', async (req, res) => {
    try {
        await Submission.find({ userId: req.params.userId }).sort({ date: -1 }).then(submissions => {
            res.json({ submissions: submissions });
        });
    } catch (err) {
        // console.log("error returning user submissions", err)
        res.json({ message: err });
    }
});

router.post('/update/:submissionId', async (req, res) => {
    try {
        console.log("updating");
        const submissions = await Submission.findOneAndUpdate({ '_id': req.params.submissionId }, {
            submission: req.body.submission,
            date: req.body.date,
            projectName: req.body.projectName,
            completed: req.body.completed,
            lifecycle: req.body.lifecycle,
            domain: req.body.domain,
            region: req.body.region,
            roles: req.body.roles,
        }, {upsert:true, runValidators: true});
        // const submissions = await Submission.findOneAndUpdate({'_id' : req.params.submissionId}, {
        //     userId: req.body.userId,
        //     date: req.body.date,
        //     lifecycle: req.body.lifecycle,
        //     submission: req.body.submission,
        //     completed: req.body.completed
        // }, {upsert:true, runValidators: true});
        res.json(submissions);
    } catch (err) {
        res.json({ message: err });
    }
});

router.delete('/delete/:id', async (req, res) => {
    await Submission.findByIdAndDelete(req.params.id)
        .then(() => res.json('User submission deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});


// Add new submission
router.post('/', async (req, res) => {
    const submission = new Submission({
        userId: req.body.userId,
        projectName: req.body.projectName,
        date: req.body.date,
        lifecycle: req.body.lifecycle,
        domain: req.body.domain,
        region: req.body.region,
        roles: req.body.roles,
        submission: req.body.submission,
        completed: req.body.completed ? req.body.completed : false
    });

    try {
        const savedSubmission = await submission.save();
        // console.log("inserting");
        res.json(savedSubmission);
    } catch (err) {
        res.json({ message: err });
        // console.log("error to insert", err);
    }

});

module.exports = router;