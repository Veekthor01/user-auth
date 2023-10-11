import express from 'express';
import { Router } from "express";

const logoutRouter = express.Router();

logoutRouter.get('/', (req, res) => {
    req.logout();
    req.flash("success", "Logout successful");
    return res.redirect('/');
  });

export default logoutRouter;