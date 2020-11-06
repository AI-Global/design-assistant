const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const { json } = require('express');
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
            );
        });
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
});

// TODO: restrict endpoint to admin only TEST
router.get('/all', (req, res) => {
    // if (req.user.role != 'admin') {
    //     res.status(400).send("You are not authorized to view all users.");
    // }

    User.find()
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(400).send(err));
});

module.exports = router;