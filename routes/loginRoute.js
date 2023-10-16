const express = require('express');
const passport = require('passport');
require('../passport-config/passport');

const loginRouter = express.Router();

loginRouter.get('/', (req, res) => {
    try {
        res.render('login', { messages: req.flash() });
    } catch (error) {
        console.error('An error occurred:', error);
        return res.status(500).send('An error occurred while rendering the login page.');
    }
});

loginRouter.post('/', (req, res) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        // Handle any errors that occurred during login
        req.flash("error", "Error during login");
       return res.render('login', { messages: req.flash() });
      } else if (!user) {
        // Handle the case where login failed
        if (info && info.message) {
          // Return the custom error message provided by Passport
            req.flash("error", info.message);
            return res.render('login', { messages: req.flash() });
        } else {
          // Login was not successful
            req.flash("error", "Login failed");
            return res.render('login', { messages: req.flash() });
        }
      } else {
        // Login was successful, use req.login() to establish the session
        req.login(user, (err) => {
          if (err) {
            // Handle the error if the session could not be established
            console.error('Error logging in:', err);
            req.flash("error", "Error logging in");
            return res.render('login', { messages: req.flash() });
          } else {
            // Login was successful
            req.flash("success", "Login successful");
            return res.redirect('/dashboard');
          }
        });
      }
    })(req, res);
  });  

module.exports = loginRouter;