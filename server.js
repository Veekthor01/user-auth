import express from 'express';
import morgan from "morgan";
import helmet from "helmet";
import session from "express-session";
import passport from "passport";
import validator from 'validator';
import { default as connectMongoDBSession } from 'connect-mongodb-session';
import dotenv from 'dotenv';
dotenv.config();
import './passport.js';
import { connectToDB } from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;
const secretKey = process.env.SECRET_KEY;
const mongoURI = process.env.MONGODB_URI;
const MongoDBStore = connectMongoDBSession(session);

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
        uri: mongoURI,
        collection: 'session',
        expires: 1000 * 60 * 60 * 24 * 7, // 1 week
    }),
};

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

// Signup route
app.post('/signup', (req, res) => {
    const { email, password } = req.body;
    // Validate the user input
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    if (!validator.isLength(password, { min: 4 })) {
        return res.status(400).json({ error: 'Password must be at least 4 characters' });
    }
    // Pass the request to the authentication middleware
    passport.authenticate('local-signup', (err, user) => {
      if (err) {
        // Handle any errors that occurred during signup
        res.status(500).json({ error: 'Error during signup' });
      } else if (!user) {
        // Handle the case where the user is not found
        res.status(400).json({ error: 'Email is already registered.' });// Log errors
        console.error('signup failed:', err);
      } else {
        // Signup was successful, you can optionally send a 200 OK response
        res.status(200).json({ message: 'Signup successful' });
      }
    })(req, res);
  });
  
  // Login route
  app.post('/login', (req, res) => {
    passport.authenticate('local', (err, user) => {
      if (err) {
        // Handle any errors that occurred during login
        res.status(500).json({ error: 'Error during login' });
      } else if (!user) {
        // Handle the case where login failed
        res.status(400).json({ error: 'Login failed' });
      } else {
        // Login was successful, you can optionally send a 200 OK response
        res.status(200).json({ message: 'Login successful' });
      }
    })(req, res);
  });  

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: err.message });
  });

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
})