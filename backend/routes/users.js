const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const jwt = require("jsonwebtoken");
const { json } = require('express');
require('dotenv').config();
const auth = require('../middleware/auth');

const jwtSecret = process.env.JWT_SECRET;
const sessionTimeout = process.env.SESSION_TIMEOUT | 0;

router.post('/create', async (req,res) => {
    let errors = [];
    try{
        const {name, username, email, password, passwordConfirmation} = req.body;

        // verification for empty fields
        if (!name || !email || !password || !passwordConfirmation || !username) {
            return res.status(400).json({ msg: 'Please fill in all the required fields' });
        }

        // validation for password verification
        if (password != passwordConfirmation)
            return res.status(400).json({ msg: 'Passwords do not match' });

        // create new user, send to db
        let user = new User({name, email, username, password});   
        await user.save()
            .then(user => {
                jwt.sign(
                    { id: user.id} ,
                        jwtSecret ,
                    { expiresIn: sessionTimeout },
                    (err, token) => {
                        if(err) throw err;
                        res.json({
                            token,
                            user: {
                                id: user.id,
                                name: user.name,
                                username: user.username,
                                email: user.email,
                            }
                        })
                    }
                )
            })
    } catch(err){
        // unexpected error
        console.log(err);
        return res.status(400).json({ errors: [err] });
    }
});

router.post('/auth', async(req, res) => {
    console.log("test");
    let errors = [];
    const { username, password } = req.body;
    if(!username || !password) {
        return res.status(400).json({ msg: 'Please fill in all the required fields'})
    }
    User.findOne({ username })
        .then(user => {
            if(!user) return res.status(400).json({ msg: 'Username does not exist'})
            if(!user.authenticate(password)) return res.status(400).json({ msg: 'Incorrect password entered'})
            jwt.sign(
                { id: user.id} ,
                    jwtSecret ,
                { expiresIn: sessionTimeout },
                (err, token) => {
                    if(err) return res.status(400).json({msg: "Authorization token could not be created"})
                    res.json({
                        token: token,
                        user: {
                            id: user.id,
                            name: user.name,
                            username: user.username,
                            email: user.email,
                        }
                    })
                }
            )
        })
});

router.get('/user', auth, (req, res) => {
    User.findById(req.user.id)
        .select('-hashedPassword -salt')
        .then(user => res.json(user))
});

router.get('/isLoggedIn', auth, (req, res) => {
    if(req.user){
        res.json({isLoggedIn: "true"});
    }
})

module.exports = router;