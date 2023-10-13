const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const connectMongoDBSession = require('connect-mongodb-session');
require('dotenv').config();
require('./passport-config/passport');
require('./passport-config/passportOauth');
const { connectToDB } = require('./db');
const homeRouter = require('./routes/homeRoute');
const signupRouter = require('./routes/signUpRoute');
const loginRouter = require('./routes/loginRoute');
const dashboardRouter = require('./routes/dashboardRoute');
const logoutRouter = require('./routes/logoutRoute');
const forgotPasswordRouter = require('./routes/forgotPasswordRoute');
const resetPasswordRouter = require('./routes/resetPasswordRoute');

const app = express();
const secretKey = process.env.SECRET_KEY;
const mongoURI = process.env.MONGODB_URI;
const MongoDBStore = connectMongoDBSession(session);

connectToDB();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet.noSniff());
app.use(helmet.frameguard({ action: "sameorigin" }));
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'", "trusted-cdn.com"],
        styleSrc: ["'self'", "trusted-cdn.com", "http://localhost:3000", 
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"],
        scriptSrc: ["'self'", "trusted-cdn.com", "'unsafe-inline'"],
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

app.use(cookieParser());
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', homeRouter);
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/dashboard', dashboardRouter);
app.use('/logout', logoutRouter);
app.use('/forgot-password', forgotPasswordRouter);
app.use('/reset-password', resetPasswordRouter);

// Github authentication route
app.get('/auth/github', 
passport.authenticate('github'));

// Github authentication callback
app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/dashboard');
  }
);

// Google authentication route
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile'] }));

// Google authentication callback
app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/dashboard');
    }
);
  
// Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: err.message });
  });

module.exports = app;