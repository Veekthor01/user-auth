const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const { getUserById, getUserByEmail, saveUser } = require('../user');

// Function to generate a password hash
async function generateHash(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Local authentication strategy for signup (email/password)
passport.use(
  'local-signup',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true, // Pass the req object to the callback below
    },
    async (req, email, password, done) => {
      try {
        // Check if the email is already taken
        const user = await getUserByEmail(email);
        if (user) {
          req.flash('error', 'Email is already taken.');
          return done(null, false);
        }
        const hashedPassword = await generateHash(password);
        const newUser = {
          email: email,
          password: hashedPassword,
        };
        // Save the new user to your database
        const savedUser = await saveUser(newUser);
        return done(null, savedUser);
      } catch (err) {
        req.flash('error', 'An error occurred during signup.');
        return done(err);
      }
    }
  )
);

// Local authentication strategy (email/password)
passport.use(
    'local',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
  async (req, email, password, done) => {
    try {
      const user = await getUserByEmail(email);
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// Serialization function to store user data in sessions
passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  
// Deserialization function to retrieve user data from sessions
 passport.deserializeUser(async (id, done) => {
    try {
     const user = await getUserById(id);
        done(null, user);
    } catch (err) {
     done(err);
    }
     });

module.exports = passport;
