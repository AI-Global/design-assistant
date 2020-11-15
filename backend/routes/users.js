const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const { json } = require('express');
const auth = require('../middleware/auth');
const owasp = require('owasp-password-strength-test');

const jwtSecret = process.env.JWT_SECRET;
const sessionTimeout = process.env.SESSION_TIMEOUT;

owasp.config({
    minLength: 8,
    minOptionalTestsToPass: 4,
})

router.post('/create', async (req,res) => {
    let errors = [];
    const {username, email, password, passwordConfirmation} = req.body;

    let result = owasp.test(password);
    if(result.strong == false){
        return res.status(400).json({password: {isInvalid: true, message: result.errors.join('\n')}})
    }

    // validation for password verification
    if (password != passwordConfirmation)
        return res.status(400).json({passwordConfirmation: { isInvalid: true  , message: "Those passwords didn't match. Try again." }});

    // create new user, send to db
    let user = new User({email, username, password});
    await user.save()
        .then(user => {
            jwt.sign(
                { id: user.id} ,
                    jwtSecret ,
                { expiresIn: sessionTimeout },
                (err, token) => {
                    if(err) return res.status(400).json({ message: "Authorization token could not be created"})
                    if(err) throw err;
                    res.json({
                        token,
                        user: {
                            id: user.id,
                            username: user.username,
                            email: user.email,
                        }
                    })
                }
            )
        })
        .catch(err => {
            // user already exists
            if (err.name === 'MongoError' && err.code === 11000){
                if(Object.keys(err.keyPattern).includes("username")){
                    return res.status(422).json({username: { isInvalid: true  , message: 'Username already exists!' }});
                }
                if(Object.keys(err.keyPattern).includes("email")){
                    return res.status(422).json({email: { isInvalid: true, message: 'User with Email Address already exists!' }});
                }
            }
            // unknown mongodb error
            return res.status(400).json(err);
        });
});

router.post('/auth', async(req, res) => {
    let errors = [];
    const { username, password } = req.body;
    if(!username || !password) {
        return res.status(400).json({ msg: 'Please fill in all the required fields'})
    }
    User.findOne({ username })
        .then(user => {
            if(!user) return res.status(400).json({username: { isInvalid: true, message: 'User does not exist. Please create an account.'}})
            if(!user.authenticate(password)) return res.status(400).json({password: { isInvalid: true, message: 'Incorrect password entered'}})
            jwt.sign(
                { id: user.id} ,
                    jwtSecret ,
                { expiresIn: sessionTimeout },
                (err, token) => {
                    if(err) return res.status(400).json({ message: "Authorization token could not be created"})
                    if(err) throw err;
                    res.json({
                        token,
                        user: {
                            id: user.id,
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


// Get all users
router.get('/', async (req, res) => {
    User.find()
        .then(users => res.status(200).send(users))
        .catch((err) => res.status(400).send(err));
});

// Get user by id
router.get('/:userId', (req, res) => {
    User.findOne({ _id: req.params.userId })
        .select('-hashedPassword -salt')
        .then(user => res.status(200).send(user))
        .catch((err) => res.status(400).send(err));
});


router.route('/:id').get((req, res) => {
    User.findById(req.params.id)
      .then(user => res.json(user))
      .catch(err => res.status(400).json('Error: ' + err));
  });

router.route('/:id').delete((req, res) => {
    User.findByIdAndDelete(req.params.id)
      .then(() => res.json('User deleted.'))
      .catch(err => res.status(400).json('Error: ' + err));
  });
  

module.exports = router;