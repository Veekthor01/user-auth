import express from 'express';
import { Router } from "express";
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();
import transporter from '../email.js';
import { connectToDB } from '../db.js';

const forgotPasswordRouter = express.Router();
const myEmail = process.env.EMAIL_HOST_USER;

function generateToken() {
    return crypto.randomBytes(20).toString('hex');
  }

forgotPasswordRouter.get('/', (req, res) => {
    res.render('forgotPassword');
  });

forgotPasswordRouter.post('/', async (req, res) => {
    const { email } = req.body;
    try {
      // Connect to your MongoDB database
      const db = await connectToDB();
      // Assuming you have a 'users' collection in your database
      const usersCollection = db.collection('user');
      // Find the user with the specified email
      const user = await usersCollection.findOne({ email });
      if (!user) {
        res.send('No user found with this email address.');
        return;
      }
      // Generate a unique token with an expiration time (e.g., 1 hour from now)
      const token = generateToken();
      const expirationTime = new Date();
      expirationTime.setHours(expirationTime.getHours() + 1); // Set an expiration time (1 hour from now)
      // Assuming you have a 'passwordResetTokens' collection in your database
      const passwordResetTokensCollection = db.collection('passwordResetTokens');
      // Store the password reset token with its expiration time in your database
      await passwordResetTokensCollection.insertOne({ token, userId: user._id, expirationTime });
      // Create a password reset link
      const resetLink = `http://localhost:3000/reset-password?token=${token}`;
      // Send an email with the reset link
      const mailOptions = {
        from: myEmail, // Replace with your email
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
  
  export default forgotPasswordRouter;