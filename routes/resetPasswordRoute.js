import express from 'express';
import { Router } from 'express';
import { connectToDB } from '../db.js';

const resetPasswordRouter = express.Router();

resetPasswordRouter.get('/', async (req, res) => {
  const token = req.query.token;
  try {
    const tokenData = await passwordResetTokensCollection.findOne({ token });
    if (!tokenData || new Date() > tokenData.expirationTime) {
      res.send('Invalid or expired token.');
    } else {
      res.render('resetPassword', { token });
    }
  } catch (error) {
    console.error('Error:', error);
    res.send('An error occurred while processing your request.');
  }
});

resetPasswordRouter.post('/', async (req, res) => {
  const token = req.body.token;
  const newPassword = req.body.newPassword;
  try {
    // Connect to your MongoDB database
    const db = await connectToDB();
    // Assuming you have a 'passwordResetTokens' collection in your database
    const passwordResetTokensCollection = db.collection('passwordResetTokens');
    // Find the token in your database
    const tokenData = await passwordResetTokensCollection.findOne({ token });
    if (!tokenData) {
      res.send('Invalid or expired token.');
      return;
    }
    // Assuming you have a 'users' collection in your database
    const usersCollection = db.collection('user');
    // Find the user with the associated user ID
    const user = await usersCollection.findOne({ _id: tokenData.userId });
    if (!user) {
      res.send('User not found.');
      return;
    }
    // Update the user's password in your database
    await usersCollection.updateOne({ _id: user._id }, { $set: { password: newPassword } });
    // Remove the used token from your database
    await passwordResetTokensCollection.deleteOne({ token: token });
    res.send('Password reset successful.');
  } catch (error) {
    console.error('Error:', error);
    res.send('An error occurred while processing your request.');
  }
});

export default resetPasswordRouter;
