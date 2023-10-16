const express = require('express');
const crypto = require('crypto');
require("dotenv").config();
const transporter = require('../email');
const { connectToDB } = require('../db');

const forgotPasswordRouter = express.Router();

const myEmail = process.env.EMAIL_HOST_USER;

// Function to generate a unique token to be sent by email to the user for password reset
function generateToken() {
    return crypto.randomBytes(20).toString('hex');
  }

  forgotPasswordRouter.get('/', (req, res) => {
    try {
        res.render('forgotPassword');
    } catch (error) {
        console.error('An error occurred:', error);
        return res.status(500).send('An error occurred while rendering the forgotPassword page.');
    }
});

forgotPasswordRouter.post('/', async (req, res) => {
    const { email } = req.body;
    try {
      const db = await connectToDB();
      const usersCollection = db.collection('user');
      // Find the user with the specified email
      const user = await usersCollection.findOne({ email });
      if (!user) {
        res.send('No user found with this email address.');
        return;
      }
      // Generate a unique token with an expiration time
      const token = generateToken();
      const expirationTime = new Date();
      expirationTime.setHours(expirationTime.getHours() + 1);
      // Create a collection to store the password reset tokens
      const passwordResetTokensCollection = db.collection('passwordResetTokens');
      // Store the password reset token with its expiration time in your database
      await passwordResetTokensCollection.insertOne({ token, userId: user._id, expirationTime });
      // Create a password reset link
      const resetLink = `http://localhost:3000/reset-password?token=${token}`;
      // Send an email with the reset link
      const mailOptions = {
        from: myEmail,
        to: email,
        subject: 'Password Reset',
        text: `Click this link to reset your password: ${resetLink}`,
      };
      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Email could not be sent:', error);
          res.send('Email could not be sent.');
        } else {
          console.log('Email sent:', info.response);
          res.send('Check your email for a password reset link.');
        }
      });
    } catch (error) {
      console.error('Error:', error);
      res.send('An error occurred while processing your request.');
    }
  });
  
module.exports = forgotPasswordRouter;