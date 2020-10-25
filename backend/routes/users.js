const express = require('express');
const router = express.Router();
const User = require('../models/user.model');

router.get('/', async (req,res) => {
    try{
        console.log("Incoming responses request");
    }catch(err){
        res.json({message: err});
    }
});

router.post('/createUser', async (req,res) => {
    let errors = [];
    try{
        const {name, username, email, password, passwordConfirmation} = req.body;
        if (!name || !email || !password || !passwordConfirmation || !username) {
            errors.push({ msg: 'Please fill in all the required fields' });
        }
        if (password != passwordConfirmation)
            errors.push({ msg: 'Passwords do not match' });
        if(errors.length > 0){
            return res.json({ errors: errors });
        } else {
            let user = new User({name, email, username, password});
            await user.save();
            return res.json({ user: user });
        }
    }catch(err){
        return res.json({ errors: [err] });
    }
});

module.exports = router;