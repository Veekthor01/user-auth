import express from 'express';
import { Router } from "express";

const dashboardRouter = express.Router();

dashboardRouter.get('/', (req, res) => {
    req.flash('success', 'Signup successful');
    return res.render('dashboard', { messages: req.flash() });
 }); 

export default dashboardRouter;