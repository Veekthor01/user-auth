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
import { connectToDB } from './db.js';
import signupRouter from './signUpRoute.js'; // Adjust the path as needed
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

app.use(cookieParser());
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/signup', signupRouter);

// Define routes
app.get('/', (req, res) => {
    res.render('index');
 });
  
  app.get('/login', (req, res) => {
    // Render the login page
    res.render('login');
  });

 app.get('/dashboard', (req, res) => {
    req.flash('success', 'Signup successful');
    return res.render('dashboard', { messages: req.flash() });
 }); 
  
  // Login route
  app.post('/login', (req, res) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        // Handle any errors that occurred during login
        req.flash("error", "Error during login");
        return res.redirect("/login");
      } else if (!user) {
        // Handle the case where login failed
        if (info && info.message) {
          // Return the custom error message provided by Passport
            req.flash("error", info.message);
            return res.redirect("/login");
        } else {
          // Login was not successful
            req.flash("error", "Login failed");
            return res.redirect("/login");
        }
      } else {
        // Login was successful, use req.login() to establish the session
        req.login(user, (err) => {
          if (err) {
            // Handle the error if the session could not be established
            console.error('Error logging in:', err);
            req.flash("error", "Error logging in");
            return res.redirect("/login");
          } else {
            // Login was successful, you can optionally send a 200 OK response
            req.flash("success", "Login successful");
            return res.redirect("/dashboard");
          }
        });
      }
    })(req, res);
  });  

  app.get('/logout', (req, res) => {
    req.logout();
    req.flash("success", "Logout successful");
    res.redirect('/login');
  });
  

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: err.message });
  });

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
