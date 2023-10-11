import passport from 'passport';
import { Strategy as GithubStrategy } from 'passport-github2'
import dotenv from 'dotenv';
dotenv.config();

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;


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

passport.serializeUser(function(user, done) {
    done(null, user);
   });
   passport.deserializeUser(function(user, done) {
    done(null, user);
   });

export default passport;