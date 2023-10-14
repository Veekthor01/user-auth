const express = require('express');
const dashboardRouter = express.Router();

dashboardRouter.get('/', (req, res) => {
    try {
        req.flash('success', 'Signup successful');
        return res.render('dashboard', { messages: req.flash() });
    } catch (error) {
        // Handle the error, for example, by sending an error response or logging it.
        console.error('An error occurred:', error);
        return res.status(500).send('An error occurred while rendering the dashboard page.');
    }
});

module.exports = dashboardRouter;
