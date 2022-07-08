const fetch = require('node-fetch')
const User = require('../../api/models/user.model');
const jwt = require('jsonwebtoken');

const handler = async function (event) {
  const { username, password } = JSON.parse(event.body);
  if (!username || !password) {
    return {
      statusCode: 401,
      msg: 'Please fill in all the required fields'
    };
  }
  console.log(username, password)
  // return {
  //   statusCode: 200,
  //   body: JSON.stringify({ msg: 'data.joke' }),
  // }
  User.findOne({ username }).then((user) => {
    if (!user)
      return {
        statusCode: 402,
        username: {
          isInvalid: true,
          message: 'User does not exist. Please create an account.',
        },
      };
    if (!user.authenticate(password))
      return {
        statusCode: 403,
        password: { isInvalid: true, message: 'Incorrect password entered' },
      };
    jwt.sign(
      { id: user.id },
      jwtSecret,
      { expiresIn: sessionTimeout },
      (err, token) => {
        if (err) {
          console.warn(err);
          return {
            statusCode: 411,
            message: 'Authorization token could not be created'
          };
        }
        return {
          statusCode: 200,
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
          },
        };
      }
    );
  });
  // try {
  //   const response = await fetch('https://icanhazdadjoke.com', {
  //     headers: { Accept: 'application/json' },
  //   })
  //   if (!response.ok) {
  //     // NOT res.status >= 200 && res.status < 300
  //     return { statusCode: response.status, body: response.statusText }
  //   }
  //   const data = await response.json()

  //   return {
  //     statusCode: 200,
  //     body: JSON.stringify({ msg: data.joke }),
  //   }
  // } catch (error) {
  //   // output to netlify function log
  //   console.log(error)
  //   return {
  //     statusCode: 500,
  //     // Could be a custom message or object i.e. JSON.stringify(err)
  //     body: JSON.stringify({ msg: error.message }),
  //   }
  // }
}

module.exports = { handler }
