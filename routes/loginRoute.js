import express from 'express';
import { Router } from "express";
import passport from 'passport';
import '../passport.js';

const loginRouter = express.Router();

loginRouter.get('/', (req, res) => {
    // Render the login page
    return res.render('login', { messages: req.flash() });
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
            // Login was successful, you can optionally send a 200 OK response
            req.flash("success", "Login successful");
            return res.redirect('/dashboard');
          }
        });
      }
    })(req, res);
  });  

  export default loginRouter;