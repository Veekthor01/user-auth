const express = require('express');
const homeRouter = express.Router();

homeRouter.get('/', (req, res) => {
    try {
        req.flash("success", "Logout successful");
        res.render('index', { messages: req.flash() });
    } catch (error) {
        // Handle the error, for example, by sending an error response or logging it.
        console.error('An error occurred:', error);
        return res.status(500).send('An error occurred while rendering the home page.');
    }
});

module.exports = homeRouter;