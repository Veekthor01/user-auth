import express from 'express';
import morgan from "morgan";
import helmet from "helmet";
import session from "express-session";
import passport from "passport";
import { default as connectMongoDBSession } from 'connect-mongodb-session';
import dotenv from 'dotenv';
dotenv.config();
import './passport.js';
import { connectToDB } from './db.js';
const MongoDBStore = connectMongoDBSession(session);

const app = express();
const PORT = process.env.PORT || 3000;
const secretKey = process.env.SECRET_KEY;

connectToDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet.noSniff());
app.use(helmet.frameguard({ action: "sameorigin" }));
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'", "trusted-cdn.com"],
        styleSrc: ["'self'", "trusted-cdn.com"],
        scriptSrc: ["'self'", "trusted-cdn.com"],
    },
}));

const sessionConfig = {
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        sameSite: "none",
        httpOnly: true,
    },
    store: new MongoDBStore ({
        uri: process.env.MONGODB_URI,
        collection: 'session',
        expires: 1000 * 60 * 60 * 24 * 7, // 1 week
    }),
};

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

// Signup route
app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/dashboard',
    failureRedirect: '/signup',
    failureFlash: true, // Enable flash messages for failed signup attempts
  }));

  // Login route
app.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true, // Enable flash messages for failed login attempts
  }));

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
})