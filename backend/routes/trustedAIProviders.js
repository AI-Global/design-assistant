const express = require('express');
const router = express.Router();
const TrustedAIProviders = require('../models/trustedAIProvider.model');


// Get all Trusted AI Providers
router.get('/', async (req,res) => {
    try{
        const trustedProviders = await TrustedAIProviders.find().sort('resource');
        res.json(trustedProviders);
    }catch(err){
        res.json({message: err});
    }
});

// add a new provider
router.put('/', async (req, res) => {
    try {
        const provider = new TrustedAIProviders(
            req.body
        );

        const savedProvider = await provider.save();
        res.json(savedProvider);
    } catch (err) {
        res.json({ message: err });
    }

});

// delete a provider
router.delete('/:id', async (req, res) => {
    try {
        // Delete existing provider in DB
        let doc = await TrustedAIProviders.findByIdAndDelete(req.params.id)
        res.json(doc);
    } catch (err) {
        res.json({ message: err });
    }

});

// update a provider
router.put('/:id', async (req, res) => {
    try{
        const ret = await TrustedAIProviders.findOneAndUpdate({'_id' : req.params.id}, req.body
        , {upsert:true, runValidators: true, new: true});
        res.json(ret);
    } catch(err){
        // console.log("error updating", err);
        res.json({message: err});
    }
});
module.exports = router;