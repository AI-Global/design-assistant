const express = require('express');
const router = express.Router();
const TrustedAIResources = require('../models/trustedAIResource.model');


// Get all Trusted AI Providers
router.get('/', async (req,res) => {
    try{
        const trustedResources = await TrustedAIResources.find();
        res.json(trustedResources);
    }catch(err){
        res.json({message: err});
    }
});

// add a new resource
router.put('/', async (req, res) => {
    try {
        const resource = new TrustedAIResources(
            req.body
        );

        const savedResource = await resource.save();
        res.json(savedResource);
    } catch (err) {
        res.json({ message: err });
    }

});


// delete a resource
router.delete('/:id', async (req, res) => {
    try {
        // Delete existing question in DB
        let doc = await TrustedAIResources.findOneAndDelete({ _id: req.params.id })
        res.json(doc);
    } catch (err) {
        res.json({ message: err });
    }

});

// update a resource
router.put('/:id', async (req, res) => {
    try{
        const ret = await TrustedAIResources.findOneAndUpdate({'_id' : req.params.id}, req.body
        , {upsert:true, runValidators: true});
        res.json(ret);
    } catch(err){
        // console.log("error updating", err);
        res.json({message: err});
    }
});

module.exports = router;