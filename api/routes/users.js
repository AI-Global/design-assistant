const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { json } = require('express');
const auth = require('../middleware/auth');
const mailService = require('../middleware/mailService');

const jwtSecret = process.env.SECRET || 'devsecret';
const sessionTimeout = process.env.SESSION_TIMEOUT;

let createUser = async ({ username, email, organization, role }) => {
  let user = new User({ email, username, organization, role });
  await user.save();
  let emailSubject = 'Responsible AI Design Assistant Account Creation';
  let emailTemplate = 'api/emailTemplates/accountCreation.html';
  mailService.sendEmail(email, emailSubject, emailTemplate);
  return user;
};

// authenticate user - for login
router.post('/auth', async (req, res) => {
  const { accessToken } = req.body;
  let portal = require('./portal.util')(accessToken);
  let { user: portalUser } = await portal.get('/api/context');
  if (!portalUser) {
    return res.status(400).json({ msg: 'Unknown user' });
  }
  User.findOne({ username: portalUser.username }).then(async (user) => {
    if (!user) {
      // TASK-TODO: Decide what's the best way to map portal roles to DA roles
      let newRole = portalUser.role;
      if (newRole == 'admin') {
        newRole = 'superadmin';
      }
      // TASK-TODO: Use portal API to determine organization
      user = await createUser({
        username: portalUser.username,
        email: portalUser.email,
        organization: 'AI Global Beta User',
        role: newRole,
      });
    }
    jwt.sign(
      { id: user.id },
      jwtSecret,
      { expiresIn: sessionTimeout },
      (err, token) => {
        if (err) {
          console.warn(err);
          return res
            .status(400)
            .json({ message: 'Authorization token could not be created' });
        }
        return res.json({
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
          },
        });
      }
    );
  });
});

// find user by auth token
// TASK-TODO: Secure endpoint.
router.get('/user', auth, (req, res) => {
  User.findById(req.user.id)
    .select('-hashedPassword -salt')
    .then((user) => res.json(user));
});

// check if valid authentication token
// TASK-TODO: Secure endpoint.
router.get('/isLoggedIn', auth, (req, res) => {
  if (req.user) {
    res.json({ isLoggedIn: 'true' });
  }
});

// Get all users
// TASK-TODO: Secure endpoint.
router.get('/', async (req, res) => {
  User.find()
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(400).send(err));
});

// Get user by id
// TASK-TODO: Secure endpoint.
router.get('/:userId', (req, res) => {
  User.findOne({ _id: req.params.userId })
    .select('-hashedPassword -salt')
    .then((user) => res.status(200).send(user))
    .catch((err) => res.status(400).send(err));
});

// TASK-TODO: Secure endpoint.
router.route('/:id').get((req, res) => {
  User.findById(req.params.id)
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json('Error: ' + err));
});

// TASK-TODO: Secure endpoint.
router.route('/:id').delete((req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.json('User deleted.'))
    .catch((err) => res.status(400).json('Error: ' + err));
});

// update email of current user
// TASK-TODO: Secure endpoint.
router.post('/updateEmail', auth, (req, res) => {
  // error with authentication token
  if (!req.user) {
    return res.json();
  }
  let newEmail = req.body.newEmail;
  let password = req.body.password;
  User.findById(req.user.id)
    .select()
    .then((existingUser) => {
      if (!existingUser)
        return res.status(400).json({
          username: {
            isInvalid: true,
            message: 'User does not exist. Please create an account.',
          },
        });
      if (!existingUser.authenticate(password))
        return res.status(400).json({
          password: {
            isInvalid: true,
            message: 'Incorrect password entered',
          },
        });
      existingUser.email = newEmail;
      User.findByIdAndUpdate(req.user.id, existingUser, { upsert: false })
        .then((user) => {
          res.json(user);
        })
        .catch((err) => {
          // user already exists
          if (err.name === 'MongoError' && err.code === 11000) {
            if (Object.keys(err.keyPattern).includes('email')) {
              return res.status(422).json({
                email: {
                  isInvalid: true,
                  message: 'User with Email Address already exists!',
                },
              });
            }
          }
          // unknown mongodb error
          return res.status(400).json(err);
        });
    });
});

// update username of current user
// TASK-TODO: Secure endpoint.
router.post('/updateUsername', auth, (req, res) => {
  // error with authentication token
  if (!req.user) {
    return res.json();
  }
  let newUsername = req.body.newUsername;
  let password = req.body.password;
  User.findById(req.user.id)
    .select()
    .then((existingUser) => {
      if (!existingUser)
        return res.status(400).json({
          username: {
            isInvalid: true,
            message: 'User does not exist. Please create an account.',
          },
        });
      if (!existingUser.authenticate(password))
        return res.status(400).json({
          password: {
            isInvalid: true,
            message: 'Incorrect password entered',
          },
        });
      existingUser.username = newUsername;
      User.findByIdAndUpdate(req.user.id, existingUser, { upsert: false })
        .then((user) => {
          res.json(user);
        })
        .catch((err) => {
          // user already exists
          if (err.name === 'MongoError' && err.code === 11000) {
            if (Object.keys(err.keyPattern).includes('username')) {
              return res.status(422).json({
                username: {
                  isInvalid: true,
                  message: 'Username already exists!',
                },
              });
            }
          }
          // unknown mongodb error
          return res.status(400).json(err);
        });
    });
});

// /update password of current user
// TASK-TODO: Secure endpoint.
router.post('/updatePassword', auth, (req, res) => {
  // error with authentication token
  if (!req.user) {
    return res.json();
  }
  let password = req.body.password;
  let newPassword = req.body.newPassword;
  let result = owasp.test(newPassword);
  if (result.strong == false) {
    return res.status(400).json({
      newPassword: { isInvalid: true, message: result.errors.join('\n') },
    });
  }

  User.findById(req.user.id)
    .select()
    .then((existingUser) => {
      if (!existingUser)
        return res.status(400).json({
          username: {
            isInvalid: true,
            message: 'User does not exist. Please create an account.',
          },
        });
      if (!existingUser.authenticate(password))
        return res.status(400).json({
          password: {
            isInvalid: true,
            message: 'Incorrect password entered',
          },
        });
      existingUser.password = newPassword;
      User.findByIdAndUpdate(req.user.id, existingUser, { upsert: false }).then(
        (user) => {
          res.json(user);
        }
      );
    })
    .catch((err) => {
      // unknown mongodb error
      return res.status(400).json(err);
    });
});

// TASK-TODO: Secure endpoint.
router.post('/updateOrganization', auth, (req, res) => {
  // error with authentication token
  if (!req.user) {
    return res.json();
  }
  let newOrganization = req.body.newOrganization;
  let password = req.body.password;
  User.findById(req.user.id)
    .select()
    .then((existingUser) => {
      if (!existingUser)
        return res.status(400).json({
          organization: {
            isInvalid: true,
            message: 'User does not exist. Please create an account.',
          },
        });
      if (!existingUser.authenticate(password))
        return res.status(400).json({
          password: {
            isInvalid: true,
            message: 'Incorrect password entered',
          },
        });
      existingUser.organization = newOrganization;
      User.findByIdAndUpdate(req.user.id, existingUser, { upsert: true }).then(
        (user) => {
          res.json(user);
        }
      );
    });
});

// User Put endpoint
// note findOneAndUpdate does not support validation
// TASK-TODO: Secure endpoint.
router.put('/:userId', async (req, res) => {
  try {
    // Update existing user in DB
    var response = await User.findOneAndUpdate(
      { _id: req.params.userId },
      req.body
    ).select('-hashedPassword -salt');

    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

module.exports = router;
