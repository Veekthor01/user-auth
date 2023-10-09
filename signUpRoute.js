import express from 'express';
import { Router } from "express";
import validator from 'validator';
import passport from 'passport';
import './passport.js';

const signupRouter = express.Router();

signupRouter.get('/', (req, res) => {
    // Render the signup page
    res.render('signup');
  });

// Signup route
signupRouter.post('/', (req, res) => {
    const { email, password } = req.body;
    // Validate the user input
    if (!validator.isEmail(email)) {
        req.flash("messages", { "error" : "Invalid email format" });
        res.locals.messages = req.flash();
       return res.redirect('/signup');
    }
    if (!validator.isLength(password, { min: 4 })) {
        req.flash("messages", { "error" : "Password should be at least 4 characters" });
        res.locals.messages = req.flash();
       return res.redirect('/signup');
    }
    // Pass the request to the authentication middleware
    passport.authenticate('local-signup', (err, user, info) => {
      if (err) {
        // Handle any errors that occurred during signup
       req.flash("messages", { "error" : "Error during signup" });
       res.locals.messages = req.flash();
       return res.redirect('/signup');
      } else if (!user) {
        // Handle the case where login failed
        if (info && info.message) {
          // Return the custom error message provided by Passport
           req.flash("messages", { "error" : info.message });
           res.locals.messages = req.flash();
            return res.redirect('/signup');
       } 
        else {
          // Default error message for login failure
            req.flash("messages", { "error" : "Signup failed" });
            res.locals.messages = req.flash();
            return res.redirect('/signup');
        }
      } else {
        // Signup was successful, you can optionally send a 200 OK response
        req.flash("messages", { "success" : "Signup successful" });
       return res.redirect("/dashboard");
      }
    })(req, res);
  });
  

export default signupRouter;
