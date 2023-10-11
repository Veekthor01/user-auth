import express from 'express';
import { Router } from "express";

const homeRouter = express.Router();

homeRouter.get('/', (req, res) => {
    req.flash("success", "Logout successful");
    return res.render('index', { messages: req.flash() });
 });

export default homeRouter;