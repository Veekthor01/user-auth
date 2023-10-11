import express from 'express';
import morgan from "morgan";
import helmet from "helmet";
import session from "express-session";
import passport from "passport";
import validator from 'validator';
import path from 'path';
import flash from 'express-flash';
import cookieParser from 'cookie-parser';
import { default as connectMongoDBSession } from 'connect-mongodb-session';
import dotenv from 'dotenv';
dotenv.config();
import './passport.js';
import './passportOauth.js';
import { connectToDB } from './db.js';
import homeRouter from './routes/homeRoute.js';
import signupRouter from './routes/signUpRoute.js';
import loginRouter from './routes/loginRoute.js';
import dashboardRouter from './routes/dashboardRoute.js';
import logoutRouter from './routes/logoutRoute.js';
// This is needed to get the current directory name in ES modules
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
// This above is needed to get the current directory name in ES modules

const app = express();
const PORT = process.env.PORT || 3000;
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
        styleSrc: ["'self'", "trusted-cdn.com", "http://localhost:3000"],
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
  
// Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: err.message });
  });

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
