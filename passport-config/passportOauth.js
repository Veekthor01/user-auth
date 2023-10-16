const passport = require('passport');
const GithubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Github Strategy for Passport Authentication
passport.use(
    new GithubStrategy(
        {
            clientID: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/auth/github/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            return done(null, profile);
    } 
  )
);

// Google Strategy for Passport Authentication
passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            return done(null, profile);
        }
    )
);

passport.serializeUser(function(user, done) {
    done(null, user);
   });

passport.deserializeUser(function(user, done) {
    done(null, user);
   });

module.exports = passport;