const express = require('express');
const router = express.Router();
const TrustedAIProviders = require('../models/trustedAIProviders.model');


// Get all Trusted AI Providers
router.get('/', async (req,res) => {
    try{
        const trustedProviders = await TrustedAIProviders.find();
        res.json(trustedProviders);
    }catch(err){
        res.json({message: err});
    }
});

module.exports = router;