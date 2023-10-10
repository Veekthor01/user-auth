import express from 'express';
import { Router } from "express";
import validator from 'validator';
import passport from 'passport';
import '../passport.js';

const signupRouter = express.Router();

signupRouter.get('/', (req, res) => {
  return res.render('signup', { messages: req.flash() });
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

export default signupRouter;
