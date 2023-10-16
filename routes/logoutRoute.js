const express = require('express');
const logoutRouter = express.Router();

logoutRouter.get('/', (req, res) => {
  try {
      req.logout();
      req.flash('success', 'Logout successful');
      return res.redirect('/');
  } catch (error) {
      console.error('An error occurred:', error);
      return res.status(500).send('An error occurred while logging out.');
  }
});

module.exports = logoutRouter;