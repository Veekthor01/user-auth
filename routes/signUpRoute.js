const express = require('express');
const passport = require('passport');
const validator = require('validator');
require('../passport-config/passport');

const signupRouter = express.Router();

signupRouter.get('/', (req, res) => {
    try {
        return res.render('signup', { messages: req.flash() });
    } catch (error) {
        // Handle the error, for example, by sending an error response or logging it.
        console.error('An error occurred:', error);
        return res.status(500).send('An error occurred while rendering the signup page.');
    }
});

// Signup route
signupRouter.post('/', (req, res, next) => {
  const { email, password } = req.body;
  // Validate the user input
  if (!validator.isEmail(email)) {
    req.flash('error', 'Invalid email format');
    return res.render('signup', { messages: req.flash() }); // Redirect to the signup page
  }
  if (!validator.isLength(password, { min: 4 })) {
    req.flash('error', 'Password must be at least 4 characters');
    return res.render('signup', { messages: req.flash() }); // Redirect to the signup page
  }
  // Pass the request to the authentication middleware
  passport.authenticate('local-signup', (err, user, info) => {
    if (err) {
      req.flash('error', 'Error during signup');
      return res.render('signup', { messages: req.flash() }); // Redirect to the signup page
    } else if (!user) {
      if (info && info.message) {
        req.flash('error', info.message);
      } else {
        req.flash('error', 'Signup failed');
      }
      return res.render('signup', { messages: req.flash() }); // Redirect to the signup page
    } else {
      req.flash('success', 'Signup successful');
      return res.redirect('/dashboard'); // Redirect to the dashboard page
    }
  })(req, res, next);
});

module.exports = signupRouter;
