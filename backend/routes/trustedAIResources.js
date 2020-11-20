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

module.exports = router;